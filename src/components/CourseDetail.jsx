import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import courseData from "../data/courseData";
import lessonsData from "../data/lessonsData";
import { useUser } from "../contexts/UserContext";
import CertificatePreview from "./CertificatePreview";
import { quickCoursePersonaDelta } from "../utils/personaEngine";
// import API_URL from "../config/api";

const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * CourseDetail.jsx
 * - Backend-first friendly
 * - Optimistic UI with server sync fallback
 * - Uses functions exposed by UserContext:
 *   loadUserProfile, enrollInCourse, setEnrolledCourses, setCourseProgress, updatePersonaScore
 */

export default function CourseDetail() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const course = courseData.find((c) => c.slug === courseSlug);
  const lessons = lessonsData[courseSlug] || [];

  // Pull the context and prefer server-aware helpers when available.
  const {
    user,
    token,
    enrolledCourses = [],
    enrollInCourse,
    loadUserProfile,
    courseProgress = {},
    updatePersonaScore,
    setEnrolledCourses,
    setCourseProgress,
  } = useUser() || {};

  // Local UI state
  const [toast, setToast] = useState(null);
  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [syncingServer, setSyncingServer] = useState(false);

  // show toast helper
  const showToast = useCallback((msg, ms = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }, []);

  // Auto persona scoring (one-time per course view)
  useEffect(() => {
    if (!user || !course || typeof updatePersonaScore !== "function") return;
    try {
      const deltas = quickCoursePersonaDelta(course);
      if (deltas && Object.keys(deltas).length > 0) {
        updatePersonaScore(deltas);
      }
    } catch (err) {
      // keep UI responsive
      // eslint-disable-next-line no-console
      console.warn("Persona scoring skipped:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, user]);

  // Attempt to hydrate enrolled courses + progress from server when possible.
  useEffect(() => {
    let cancelled = false;

    async function syncFromServer() {
      // require uid and a token (token may come from context or localStorage)
      try {
        const localToken =
          token ||
          (typeof window !== "undefined"
            ? window.localStorage.getItem("cybercode_token")
            : null);

        if (!user?.uid || !localToken) return;

        setSyncingServer(true);

        const res = await fetch(`${API_URL}/user/${user.uid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localToken}`,
          },
        });

        if (!res.ok) {
          setSyncingServer(false);
          return;
        }

        const j = await res.json().catch(() => null);
        if (!j || cancelled) {
          setSyncingServer(false);
          return;
        }

        // enrolledCourses
        if (Array.isArray(j.enrolledCourses) && typeof setEnrolledCourses === "function") {
          setEnrolledCourses(j.enrolledCourses);
        }

        // courseProgress: support multiple shapes
        if (j.user?.courseProgress && typeof setCourseProgress === "function") {
          setCourseProgress(j.user.courseProgress);
        } else if (j.courseProgress && typeof setCourseProgress === "function") {
          setCourseProgress(j.courseProgress);
        }

        setSyncingServer(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("syncFromServer failed", err);
        setSyncingServer(false);
      }
    }

    syncFromServer();

    return () => {
      cancelled = true;
    };
    // intentionally depend on user.uid so it runs when user logs in/out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  // Derived flags
  const isEnrolled = useMemo(
    () => !!user && Array.isArray(enrolledCourses) && enrolledCourses.includes(courseSlug),
    [user, enrolledCourses, courseSlug]
  );

  const progressData = useMemo(
    () =>
      (courseProgress && courseProgress[courseSlug]) || {
        completedLessons: [],
        currentLessonIndex: 0,
      },
    [courseProgress, courseSlug]
  );

  const progressPercent = useMemo(() => {
    return lessons.length > 0
      ? Math.round(((Array.isArray(progressData.completedLessons) ? progressData.completedLessons.length : 0) / lessons.length) * 100)
      : 0;
  }, [lessons.length, progressData]);

  // Enrollment flow — prefers server call, falls back to optimistic local update
  const handleEnroll = async () => {
    if (!user) {
      showToast("Please login to enroll.");
      // store redirect so after login user returns here
      try {
        sessionStorage.setItem("redirectAfterLogin", `/enroll/${courseSlug}`);
      } catch {}
      navigate("/register");
      return;
    }

    setLoadingEnroll(true);

    // prefer token from context, fallback to localStorage
    const localToken = token || (typeof window !== "undefined" ? window.localStorage.getItem("cybercode_token") : null);

    if (localToken) {
      try {
        const resp = await fetch(`${API_URL}/user/enroll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localToken}`,
          },
          body: JSON.stringify({ courseSlug }),
        });

        if (!resp.ok) {
          // server attempt failed — fallback to local optimistic
          showToast("Server enroll failed — falling back to local enroll.");
          if (typeof enrollInCourse === "function") {
            await enrollInCourse(courseSlug);
          } else {
            // best-effort local update if provider doesn't expose enrollInCourse
            try {
              const next = Array.isArray(enrolledCourses) ? [...enrolledCourses] : [];
              if (!next.includes(courseSlug)) next.push(courseSlug);
              if (typeof setEnrolledCourses === "function") setEnrolledCourses(next);
            } catch {}
          }
          setLoadingEnroll(false);
          return;
        }

        // success — update local state via provider
        if (typeof enrollInCourse === "function") {
          await enrollInCourse(courseSlug);
        } else {
          try {
            const next = Array.isArray(enrolledCourses) ? [...enrolledCourses] : [];
            if (!next.includes(courseSlug)) next.push(courseSlug);
            if (typeof setEnrolledCourses === "function") setEnrolledCourses(next);
          } catch {}
        }

        // refresh profile from server if helper present
        if (typeof loadUserProfile === "function") {
          await loadUserProfile(user.uid).catch(() => {});
        }

        showToast(`Successfully enrolled in "${course?.title || courseSlug}"`);
        setLoadingEnroll(false);
        return;
      } catch (err) {
        // fallback local
        // eslint-disable-next-line no-console
        console.error("Enroll (server) failed:", err);
        try {
          if (typeof enrollInCourse === "function") {
            await enrollInCourse(courseSlug);
          } else if (typeof setEnrolledCourses === "function") {
            const next = Array.isArray(enrolledCourses) ? [...enrolledCourses] : [];
            if (!next.includes(courseSlug)) next.push(courseSlug);
            setEnrolledCourses(next);
          }
          showToast("Enrolled locally (offline mode).");
        } catch (e) {
          showToast("Enrollment failed. Try again.");
        } finally {
          setLoadingEnroll(false);
        }
        return;
      }
    }

    // No token: local optimistic enroll
    try {
      if (typeof enrollInCourse === "function") {
        await enrollInCourse(courseSlug);
      } else if (typeof setEnrolledCourses === "function") {
        const next = Array.isArray(enrolledCourses) ? [...enrolledCourses] : [];
        if (!next.includes(courseSlug)) next.push(courseSlug);
        setEnrolledCourses(next);
      }
      showToast(`You're enrolled (Free) — basic lessons unlocked for "${courseSlug}".`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Enrollment failed (local):", err);
      showToast("Enrollment failed. Please try again.");
    } finally {
      setLoadingEnroll(false);
    }
  };

  if (!course) {
    return (
      <div className="text-center py-20 text-red-600">
        <h2 className="text-3xl font-bold">Course not found</h2>
        <Link to="/" className="text-indigo-600 underline">
          Back Home
        </Link>
      </div>
    );
  }

  // small UI helpers
  const goToFirstLesson = () => {
    if (!lessons.length) {
      showToast("Lessons not available yet.");
      return;
    }
    navigate(`/courses/${courseSlug}/lessons/${lessons[0].slug}`);
  };

  return (
    <div className="text-left relative">
      {/* Toast Alert */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
        >
          {toast}
        </div>
      )}

      {/* Banner */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-20 px-4 shadow-md rounded-xl mx-auto max-w-6xl mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {course.title}
          </h1>
          <p className="text-lg md:text-xl text-indigo-100">{course.description}</p>

          {/* Small trust chip */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-indigo-100/90">
            <span className="px-3 py-1 rounded-full bg-black/20 border border-indigo-300/40">
              🔐 Real-world, job-focused curriculum
            </span>
            <span className="px-3 py-1 rounded-full bg-black/20 border border-indigo-300/40">
              🎓 Guided path from basics to advanced
            </span>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="max-w-4xl mx-auto px-4 pb-10">
        {/* Enroll CTA */}
        <div className="mb-6 flex flex-col items-center justify-center gap-3">
          {isEnrolled ? (
            <>
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                onClick={goToFirstLesson}
                aria-label="Go to course"
              >
                Go to Course ({progressPercent}% Complete)
              </button>
              {!user?.isPremium && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  You have unlocked the{" "}
                  <span className="font-semibold">Core / Basic track</span>.{" "}
                  Premium unlocks{" "}
                  <span className="font-semibold">advanced labs, mentor review & projects.</span>
                </p>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleEnroll}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow disabled:opacity-60"
                disabled={loadingEnroll}
                aria-disabled={loadingEnroll}
              >
                {loadingEnroll ? "Enrolling…" : "Enroll Now — Start with Free Core Lessons"}
              </button>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                No payment needed for the basics. Premium is optional for deep-dive labs & certification.
              </p>
            </>
          )}
        </div>

        {/* Highlights */}
        <section className="mb-10 grid sm:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">📌 Course Highlights</h3>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Duration:</strong> {course.duration}
              </li>
              <li>
                <strong>Level:</strong> {course.level}
              </li>
              <li>
                <strong>Mode:</strong> {course.mode}
              </li>
              <li>
                <strong>Language:</strong> {course.language}
              </li>
              <li>
                <strong>Last Updated:</strong> {course.lastUpdated}
              </li>
            </ul>
          </div>

          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">🎁 This Course Includes</h3>
            <ul className="text-sm space-y-1">
              {(course.includes || []).map((x, i) => (
                <li key={i}>• {x}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">🧠 Skills You Will Learn</h3>
          <div className="flex flex-wrap gap-3">
            {(course.skills || []).map((skill, idx) => (
              <span key={idx} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">🛠️ Projects Included</h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            {(course.projects || []).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        {/* Tools */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">🔧 Tools & Technologies Covered</h3>
          <div className="flex flex-wrap gap-3">
            {(course.tools || []).map((t, i) => (
              <span key={i} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Why */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">⭐ Why This Course?</h3>
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">{course.why}</p>
        </section>

        {/* Career Section (enrolled only) */}
        {isEnrolled && (course.careerPaths || course.outcomes || course.salaryRange || course.marketDemand || course.nextRecommended) && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">🎯 Your Future After This Course</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border border-indigo-100 dark:border-indigo-700 shadow-sm">
                <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Career Outcomes & Roles</h4>

                {course.idealFor && course.idealFor.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Best suited for</p>
                    <div className="flex flex-wrap gap-2">
                      {course.idealFor.map((p, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-gray-800 border text-xs">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {course.careerPaths && course.careerPaths.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Typical job roles</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {course.careerPaths.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.outcomes && course.outcomes.length > 0 && (
                  <div className="mt-3 border-t border-indigo-100 dark:border-indigo-800 pt-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">By the end of this course, you will…</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {course.outcomes.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 border border-emerald-100 dark:border-emerald-700 shadow-sm">
                <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Salary & Market Demand Snapshot</h4>

                {course.salaryRange && (
                  <div className="mb-3 text-sm text-gray-800 dark:text-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Typical salary range*</span>
                    </div>
                    <div className="mt-1 grid grid-cols-1 gap-1 text-sm">
                      {course.salaryRange.india && (
                        <div>
                          <span className="font-semibold">India: </span>
                          {course.salaryRange.india}
                        </div>
                      )}
                      {course.salaryRange.global && (
                        <div>
                          <span className="font-semibold">Global: </span>
                          {course.salaryRange.global}
                        </div>
                      )}
                    </div>
                    {course.salaryRange.note && <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">*{course.salaryRange.note}</p>}
                  </div>
                )}

                {course.marketDemand && (
                  <div className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Demand trend</p>
                    <p>{course.marketDemand}</p>
                  </div>
                )}

                {course.demandTags && course.demandTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.demandTags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded-full bg-white/70 dark:bg-gray-900 border border-emerald-100 dark:border-emerald-700 text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-600 dark:text-gray-300 border-t border-emerald-100 dark:border-emerald-800 pt-3">
                  <p>
                    Cybercode EduLabs focuses on <span className="font-semibold">job-focused labs, portfolio projects, and interview readiness</span> so that
                    your learning directly supports your career move.
                  </p>
                </div>
              </div>
            </div>

            {/* Roadmap after this course */}
            {course.nextRecommended && course.nextRecommended.length > 0 && (
              <div className="mt-6 p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">🧭 Recommended Roadmap After This Course</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Once you are comfortable with this course, you can continue your journey with:</p>
                <ul className="space-y-1 text-sm">
                  {course.nextRecommended.map((slug) => {
                    const c = courseData.find((c) => c.slug === slug);
                    if (!c) return null;
                    return (
                      <li key={c.slug}>
                        <Link to={`/courses/${c.slug}`} className="text-indigo-600 dark:text-indigo-300 hover:underline">
                          → {c.title}
                        </Link>{" "}
                        <span className="text-xs text-gray-500 dark:text-gray-400">({c.category})</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Premium nudge */}
            {!user?.isPremium && (
              <div className="mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-700 text-sm text-indigo-900 dark:text-indigo-100">
                <p className="mb-1 font-semibold">Want this path with maximum confidence?</p>
                <p className="mb-3">Premium learners get <span className="font-semibold">mentor guidance, resume / LinkedIn review, and advanced real-world labs</span> mapped to these roles.</p>
                <button onClick={() => navigate(`/enroll/${courseSlug}`)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs">View Premium Track Options</button>
              </div>
            )}
          </section>
        )}

        {/* FAQ */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">❓ FAQ</h3>
          <div className="space-y-4">
            {(course.faqs || []).map((f, i) => (
              <details key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                <summary className="font-semibold cursor-pointer">{f.q}</summary>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* Lessons Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">Lessons ({lessons.length})</h2>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
          {lessons.map((lesson, index) => {
            const completed = Array.isArray(progressData.completedLessons) && progressData.completedLessons.includes(lesson.slug);
            const isNext = index === (progressData.currentLessonIndex || 0);

            const handleLessonClick = () => {
              if (!isEnrolled) {
                showToast("Please enroll to access lessons.");
                return;
              }
              if (!completed && !isNext) {
                showToast("Complete previous lessons to unlock this lesson.");
                return;
              }
              if (!lesson?.slug) {
                showToast("Lesson content missing.");
                return;
              }
              navigate(`/courses/${courseSlug}/lessons/${lesson.slug}`);
            };

            return (
              <li
                key={lesson.slug}
                onClick={handleLessonClick}
                className={`block px-6 py-4 cursor-pointer transition-colors duration-200 ${completed ? "bg-green-50 dark:bg-green-900" : isNext ? "bg-yellow-50 dark:bg-yellow-900" : "bg-gray-100 dark:bg-gray-800 opacity-50"}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleLessonClick();
                }}
              >
                <span className="text-lg font-medium">
                  {index + 1}. {lesson.title} {completed ? "✅" : isNext ? "🟡" : "🔒"}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Certificate Preview */}
        <div className="mt-8">
          <CertificatePreview
            certificate={{
              image: "/images/certificate-default.png",
              previewUrl: `/certificate/${courseSlug}`,

              studentName: user?.name || "",
              studentPhoto: user?.photo || "",
              courseName: course?.title || "",
              courseSlug,

              certificateId: (progressData && progressData.certificateId) || `CERT-${(courseSlug || "").toUpperCase()}-${(user?.uid || "000000").slice(-6)}`,

              completionDate:
                Array.isArray(progressData.completedLessons) && progressData.completedLessons.length === lessons.length ? new Date().toISOString().split("T")[0] : "",

              isPremium: user?.isPremium ?? false,
            }}
            isEnrolled={isEnrolled}
            isCompleted={Array.isArray(progressData.completedLessons) && progressData.completedLessons.length === lessons.length && lessons.length > 0}
            progressPercent={progressPercent}
          />
        </div>

        {/* Premium CTA */}
        {user && (
          <div className="text-center mt-10 p-6 bg-gradient-to-r from-indigo-100 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-2xl shadow-md max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">🚀 Want hands-on labs, mentorship & certification?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Upgrade to Premium & access advanced deep-dive training for this course.</p>
            <button onClick={() => navigate(`/enroll/${courseSlug}`)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition">Enroll for Deep Dive & Certification</button>
          </div>
        )}

        {/* Recommended Courses */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">🎯 Recommended For You</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow border border-indigo-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Based on your interest in {course.category}</h3>
              <ul className="space-y-2 text-sm">
                {courseData
                  .filter((c) => c.category === course.category && c.slug !== courseSlug)
                  .slice(0, 3)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link to={`/courses/${c.slug}`} className="text-indigo-600 dark:text-indigo-300 hover:underline">
                        → {c.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 shadow border border-purple-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">📈 Trending Courses</h3>
              <ul className="space-y-2 text-sm">
                {courseData.slice(0, 3).map((c) => (
                  <li key={c.slug}>
                    <Link to={`/courses/${c.slug}`} className="text-purple-600 dark:text-purple-300 hover:underline">
                      → {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
