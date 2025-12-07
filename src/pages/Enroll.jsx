// src/pages/Enroll.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function Enroll() {
  const { courseSlug } = useParams();
  const {
    user,
    token,
    enrolledCourses = [],
    loadUserProfile,   // ✅ use correct backend refresh method
  } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // derived flags
  const isEnrolled = useMemo(
    () =>
      Array.isArray(enrolledCourses) &&
      enrolledCourses.includes(courseSlug),
    [enrolledCourses, courseSlug]
  );

  const isPremium = Boolean(user?.isPremium);

  const freeText =
    "Enroll for free to access the core lessons. Continue your learning journey immediately.";
  const premiumText =
    "Upgrade to Premium to unlock hands-on labs, mentor sessions, advanced projects, and an accredited certificate.";

  // ---------------------------------------------
  // FREE ENROLL → BACKEND POST CALL (fetch)
  // ---------------------------------------------
  const handleFreeEnroll = async () => {
    if (!user) {
      sessionStorage.setItem(
        "redirectAfterLogin",
        `/enroll/${courseSlug}`
      );
      navigate("/register");
      return;
    }

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/register");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseSlug }),
        }
      );

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/register");
        return;
      }

      if (!res.ok) {
        throw new Error("Backend enroll failed");
      }

      // Refresh user data from backend (re-fetch enrolledCourses)
      await loadUserProfile(user.uid);

      alert(
        `You're enrolled (Free) — basic lessons unlocked for "${courseSlug}".`
      );
      navigate(`/courses/${courseSlug}`);
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    const q = new URLSearchParams({
      upgrade: "course",
      course: courseSlug,
      from: "enroll-page",
    }).toString();
    navigate(`/payment?${q}`);
  };

  const handleGotoCourse = () => {
    navigate(`/courses/${courseSlug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-16 px-6">
      <motion.div
        className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4">
          🎓 Enroll: {courseSlug}
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Choose how you want to join this course. We offer a friendly free
          track to get started and a Premium track for deeper hands-on
          learning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FREE TRACK */}
          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
              Free Access
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 my-3">
              {freeText}
            </p>

            {user ? (
              isEnrolled ? (
                <div className="text-sm text-green-700 dark:text-green-300 mb-3">
                  ✅ You are enrolled in the free track.
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  ✅ Free enrollment available now.
                </div>
              )
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                🔐 Login to enroll for free.
              </div>
            )}

            <div className="flex gap-3">
              {isEnrolled ? (
                <button
                  onClick={handleGotoCourse}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                >
                  Go to Course
                </button>
              ) : (
                <button
                  onClick={handleFreeEnroll}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                  {loading ? "Enrolling…" : "Enroll for Free"}
                </button>
              )}

              <button
                onClick={() =>
                  document
                    .getElementById("premium-info")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* PREMIUM TRACK */}
          <div
            id="premium-info"
            className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
                  Premium (Recommended)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 my-3">
                  {premiumText}
                </p>

                <ul className="text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                  <li>• Live mentor sessions & reviews</li>
                  <li>• Hands-on cloud & lab environments</li>
                  <li>• Capstone projects & verifiable certificate</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500 mb-2">Starting from</div>
                <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300">
                  ₹499
                </div>
                <div className="text-xs text-gray-500">one-time</div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              {isPremium ? (
                <button
                  onClick={handleGotoCourse}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                >
                  You are Premium — Go to Course
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  className="flex-1 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  Upgrade to Premium
                </button>
              )}

              <button
                onClick={() => navigate(`/courses/${courseSlug}`)}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm"
              >
                View Course (Preview)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-block px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700"
          >
            ← Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
