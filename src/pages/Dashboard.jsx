// src/pages/Dashboard.jsx
import React, { Suspense, lazy, useMemo, useState, useEffect } from "react";
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

// lazy chat assistant (floating)
const AIAssistantLazy = lazy(() => import("../components/AIAssistant"));

/* ---------------------------
   Small helper UI components
   - ProgressRibbon : small horizontal metrics bar
   - QuickActions    : set of action buttons under hero
   - CollapsibleCard : wrapper with collapse
   - AIMentorPanel  : compact AI suggestions (uses userGoals & persona)
----------------------------*/

function ProgressRibbon({ stats = {} }) {
  // stats: { streakDays, weeklyPct, readinessPct }
  const streak = stats.streakDays || 0;
  const weekly = Math.round(stats.weeklyPct || 0);
  const ready = Math.round(stats.readinessPct || 0);

  return (
    <div className="mt-4 bg-white/60 dark:bg-gray-900/30 rounded-full py-2 px-3 shadow-sm border border-white/10">
      <div className="max-w-6xl mx-auto flex items-center gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="font-semibold text-indigo-700">🔥 Streak</div>
          <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900 rounded-full text-indigo-700">{streak} days</div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-300">This week</span>
            <span className="text-gray-600 dark:text-gray-300">{weekly}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div style={{ width: `${weekly}%` }} className="h-full bg-indigo-600 transition-all" />
          </div>
        </div>

        <div className="w-40">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-300">Readiness</span>
            <span className="text-gray-600 dark:text-gray-300">{ready}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div style={{ width: `${ready}%` }} className="h-full bg-emerald-500 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActions({ onAction = () => {} }) {
  return (
    <div className="mt-4 flex gap-3 flex-wrap">
      <button
        onClick={() => onAction("resume")}
        className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm hover:opacity-95 transition"
      >
        ▶ Resume Last Lesson
      </button>

      <button
        onClick={() => onAction("practice")}
        className="px-4 py-2 rounded-lg bg-white border border-indigo-200 dark:bg-gray-800 text-indigo-600 hover:opacity-95 transition"
      >
        📝 Start Practice Exam
      </button>

      <button
        onClick={() => onAction("project")}
        className="px-4 py-2 rounded-lg bg-white border border-indigo-200 dark:bg-gray-800 text-indigo-600 hover:opacity-95 transition"
      >
        ⚙ Start Project
      </button>

      <Link to="/cloud" className="px-4 py-2 rounded-lg bg-emerald-600 text-white shadow-sm hover:opacity-95 transition">
        ☁️ Open Cloud Console
      </Link>
    </div>
  );
}

function CollapsibleCard({ title, children, defaultOpen = true, hint }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border p-4 shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</div>
          {hint && <div className="text-xs text-gray-500 dark:text-gray-400">{hint}</div>}
        </div>

        <button
          onClick={() => setOpen((s) => !s)}
          className="px-3 py-1 text-sm rounded border bg-white/0 dark:bg-transparent"
        >
          {open ? "Collapse" : "Open"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
        transition={{ duration: 0.28 }}
        style={{ overflow: "hidden" }}
      >
        <div className="pt-2">{children}</div>
      </motion.div>
    </div>
  );
}

function AIMentorPanel({ userGoals, persona, onSuggest }) {
  // lightweight panel that shows 2-3 AI-generated next steps (placeholders; in future can call ask-ai)
  const suggestions = useMemo(() => {
    // derive a few suggestions from goals/persona
    const s = [];
    if (userGoals?.targetRole) {
      s.push(`Complete a focused module on ${userGoals.targetRole} fundamentals (2 weeks)`);
    } else {
      s.push("Set your career goal to get a personalized roadmap.");
    }

    s.push("Finish one hands-on project (infra + app) this month.");
    s.push("Take a timed practice exam to benchmark progress.");

    return s;
  }, [userGoals]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border shadow">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-indigo-600">Cybercode AI Mentor</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Quick suggestions to move forward—AI-backed.</p>

          <ul className="mt-3 space-y-2 text-sm">
            {suggestions.map((t, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div className="flex-1 text-gray-700 dark:text-gray-200">{t}</div>
                <div className="ml-3">
                  <button
                    onClick={() => onSuggest && onSuggest(t)}
                    className="text-xs px-2 py-1 bg-indigo-600 text-white rounded"
                  >
                    Do
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex gap-2">
            <Link to="/dashboard/roadmap" className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded">Open Roadmap</Link>
            <button onClick={() => onSuggest && onSuggest("ask_ai")} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded">Ask Mentor</button>
          </div>
        </div>

        <div className="w-28 flex-shrink-0">
          <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow">
            <div className="text-center text-xs">AI</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Main Dashboard page
----------------------------*/

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

  // derive simple stats for ribbon
  const ribbonStats = useMemo(() => {
    return {
      streakDays: userStats?.streakDays || 3,
      weeklyPct: userStats?.weeklyPct || 42,
      readinessPct: userStats?.readinessPct || 68,
    };
  }, [userStats]);

  const handleQuickAction = (act) => {
    // small client-side handlers (expand later)
    if (act === "resume") {
      // navigate to last active course if available
      const last = enrolledCourses[0];
      if (last) window.location.href = `/courses/${last}`;
      else window.location.href = "/courses";
    } else if (act === "practice") {
      window.location.href = "/courses";
    } else if (act === "project") {
      window.location.href = "/projects";
    }
  };

  const handleMentorAction = (cmd) => {
    if (cmd === "ask_ai") {
      // show floating assistant quickly (it is loaded globally on app)
      const e = new CustomEvent("open-ai-assistant", { detail: { focus: true } });
      window.dispatchEvent(e);
    } else {
      // fallback: treat as navigation
      console.log("mentor action:", cmd);
    }
  };

  // Listen for dashboard-scroll-to events (sidebar triggers)
  useEffect(() => {
    const handler = (e) => {
      const target = e?.detail?.target;
      if (!target) return;
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("dashboard-scroll-to", handler);
    return () => window.removeEventListener("dashboard-scroll-to", handler);
  }, []);

  return (
    <motion.section className="space-y-6 max-w-7xl mx-auto px-4 md:px-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* HERO */}
      <div className="rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-3xl shadow-lg border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold truncate">Welcome back, {humanName}.</h1>
              <p className="mt-2 text-indigo-100 max-w-2xl text-sm">
                Your personalized learning engine is ready. Continue where you left off or ask your AI Career Mentor for a custom plan.
              </p>

              {/* quick actions */}
              <div className="mt-4 md:mt-6">
                <QuickActions onAction={handleQuickAction} />
              </div>
            </div>

            <div className="w-full md:w-auto">
              <div className="min-w-[220px] bg-white/10 p-3 rounded-lg text-sm text-right">
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
        </div>

        {/* progress ribbon */}
        <ProgressRibbon stats={ribbonStats} />
      </div>

      {/* Goal reminder / summary */}
      <div>
        {!userGoals ? <GoalReminderBanner /> : <GoalSummaryCard goals={userGoals} />}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Roadmap, Courses, Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div id="roadmap">
            <CollapsibleCard title="Personalized Roadmap" hint="A concise month-by-month plan">
              <div>
                {userGoals ? <GoalRoadmap goals={userGoals} /> : <GoalReminderBanner compact />}
              </div>
              <div className="mt-3 flex justify-end">
                <Link to="/dashboard/roadmap" className="text-indigo-600 hover:underline text-sm">Open full roadmap →</Link>
              </div>
            </CollapsibleCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div id="courses">
              <CollapsibleCard title="📚 My Courses" hint="Progress on your enrolled courses" defaultOpen>
                {enrolledCourses && enrolledCourses.length ? (
                  <ul className="space-y-3">
                    {enrolledCourses.map((slug) => {
                      const lessons = lessonsData[slug] || [];
                      const prog = sourceCourseProgress[slug] || { completedLessons: [] };
                      const percent = lessons.length ? Math.round(((prog.completedLessons?.length || 0) / lessons.length) * 100) : 0;
                      return (
                        <li key={slug} className="flex items-center justify-between">
                          <Link to={`/courses/${slug}`} className="text-indigo-600 hover:underline">{slug}</Link>
                          <div className="w-40 flex items-center gap-2">
                            <div className="text-sm text-gray-600">{percent}%</div>
                            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                              <div style={{ width: `${percent}%` }} className="h-full bg-indigo-600 transition-all" />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-600">You haven’t enrolled in any courses yet.</p>
                )}
              </CollapsibleCard>
            </div>

            <div id="projects">
              <CollapsibleCard title="📁 My Projects" hint="Track your project work" defaultOpen={false}>
                {projects && projects.length ? (
                  <ul className="space-y-3">
                    {projects.map((p) => (
                      <li key={p} className="flex items-center justify-between">
                        <div>{p}</div>
                        <Link to={`/projects/${p}`} className="text-indigo-600 hover:underline text-sm">Open →</Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Your project progress will appear here once you start learning.</p>
                )}
              </CollapsibleCard>
            </div>
          </div>
        </div>

        {/* RIGHT: persona, AI mentor, access */}
        <div className="space-y-6">
          <motion.div className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-indigo-600">🧠 Learning Persona</h3>
                <div className="text-sm text-gray-600 mt-1">A snapshot of your learning strengths</div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {!topPersona ? (
                <p className="text-gray-600">Start exploring courses — your persona will be detected automatically.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-indigo-700">{PERSONAS_LIST[topPersona.persona] || topPersona.persona}</div>
                      <div className="text-xs text-gray-500">Top persona</div>
                    </div>
                    <div className="text-sm text-indigo-700 font-semibold">{(topPersona.score || 0)} pts</div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {Object.entries(normalized).map(([p, pct]) => (
                      <div key={p} className="text-sm">
                        <div className="flex justify-between mb-1 text-xs">
                          <span className="capitalize">{PERSONAS_LIST[p] || p}</span>
                          <span className="font-semibold text-indigo-600">{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-indigo-600 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Link to="/courses" className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Explore Recommended Courses →</Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <AIMentorPanel userGoals={userGoals} persona={topPersona} onSuggest={handleMentorAction} />

          <div className="grid grid-cols-1 gap-4">
            <motion.div className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h4 className="font-semibold text-indigo-600">🎓 Certification Access</h4>
              <div className="mt-2">
                {hasCertificationAccess ? (
                  <div className="text-green-600">Access granted.</div>
                ) : (
                  <Link to="/payment?type=certification" className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Unlock Certification</Link>
                )}
              </div>
            </motion.div>

            <motion.div className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h4 className="font-semibold text-indigo-600">🖥️ 1-Year Server Access</h4>
              <div className="mt-2">
                {hasServerAccess ? (
                  <div className="text-green-600">Server Access Active.</div>
                ) : (
                  <Link to="/payment?type=server" className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Activate Server Access</Link>
                )}
              </div>
            </motion.div>

            <motion.div className="bg-white dark:bg-gray-900 border p-4 rounded-2xl shadow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h4 className="font-semibold text-indigo-600">☁️ Cybercode Cloud Console</h4>
              <p className="text-sm text-gray-600 mt-1">Launch AI, Cloud, or IoT projects instantly.</p>
              <div className="mt-3">
                <Link to="/cloud" className="px-3 py-1 bg-emerald-600 text-white rounded text-sm">Open Cloud Console</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* floating assistant is loaded app-wide; we keep a lazy import usage for the dashboard */}
      <div style={{ display: "none" }}>
        {/* keep suspense import to prefetch code-split chunk without rendering */}
        <Suspense fallback={null}>
          <AIAssistantLazy embedMode="floating" />
        </Suspense>
      </div>
    </motion.section>
  );
}
