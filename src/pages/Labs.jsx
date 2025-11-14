// src/pages/Labs.jsx
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import React, { useEffect } from "react";

export default function Labs() {
  const { user, enrolledCourses } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user is NOT logged in
    if (!user) {
      navigate("/register");
    }
    // Do NOT redirect if user has zero enrollments.
    // Instead, show the "no access" block in the UI.
  }, [user, navigate]);

  const hasAccess = enrolledCourses && enrolledCourses.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center text-center px-6">

      <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4">
        🧪 Cybercode EduLabs — Practice Labs
      </h1>

      {user ? (
        <>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Welcome back, <strong>{user.name || "Learner"}</strong>!<br />
            Explore interactive hands-on labs and apply what you've learned.
          </p>

          {hasAccess ? (
            // -------------------------
            // LABS AVAILABLE SECTION
            // -------------------------
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-xl w-full">
              <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                Available Labs
              </h2>

              <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                <li>✅ Golang Development Lab</li>
                <li>✅ AWS Cloud Foundations Lab</li>
                <li>✅ DevOps with Docker & Kubernetes Lab</li>
                <li>✅ Cybersecurity Fundamentals Lab</li>
              </ul>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                New labs are added frequently — stay tuned!
              </p>
            </div>
          ) : (
            // -------------------------
            // NO ACCESS / NOT ENROLLED
            // -------------------------
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-800 rounded-2xl shadow-inner max-w-xl">
              <p className="text-yellow-700 dark:text-yellow-300 font-medium mb-3">
                ⚠️ You haven’t enrolled in any course yet.
              </p>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Enroll in a course to unlock your interactive lab environment.
              </p>

              <button
                onClick={() => navigate("/courses")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
              >
                Explore Courses 🚀
              </button>
            </div>
          )}
        </>
      ) : (
        // -------------------------
        // NOT LOGGED IN
        // -------------------------
        <>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            You need to <strong>log in</strong> to access labs.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
          >
            🔐 Login to Continue
          </button>
        </>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-10 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
      >
        ← Back
      </button>
    </div>
  );
}
