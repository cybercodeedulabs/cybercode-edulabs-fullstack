import React, { useMemo } from "react";

/**
 * Simple roadmap generator:
 * - Based on skills, hoursPerWeek and deadlineMonths
 * - Produces phases: Fundamentals -> Core -> Projects -> Interviews
 */
export default function GoalRoadmap({ goals }) {
  const roadmap = useMemo(() => {
    if (!goals) return null;
    const { skills = {}, hoursPerWeek = 6, deadlineMonths = 6, targetRole } = goals;

    const skillValues = Array.isArray(Object.values(skills)) ? Object.values(skills) : [];
    const sum = skillValues.reduce((a, b) => a + (Number(b) || 0), 0);
    const avgSkill = Math.round(sum / Math.max(skillValues.length, 1));
    const months = Number(deadlineMonths || 6);
    const weekly = Number(hoursPerWeek || 6);

    // simple pacing
    const intensity = weekly >= 10 ? "High" : weekly >= 6 ? "Medium" : "Low";
    const projectFocusMonth = Math.max(1, Math.round(months * 0.6));

    return {
      summary: `Target: ${targetRole || "Your chosen role"}. Timeline: ${months} months. Intensity: ${intensity}. Current readiness: ${avgSkill}%`,
      phases: [
        { monthRange: `1 - ${Math.max(1, Math.round(months * 0.25))}`, title: "Fundamentals", desc: "Linux, Git, basic networking, programming basics." },
        { monthRange: `${Math.max(1, Math.round(months * 0.25)) + 1} - ${Math.max(1, Math.round(months * 0.5))}`, title: "Core Platform Skills", desc: "Cloud basics, IAM, compute, storage, networking." },
        { monthRange: `${Math.max(1, Math.round(months * 0.5)) + 1} - ${projectFocusMonth}`, title: "Hands-on Projects", desc: "Build 2-3 projects: infra + app + deployment." },
        { monthRange: `${projectFocusMonth + 1} - ${months}`, title: "Interview & Portfolio", desc: "Resume, mock interviews, portfolio polishing." },
      ],
    };
  }, [goals]);

  if (!roadmap) return null;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border shadow">
      <h3 className="text-lg font-semibold text-indigo-600">Personalized Roadmap</h3>
      <p className="text-sm text-gray-600 mt-2">{roadmap.summary}</p>

      <div className="mt-3 space-y-3">
        {roadmap.phases.map((p, i) => (
          <div key={i} className="p-3 rounded border bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between">
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-gray-500">{p.monthRange}</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
