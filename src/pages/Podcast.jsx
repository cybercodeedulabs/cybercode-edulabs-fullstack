// src/pages/Podcast.jsx
import React from "react";

export default function Podcast() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Prime Techies Podcast
      </h1>

      <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-3xl">
        Deep conversations with global cybersecurity leaders, cloud experts,
        DevOps engineers, and innovators shaping the future of technology.
        Episodes will be published here soon.
      </p>

      {/* Episodes Listing (future) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example placeholder cards */}
        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <h3 className="text-lg font-semibold">Episode 1 — Coming Soon</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Our first global guest will be featured here.
          </p>
        </div>
      </div>
    </div>
  );
}
