// src/pages/RoadmapPage.jsx
import React, { Suspense } from "react";
import GoalRoadmap from "../components/GoalRoadmap";
import GoalSummaryCard from "../components/GoalSummaryCard";
import { useUser } from "../contexts/UserContext";

// lazy-load embedded AI (speeds initial load)
const AIAssistantLazy = React.lazy(() => import("../components/AIAssistant"));

export default function RoadmapPage() {
  const { userGoals } = useUser();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">Your Roadmap</h1>
        <p className="text-gray-600 mt-2">A personalized study timeline and next steps based on your goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GoalRoadmap goals={userGoals} />
        </div>

        <div className="space-y-6">
          <GoalSummaryCard goals={userGoals} />

          <div className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-indigo-600 mb-3">💡 Career Mentor</h3>
            <p className="text-sm text-gray-600 mb-3">Ask your AI Coach for a week-by-week plan or project suggestions.</p>

            <Suspense fallback={<div>Loading mentor...</div>}>
              <AIAssistantLazy embedMode="career" />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
