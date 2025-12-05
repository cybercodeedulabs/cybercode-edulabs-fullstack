// src/components/AIJobRoadmap.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Temporary stub for AIJobRoadmap (Option 3)
 * - Replaces the full AI roadmap generation while we stabilize hydration/data.
 * - Keeps the same default export so route imports remain unchanged.
 */

export default function AIJobRoadmap(/* goals prop intentionally ignored */) {
  return (
    <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-300/30 dark:border-yellow-700/40 text-gray-700 dark:text-gray-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg className="w-10 h-10 text-yellow-600" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.12"></circle>
            <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            Roadmap temporarily under maintenance
          </h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 max-w-xl">
            We’ve temporarily paused the AI Roadmap generator while we stabilize some data migration
            and hydration issues. Don’t worry — your saved goals are safe and you can continue with
            other parts of the platform.
          </p>

          <div className="mt-4 flex gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700"
            >
              Back to Dashboard
            </Link>

            <Link
              to="/set-goals"
              className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg shadow"
            >
              Edit Goals
            </Link>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            ETA for re-enable: after a quick data-normalization update. If you need the roadmap urgently,
            export your goals and I’ll generate a one-off roadmap manually.
          </p>
        </div>
      </div>
    </div>
  );
}
