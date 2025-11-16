// src/pages/Courses.jsx
import React from "react";
import { motion } from "framer-motion";
import CourseCategoryTabs from "../components/CourseCategoryTabs";
import { getCourses } from "../api/content";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Courses() {
  const courses = getCourses();
  const { user, enrolledCourses, courseProgress } = useUser();
  const navigate = useNavigate();

  const handleContinue = (slug) => {
    const progress = courseProgress[slug];
    if (!progress) {
      navigate(`/courses/${slug}`);
      return;
    }
    const lessonSlug = progress.currentLessonIndex === 0
      ? progress.completedLessons[0]
      : progress.completedLessons[progress.completedLessons.length - 1];

    navigate(`/courses/${slug}/lessons/${lessonSlug}`);
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore Our Courses
          </motion.h1>

          <motion.p
            className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Learn from a wide range of industry-focused programs across Cloud,
            DevOps, Programming, Cybersecurity, and more.
          </motion.p>
        </div>

        {/* CATEGORY TABS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <CourseCategoryTabs />
        </motion.div>

        {/* === COURSE LIST === */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {courses.map((course, index) => {
            const isEnrolled = user && enrolledCourses.includes(course.slug);
            const progress = courseProgress[course.slug];
            const percent = progress
              ? Math.round(
                  (progress.completedLessons.length /
                    (course.totalLessons || 1)) * 100
                )
              : 0;

            return (
              <motion.div
                key={course.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Title */}
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-300">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex-1">
                  {course.shortDescription ||
                    "This is a hands-on industry grade course."}
                </p>

                {/* Progress Bar */}
                {isEnrolled && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {percent}% completed
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-6">
                  {!user ? (
                    <Link
                      to="/register"
                      className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Login to Enroll
                    </Link>
                  ) : isEnrolled ? (
                    <button
                      onClick={() => handleContinue(course.slug)}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                    >
                      Continue Learning →
                    </button>
                  ) : (
                    <Link
                      to={`/courses/${course.slug}`}
                      className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Enroll Now →
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
