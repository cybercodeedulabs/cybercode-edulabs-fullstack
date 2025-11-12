import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Enroll() {
  const { user, enrolledCourses } = useUser();
  const navigate = useNavigate();

  const isAlreadyEnrolled = enrolledCourses && enrolledCourses.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4">
        🎓 Enroll for Deep Dive & Certification
      </h1>

      {user ? (
        <>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mb-8">
            Welcome, <strong>{user.name || "Learner"}</strong>!  
            Join our mentor-led, hands-on learning experience and unlock premium certifications.
          </p>

          {isAlreadyEnrolled ? (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-2xl shadow-inner max-w-xl">
              <h3 className="text-green-700 dark:text-green-300 font-semibold mb-2">
                ✅ You are already enrolled!
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Continue learning and explore your labs below.
              </p>
              <button
                onClick={() => navigate("/labs")}
                className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
              >
                Go to Lab Environment 🧪
              </button>
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-xl">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Choose your course and unlock advanced projects, live mentorship, and certification exams.
              </p>
              <button
                onClick={() => alert("Payment gateway or enrollment form to be added here.")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
              >
                🔓 Enroll Now
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                *Enrollment unlocks labs, projects, and certification for all premium courses.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Please log in to enroll in premium courses.
          </p>
          <button
            onClick={() => navigate("/login")}
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
        ← Back to Course
      </button>
    </div>
  );
}
