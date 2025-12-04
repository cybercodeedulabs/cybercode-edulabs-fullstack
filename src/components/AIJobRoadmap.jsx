// src/components/AIJobRoadmap.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useUser } from "../contexts/UserContext";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const LOCAL_KEY_PREFIX = "cybercode_ai_roadmap_v4_safe_";

export default function AIJobRoadmap({ goals }) {
  const { personaScores, userStats, user } = useUser();

  // 🚨 FIX: Ensure roadmap never crashes when goals is null
  const safeGoals = goals || {
    targetRole: "Not Set",
    hoursPerWeek: 0,
    deadlineMonths: 0,
  };

  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState(null);
  const [error, setError] = useState(null);

  const cacheKey = user ? `${LOCAL_KEY_PREFIX}${user.uid}` : LOCAL_KEY_PREFIX + "anon";
  const loadedOnce = useRef(false);

  const cleanMarkdown = (text) => {
    try {
      return DOMPurify.sanitize(marked.parse(text || ""), { USE_PROFILES: { html: true } });
    } catch {
      return text || "";
    }
  };

  /* -------------------------
     INITIAL LOAD + CACHE READ
     ------------------------- */
  useEffect(() => {
    // 🚨 FIX: Prevent crash & avoid fetching without goals
    if (!goals || loadedOnce.current) return;

    loadedOnce.current = true;

    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.ts && Date.now() - parsed.ts < 24 * 60 * 60 * 1000) {
          setAiText(parsed.text);
          return;
        }
      }
    } catch {}

    fetchRoadmap();
  }, [goals]);

  /* -------------------------
     FETCH AI ROADMAP
     ------------------------- */
  const fetchRoadmap = async () => {
    // 🚨 FIX: Don't fire AI if goals missing
    if (!goals) {
      setError("Please set your career goal to generate a roadmap.");
      return;
    }

    setLoading(true);
    setError(null);

    const prompt = `
Generate a structured markdown roadmap with these sections:

## Outcome Summary

## Month-by-Month Roadmap
Month 1
- Weekly bullets
Month 2
- Weekly bullets
Month 3
- Weekly bullets

## Recommended Projects
- 3 projects

## Next 5 Action Items
- bullets

Do NOT wrap inside code blocks.
    `;

    try {
      const res = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          messages: [],
          courseContext: "",
          userGoals: goals,
          personaScores,
          userStats,
          mode: "roadmap",
          user: user ? { uid: user.uid } : null,
        }),
      });

      const data = await res.json();

      // rate-limit fallback
      if (res.status === 429 || data?.error?.toLowerCase?.().includes("rate")) {
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          setAiText(parsed.text);
          setLoading(false);
          return;
        }
        setError("AI is rate-limited now. Please try again shortly.");
        setLoading(false);
        return;
      }

      const text = data?.choices?.[0]?.message?.content || data?.error || "";
      setAiText(text);

      try {
        localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), text }));
      } catch {}
    } catch (err) {
      console.error("Roadmap fetch error", err);
      setError("Could not generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     LOADING SKELETON UI
     ------------------------- */
  if (!aiText && loading) {
    return (
      <div className="animate-pulse space-y-4 py-4">
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  /* -------------------------
     PARSE AI MARKDOWN OUTPUT
     ------------------------- */
  const parsed = useMemo(() => {
    if (!aiText) return { summary: "", months: [], projects: [], actions: [] };

    const lines = aiText.split("\n");
    let section = "";
    let summary = "";
    const months = [];
    const projects = [];
    const actions = [];
    let currentMonth = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (/^#+\s*Outcome/i.test(line)) {
        section = "summary";
        continue;
      }
      if (/^#+\s*Month/i.test(line)) {
        section = "months";
        continue;
      }
      if (/^#+\s*Recommended/i.test(line)) {
        section = "projects";
        continue;
      }
      if (/^#+\s*Next/i.test(line)) {
        section = "actions";
        continue;
      }

      if (section === "summary") summary += line + " ";
      if (section === "months") {
        if (/^Month\s+\d+/i.test(line)) {
          if (currentMonth) months.push(currentMonth);
          currentMonth = { title: line, bullets: [] };
        } else if (line.startsWith("-") || line.startsWith("*")) {
          currentMonth?.bullets.push(line.replace(/^[\-\*]\s*/, ""));
        }
      }
      if (section === "projects" && (line.startsWith("-") || line.startsWith("*"))) {
        projects.push(line.replace(/^[\-\*]\s*/, ""));
      }
      if (section === "actions" && (line.startsWith("-") || line.startsWith("*"))) {
        actions.push(line.replace(/^[\-\*]\s*/, ""));
      }
    }
    if (currentMonth) months.push(currentMonth);

    return { summary, months, projects, actions };
  }, [aiText]);

  /* -------------------------
     NO GOALS FOUND → FRIENDLY MESSAGE
     ------------------------- */
  if (!goals) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-300/30 dark:border-yellow-700/40 text-gray-700 dark:text-gray-200">
        <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
          Career Goal Required
        </h2>
        <p className="mt-2 text-sm">
          Please set your career goal first from Dashboard → Edit Goals.  
          Then your personalized AI roadmap will load here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Outcome Summary */}
      {parsed.summary && (
        <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl shadow border border-indigo-200/30 dark:border-indigo-700/30">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <Icon icon="mdi:star-outline" width={22} /> Outcome Summary
          </h2>
          <div
            className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanMarkdown(parsed.summary) }}
          />
        </div>
      )}

      {/* Month-by-Month Cards */}
      {Array.isArray(parsed.months) && parsed.months.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <Icon icon="mdi:calendar-month" width={22} /> Month-by-Month Roadmap
          </h2>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-indigo-200 dark:bg-indigo-700 rounded-full" />
            {parsed.months.map((m, idx) => (
              <MonthCard key={idx} month={m} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Projects */}
      {Array.isArray(parsed.projects) && parsed.projects.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <Icon icon="mdi:check-decagram-outline" width={22} /> Recommended Projects
          </h2>

          <div className="grid gap-4 mt-3">
            {parsed.projects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border shadow"
              >
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {Array.isArray(parsed.actions) && parsed.actions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <Icon icon="mdi:rocket-launch-outline" width={22} /> Next 5 Action Items
          </h2>

          <div className="flex flex-wrap gap-2 mt-3">
            {parsed.actions.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 rounded-full border border-indigo-300/40 dark:border-indigo-600/40"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button onClick={fetchRoadmap} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow">
          Regenerate Roadmap
        </button>

        <button
          onClick={() => {
            localStorage.removeItem(cacheKey);
            loadedOnce.current = false;
            fetchRoadmap();
          }}
          className="px-4 py-2 bg-white dark:bg-gray-900 border rounded-lg shadow"
        >
          Clear Cache & Regenerate
        </button>
      </div>
    </div>
  );
}

/* MONTH CARD */
function MonthCard({ month }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="relative ml-10 mb-6">
      <div className="absolute -left-10 top-2 w-5 h-5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-md border-2 border-white dark:border-gray-900"></div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border shadow p-4">
        <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center text-left">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300 text-lg">{month.title}</span>
          {open ? (
            <Icon icon="mdi:chevron-down" width={20} />
          ) : (
            <Icon icon="mdi:chevron-right" width={20} />
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 space-y-2 text-gray-700 dark:text-gray-300"
            >
              {(month.bullets || []).map((b, i) => (
                <li key={i} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md border text-sm">
                  {b}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
