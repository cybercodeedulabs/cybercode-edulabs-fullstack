// src/components/GoalReminderBanner.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function GoalReminderBanner() {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-2xl mb-6 flex items-center justify-between">
      <div>
        <h4 className="text-indigo-700 dark:text-indigo-200 font-semibold">🎯 Personalize your learning</h4>
        <p className="text-sm text-indigo-900 dark:text-indigo-300">Set your career goals and get a personalized roadmap and AI mentor guidance.</p>
      </div>
      <div>
        <Link to="/set-goals" className="px-4 py-2 bg-indigo-600 text-white rounded">Set My Goals</Link>
      </div>
    </div>
  );
}
