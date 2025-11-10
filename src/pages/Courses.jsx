// src/pages/Courses.jsx
import React from "react";
import { motion } from "framer-motion";
import CourseCategoryTabs from "../components/CourseCategoryTabs";
import { getCourses } from "../api/content";  // ✅ Added import

export default function Courses() {
  const courses = getCourses();  // ✅ Now using abstraction layer

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
            Learn from a wide range of industry-focused programs across Cloud, DevOps, Programming, and more.
          </motion.p>
        </div>

        {/* Course Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Existing Course Tabs (unchanged) */}
          <CourseCategoryTabs />
        </motion.div>
      </div>
    </section>
  );
}
