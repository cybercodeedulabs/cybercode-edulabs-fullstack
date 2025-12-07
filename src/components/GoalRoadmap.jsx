import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Enhanced, animated roadmap generator.
 * - Beautiful vertical timeline
 * - Highlights current phase
 * - Uses framer-motion for smooth animations
 */
export default function GoalRoadmap({ goals }) {
  if (!goals) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border shadow text-center">
        <h3 className="text-lg font-semibold text-indigo-600">No Goal Set</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Set your career goal to unlock an AI-generated roadmap.
        </p>
      </div>
    );
  }

  const roadmap = useMemo(() => {
    const { skills = {}, hoursPerWeek = 6, deadlineMonths = 6, targetRole } = goals;

    // Defensive: ensure skills is an object before using Object.values
    const safeSkills = skills && typeof skills === "object" ? skills : {};
    const skillValues = Object.values(safeSkills).map(Number);
    const sum = skillValues.reduce((a, b) => a + (b || 0), 0);
    const avgSkill = Math.round(sum / Math.max(skillValues.length, 1));
    const months = Number(deadlineMonths || 6);
    const weekly = Number(hoursPerWeek || 6);

    const intensity = weekly >= 10 ? "High" : weekly >= 6 ? "Medium" : "Low";
    const projectFocusMonth = Math.max(1, Math.round(months * 0.6));

    const phases = [
      {
        id: 1,
        monthRange: `1 - ${Math.max(1, Math.round(months * 0.25))}`,
        title: "Fundamentals",
        desc: "Linux, Git, networking basics, CLI, basic scripting.",
        color: "from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900",
      },
      {
        id: 2,
        monthRange: `${Math.max(1, Math.round(months * 0.25)) + 1} - ${Math.max(
          1,
          Math.round(months * 0.5)
        )}`,
        title: "Core Platform Skills",
        desc: "Cloud IAM, compute, storage, networking, observability.",
        color: "from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900",
      },
      {
        id: 3,
        monthRange: `${Math.max(1, Math.round(months * 0.5)) + 1} - ${projectFocusMonth}`,
        title: "Hands-on Projects",
        desc: "Build 2–3 deployable real-world projects.",
        color: "from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900",
      },
      {
        id: 4,
        monthRange: `${projectFocusMonth + 1} - ${months}`,
        title: "Interview & Portfolio",
        desc: "Resume, mock interviews, portfolio polishing, job prep.",
        color: "from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900",
      },
    ];

    return {
      summary: `Target Role: ${targetRole || "Your chosen role"} • Duration: ${months} months • Intensity: ${intensity} • Readiness: ${avgSkill}%`,
      phases,
    };
  }, [goals]);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border shadow">
      <h3 className="text-xl font-semibold text-indigo-600">AI-Enhanced Roadmap</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{roadmap.summary}</p>

      <div className="mt-6 relative border-l-2 border-indigo-300 dark:border-indigo-700 ml-4 space-y-8">
        {roadmap.phases.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: index * 0.1 }}
            className="relative pl-6"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[13px] top-1 w-4 h-4 rounded-full bg-indigo-600 shadow"></div>

            {/* Card */}
            <div
              className={`p-4 rounded-xl bg-gradient-to-br ${p.color} border shadow-sm`}
            >
              <div className="flex justify-between">
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                  {p.title}
                </h4>
                <span className="text-xs text-gray-500">{p.monthRange}</span>
              </div>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {p.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
