// src/pages/StudentProjects.jsx
import React from "react";

export default function StudentProjects() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Student Projects
      </h1>

      <p className="text-gray-600 dark:text-gray-300 max-w-3xl mb-10">
        A showcase of hands-on research, cloud architecture builds, cybersecurity
        implementations, automation workflows, and real-world solutions
        created by Cybercode EduLabs learners.
      </p>

      {/* Grid (empty state for now) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-center shadow-sm">
          <div className="h-36 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <h3 className="text-lg font-semibold">Projects Coming Soon</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Our students are currently building innovative real-world solutions.
          </p>
        </div>

      </div>
    </div>
  );
}
