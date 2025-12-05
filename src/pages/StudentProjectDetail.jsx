// src/pages/StudentProjectDetail.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Temporary stub for StudentProjectDetail (Option 3)
 * - Prevents rendering the detailed project view which relied on fragile project shapes.
 * - Keeps routing intact and provides a friendly message + CTA.
 */

export default function StudentProjectDetail() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border shadow p-8">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">Project Detail - Under Maintenance</h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The detailed project view is temporarily disabled while we fix a data consistency issue.
          Projects are still safe — you can view the project list in the showcase or recreate the project from the Dashboard.
        </p>

        <div className="flex justify-center gap-3">
          <Link
            to="/student-projects"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          >
            Back to Projects
          </Link>

          <Link
            to="/dashboard#projects"
            className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg"
          >
            Create / Manage Projects
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          If you need access to a specific project urgently, let me know which one (ID or title) and I will inspect the raw data.
        </p>
      </div>
    </div>
  );
}
