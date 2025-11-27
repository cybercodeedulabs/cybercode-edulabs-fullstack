// src/pages/Dashboard.jsx
import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import {
  PERSONAS_LIST,
  normalizePersonaScores,
  topPersonaFromScores,
} from "../utils/personaEngine";
import lessonsData from "../data/lessonsData";

import GoalReminderBanner from "../components/GoalReminderBanner";
import GoalSummaryCard from "../components/GoalSummaryCard";
import GoalRoadmap from "../components/GoalRoadmap";

const AIAssistantLazy = lazy(() => import("../components/AIAssistant"));

export default function Dashboard() {
  const {
    user,
    personaScores,
    getTopPersona,
    courseProgress = {},
    enrolledCourses = [],
    projects = [],
    hasCertificationAccess = false,
    hasServerAccess = false,
    userStats = {},
    userGoals,
  } = useUser();

  const topPersona =
    typeof getTopPersona === "function"
      ? getTopPersona()
      : topPersonaFromScores(personaScores || {});

  const normalized = normalizePersonaScores(personaScores || {});

  const humanName =
    user?.name || (user?.email && user.email.split("@")[0]) || "Learner";

  const sourceCourseProgress =
    courseProgress && Object.keys(courseProgress).length ? courseProgress : {};

  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-3xl shadow-lg border border-white/10">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Welcome back, {humanName}.</h1>
            <p className="mt-2 text-indigo-100 max-w-2xl">
              Your personalized learning engine is ready. Continue where you left off or ask your AI Career Mentor for a custom plan.
            </p>
          </div>

          <div className="min-w-[200px] bg-white/10 p-3 rounded-lg text-sm">
            <div className="text-xs text-indigo-100">Current Goal</div>
            {userGoals ? (
              <div className="mt-2">
                <div className="font-semibold">{userGoals.targetRole || "—"}</div>
                <div className="text-xs text-indigo-100">{userGoals.hoursPerWeek} hrs/week • {userGoals.deadlineMonths} months</div>
              </div>
            ) : (
              <div className="text-xs text-indigo-200">No goal set</div>
            )}
          </div>
        </div>
      </div>

      {/* GOAL REMINDER OR SUMMARY */}
      <div>
        {!userGoals ? <GoalReminderBanner /> : <GoalSummaryCard goals={userGoals} />}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left area: roadmap + courses/projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Personalized Roadmap</h3>
              <div className="text-sm">
                <Link to="/dashboard/roadmap" className="text-indigo-600 hover:underline">Open Roadmap →</Link>
              </div>
            </div>

            <div className="mt-4">
              {userGoals ? <GoalRoadmap goals={userGoals} /> : <GoalReminderBanner compact />}
            </div>
          </div>

          {/* Courses & Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "📚 My Courses",
                items: enrolledCourses,
                emptyText: "You haven’t enrolled in any courses yet.",
                linkPrefix: "/courses/",
              },
              {
                title: "📁 My Projects",
                items: projects,
                emptyText:
                  "Your project progress will appear here once you start learning.",
                linkPrefix: "/projects/",
              },
            ].map((section, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-2xl shadow hover:shadow-lg transition"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
                  {section.title}
                </h2>
                {section.items && section.items.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                    {section.items.map((item) => {
                      const lessons = lessonsData[item] || [];
                      const prog = sourceCourseProgress[item] || {
                        completedLessons: [],
                      };
                      const percent =
                        lessons.length > 0
                          ? Math.round(
                              ((prog.completedLessons?.length || 0) / lessons.length) * 100
                            )
                          : 0;
                      return (
                        <li key={item} className="flex items-center justify-between">
                          <Link
                            to={`${section.linkPrefix}${item}`}
                            className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            {item}
                          </Link>
                          <div className="text-sm flex items-center gap-3">
                            <span className="text-gray-500 dark:text-gray-400">{percent}%</span>
                            <div className="w-36 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                              <div style={{ width: `${percent}%` }} className="h-full bg-indigo-600 dark:bg-indigo-400" />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{section.emptyText}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right area: persona + AI + access */}
        <div className="space-y-6">
          <motion.div className="bg-white dark:bg-gray-900 border p-6 rounded-2xl shadow-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">🧠 Your Learning Persona</h2>

            {!topPersona ? (
              <p className="text-gray-600 dark:text-gray-400 text-sm">Start exploring courses — your persona will be detected automatically.</p>
            ) : (
              <>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{PERSONAS_LIST[topPersona.persona] || topPersona.persona}</span>
                  <span className="ml-2 px-3 py-1 text-xs font-semibold bg-yellow-300 text-yellow-800 rounded-full">⭐ Top Persona</span>
                </div>

                <div className="space-y-3 mt-3 w-full max-w-2xl">
                  {Object.entries(normalized).map(([p, pct]) => (
                    <div key={p} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="capitalize text-gray-700 dark:text-gray-300">{PERSONAS_LIST[p] || p}</span>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-300">{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <Link to="/courses" className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm shadow transition">Explore Recommended Courses →</Link>
                </div>
              </>
            )}
          </motion.div>

          <div className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-indigo-600 mb-3">💡 Career Mentor</h3>
            <p className="text-sm text-gray-600 mb-3">Ask the AI about your roadmap, projects, and timelines.</p>
            <div className="mt-3">
              <Suspense fallback={<div className="text-sm text-gray-500">Loading mentor...</div>}>
                <AIAssistantLazy embedMode="career" />
              </Suspense>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <motion.div className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">🎓 Certification Access</h2>
              {hasCertificationAccess ? <p className="text-green-600 dark:text-green-400">Access granted.</p> : <Link to="/payment?type=certification" className="inline-block mt-2 px-3 py-1 bg-indigo-600 text-white rounded">Unlock Certification</Link>}
            </motion.div>

            <motion.div className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">🖥️ 1-Year Server Access</h2>
              {hasServerAccess ? <p className="text-green-600 dark:text-green-400">Server Access Active.</p> : <Link to="/payment?type=server" className="inline-block mt-2 px-3 py-1 bg-indigo-600 text-white rounded">Activate Server Access</Link>}
            </motion.div>

            <motion.div className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">☁️ Cybercode Cloud Console</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">Launch AI, Cloud, or IoT projects instantly.</p>
              <Link to="/cloud" className="inline-block px-3 py-1 bg-indigo-600 text-white rounded">Open Cloud Console</Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
