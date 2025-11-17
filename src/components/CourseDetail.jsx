// src/pages/CourseDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import courseData from "../data/courseData";
import lessonsData from "../data/lessonsData";
import { useUser } from "../contexts/UserContext";
import CertificatePreview from "../components/CertificatePreview";
import { quickCoursePersonaDelta } from "../utils/personaEngine";

export default function CourseDetail() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const course = courseData.find((c) => c.slug === courseSlug);
  const lessons = lessonsData[courseSlug] || [];
  const { user, enrolledCourses, enrollInCourse, courseProgress, updatePersonaScore } = useUser();
  useEffect(() => {
  // score users when they view the course page (small boost)
  if (!user || !course) return;
  const deltas = quickCoursePersonaDelta(course);
  if (Object.keys(deltas).length) {
    updatePersonaScore(deltas); // merges the deltas
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [courseSlug, user]);


  const isEnrolled = user && enrolledCourses.includes(courseSlug);
  const progressData =
    courseProgress[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };

  const progressPercent = Math.round(
    (progressData.completedLessons.length / lessons.length) * 100
  );

  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleEnroll = () => {
    enrollInCourse(courseSlug);
    showToast(`Successfully enrolled in "${course.title}"`);
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

  return (
    <div className="text-left relative">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
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
        </div>
      </div>

      {/* ============================== */}
      {/* COURSE OVERVIEW SECTION */}
      {/* ============================== */}
      <div className="max-w-4xl mx-auto px-4 pb-10">

        {/* Highlights & Includes */}
        <section className="mb-10 grid sm:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">📌 Course Highlights</h3>
            <ul className="text-sm space-y-1">
              <li><strong>Duration:</strong> {course.duration || "Self-paced"}</li>
              <li><strong>Level:</strong> {course.level || "Beginner Friendly"}</li>
              <li><strong>Mode:</strong> {course.mode || "Self-paced + Labs"}</li>
              <li><strong>Language:</strong> {course.language || "English"}</li>
              <li><strong>Last Updated:</strong> {course.lastUpdated || "2025"}</li>
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
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
            🧠 Skills You Will Learn
          </h3>
          <div className="flex flex-wrap gap-3">
            {(course.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
            🛠️ Projects Included
          </h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            {(course.projects || []).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        {/* Tools */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
            🔧 Tools & Technologies Covered
          </h3>
          <div className="flex flex-wrap gap-3">
            {(course.tools || []).map((t, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Why This Course */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
            ⭐ Why This Course?
          </h3>
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
            {course.why ||
              "This course is built with real-world use cases, hands-on scenarios, industry workflows, job preparation, and production-level knowledge."}
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
            ❓ Frequently Asked Questions
          </h3>
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

      {/* ============================== */}
      {/* LESSONS + CERTIFICATE SECTION */}
      {/* ============================== */}
      <div className="max-w-4xl mx-auto px-4 pb-16">

        <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
          Lessons ({lessons.length})
        </h2>

        {/* Lessons */}
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
          {lessons.map((lesson, index) => {
            const completed = progressData.completedLessons.includes(lesson.slug);
            const isNext = index === progressData.currentLessonIndex;

            const handleLessonClick = () => {
              if (!isEnrolled) {
                showToast("Please enroll to access lessons.");
                return;
              }
              if (!completed && !isNext) {
                showToast("Complete previous lessons and click on 'Mark lesson as complete' to unlock this one.");
                return;
              }
              navigate(`/courses/${courseSlug}/lessons/${lesson.slug}`);
            };

            return (
              <li
                key={lesson.slug}
                onClick={handleLessonClick}
                className={`block px-6 py-4 cursor-pointer transition-colors duration-200 ${
                  completed
                    ? "bg-green-50 dark:bg-green-900"
                    : isNext
                    ? "bg-yellow-50 dark:bg-yellow-900"
                    : "bg-gray-100 dark:bg-gray-800 opacity-50"
                }`}
              >
                <span className="text-lg font-medium">
                  {index + 1}. {lesson.title}{" "}
                  {completed ? "✅" : isNext ? "🟡" : "🔒"}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Certificate Preview */}
        <CertificatePreview
  certificate={{
    image: "/images/certificate-default.png",
    previewUrl: `/certificate/${courseSlug}`,

    // ------------------------
    // 🔥 Dynamic Certificate Data
    // ------------------------
    studentName: user?.name || "",
    studentPhoto: user?.photo || "",
    courseName: course?.title || "",
    courseSlug,
    certificateId:
      progressData?.certificateId ||
      `CERT-${courseSlug.toUpperCase()}-${user?.uid?.slice(-6) || "000000"}`,
    completionDate:
      progressData?.completedLessons.length === lessons.length
        ? new Date().toISOString().split("T")[0]
        : "",

    // ------------------------
    // 🔥 Premium Requirement (IMPORTANT)
    // ------------------------
    isPremium: user?.isPremium ?? false,

    // ------------------------
    // Allow any additional static course.certificate overrides
    // ------------------------
    ...(course.certificate || {})
  }}

  // ------------------------
  // Existing props
  // ------------------------
  isEnrolled={isEnrolled}
  isCompleted={
    progressData.completedLessons.length === lessons.length &&
    lessons.length > 0
  }
  progressPercent={progressPercent}
/>

        {/* ============================== */}
{/* RECOMMENDED COURSES SECTION */}
{/* ============================== */}
<section className="mt-16">
  <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
    🎯 Recommended For You
  </h2>

  <div className="grid sm:grid-cols-2 gap-6">
    {/* 1. Based on current course category */}
    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 
                    dark:from-gray-800 dark:to-gray-900 shadow border border-indigo-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
        Based on your interest in {course.category}
      </h3>
      <ul className="space-y-2 text-sm">
        {courseData
          .filter(c => c.category === course.category && c.slug !== courseSlug)
          .slice(0, 3)
          .map((c) => (
            <li key={c.slug}>
              <Link
                to={`/courses/${c.slug}`}
                className="text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                → {c.title}
              </Link>
            </li>
        ))}
      </ul>
    </div>

    {/* 2. Trending Courses */}
    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 
                    dark:from-gray-800 dark:to-gray-900 shadow border border-purple-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">
        📈 Trending Courses
      </h3>
      <ul className="space-y-2 text-sm">
        {courseData
          .slice(0, 3)
          .map((c) => (
            <li key={c.slug}>
              <Link
                to={`/courses/${c.slug}`}
                className="text-purple-600 dark:text-purple-300 hover:underline"
              >
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
