// src/components/GoalSummaryCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function GoalSummaryCard({ goals }) {
  if (!goals) {
    return (
      <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-2xl">
        <p className="text-indigo-700 dark:text-indigo-200">🎯 No goals set yet.</p>
        <Link to="/set-goals" className="mt-2 inline-block px-3 py-1 bg-indigo-600 text-white rounded">Set My Goals</Link>
      </div>
    );
  }

  const { targetRole, hoursPerWeek, deadlineMonths, motivation } = goals;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border shadow">
      <h3 className="text-lg font-semibold text-indigo-600">Your Career Goal</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{motivation}</p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="text-xs text-gray-500">Target Role</div>
        <div className="col-span-2 font-medium">{targetRole || "—"}</div>

        <div className="text-xs text-gray-500">Weekly Hours</div>
        <div className="col-span-2 font-medium">{hoursPerWeek} hrs</div>

        <div className="text-xs text-gray-500">Timeline</div>
        <div className="col-span-2 font-medium">{deadlineMonths} months</div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link to="/set-goals" className="px-3 py-1 bg-indigo-600 text-white rounded">Edit Goals</Link>
        {/* Updated to nested dashboard route */}
        <Link to="/dashboard/roadmap" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">View Roadmap</Link>
      </div>
    </div>
  );
}
