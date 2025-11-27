// src/pages/Dashboard.jsx
import { useUser } from "../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import {
  PERSONAS_LIST,
  normalizePersonaScores,
  topPersonaFromScores,
} from "../utils/personaEngine";
import lessonsData from "../data/lessonsData";

import GoalReminderBanner from "../components/GoalReminderBanner";
import GoalSummaryCard from "../components/GoalSummaryCard";
import GoalRoadmap from "../components/GoalRoadmap";
import AIAssistant from "../components/AIAssistant";

export default function Dashboard() {
  // TAKE EVERYTHING FROM CONTEXT (do NOT call useUserData() here)
  const {
    user,
    setUser,
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

  const navigate = useNavigate();

  // topPersona: prefer getTopPersona from context, otherwise derived
  const topPersona =
    typeof getTopPersona === "function"
      ? getTopPersona()
      : topPersonaFromScores(personaScores || {});

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("SignOut failed:", err);
    }
    setUser && setUser(null);
    navigate("/");
  };

  // UNAUTHORIZED VIEW
  if (!user) {
    return (
      <motion.div
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please log in to access your dashboard and learning resources.
        </p>
        <Link
          to="/register"
          className="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
        >
          Go to Login
        </Link>
      </motion.div>
    );
  }

  // Normalize persona scores for display
  const normalized = normalizePersonaScores(personaScores || {});

  const humanName =
    user?.name || (user?.email && user.email.split("@")[0]) || "Learner";

  // Build studyTimeMap from context courseProgress
  const sourceCourseProgress =
    courseProgress && Object.keys(courseProgress).length ? courseProgress : {};

  return (
    <motion.section
      className="max-w-6xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* HEADER */}
      <motion.div className="text-center mb-6" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          Welcome, {humanName}
        </h1>

        {user?.isPremium && (
          <span className="inline-block mt-2 px-3 py-1 bg-yellow-300 text-yellow-900 rounded-full text-sm font-semibold shadow">
            ⭐ Premium Member
          </span>
        )}

        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Manage your learning progress, access real-time projects, and unlock certifications.
        </p>
      </motion.div>

      {/* GOAL REMINDER OR SUMMARY */}
      <div className="mb-8">
        {!userGoals ? <GoalReminderBanner /> : <GoalSummaryCard goals={userGoals} />}
      </div>

      {/* GOAL ROADMAP + AI (two-column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
          <GoalRoadmap goals={userGoals} />

          {/* COURSES & PROJECTS */}
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

        {/* RIGHT COLUMN: Persona + AI */}
        <div className="space-y-6">
          {/* PERSONA CARD */}
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

          {/* EMBEDDED AI CAREER ADVISOR */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-indigo-600 mb-3">💡 Career Mentor</h3>
            <p className="text-sm text-gray-600 mb-3">Ask the AI about your roadmap, projects, and timelines.</p>
            <AIAssistant embedMode="career" />
          </motion.div>

          {/* ACCESS CARDS */}
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

      {/* LOGOUT */}
      <motion.div className="text-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
        <button onClick={handleLogout} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition">🔓 Logout</button>
      </motion.div>
    </motion.section>
  );
}
