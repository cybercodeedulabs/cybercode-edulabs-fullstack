// src/pages/Community.jsx
import React from "react";

export default function Community() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Cybercode Community Hub
      </h1>

      <p className="text-gray-600 dark:text-gray-300 max-w-3xl mb-10">
        Welcome to the Cybercode Community — a collaborative space for learners,
        researchers, and innovators. Discover updates, join discussions, explore
        research-driven work, and stay connected with our ecosystem.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Research Lab</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Explore experiments, simulations, and research-driven learning.
          </p>
        </div>

        <div className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Prime Techies Podcast</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Listen to conversations with industry leaders and innovators.
          </p>
        </div>

        <div className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Student Projects</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Discover real-world projects built by our learners.
          </p>
        </div>

      </div>
    </div>
  );
}
