// src/components/AIJobRoadmap.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useUser } from "../contexts/UserContext";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Calendar, Star, ListChecks } from "lucide-react";

const LOCAL_KEY_PREFIX = "cybercode_ai_roadmap_v4_safe_";

export default function AIJobRoadmap({ goals }) {
  const { personaScores, userStats, user } = useUser();

  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState(null);
  const [error, setError] = useState(null);

  const cacheKey = user ? `${LOCAL_KEY_PREFIX}${user.uid}` : LOCAL_KEY_PREFIX + "anon";

  const loadedOnce = useRef(false); // ✅ Prevent duplicate triggers

  const cleanMarkdown = (text) => {
    try {
      return DOMPurify.sanitize(marked.parse(text || ""), { USE_PROFILES: { html: true } });
    } catch {
      return text || "";
    }
  };

  useEffect(() => {
    if (!goals || loadedOnce.current) return;
    loadedOnce.current = true; // 🛑 prevents multiple executions

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

  const fetchRoadmap = async () => {
    if (!goals) return;
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

  if (!aiText && loading) {
    return (
      <div className="animate-pulse space-y-4 py-4">
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

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

  return (
    <div className="space-y-8">
      {parsed.summary && (
        <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl shadow border border-indigo-200/30 dark:border-indigo-700/30">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <Star /> Outcome Summary
          </h2>
          <div
            className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanMarkdown(parsed.summary) }}
          />
        </div>
      )}

      {/* Months */}
      {Array.isArray(parsed.months) && parsed.months.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <Calendar /> Month-by-Month Roadmap
          </h2>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-indigo-200 dark:bg-indigo-700 rounded-full" />
            {parsed.months.map((m, idx) => (
              <MonthCard key={idx} month={m} />
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {Array.isArray(parsed.projects) && parsed.projects.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <ListChecks /> Recommended Projects
          </h2>

          <div className="grid gap-4 mt-3">
            {parsed.projects.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border shadow">
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {Array.isArray(parsed.actions) && parsed.actions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            🚀 Next 5 Action Items
          </h2>

          <div className="flex flex-wrap gap-2 mt-3">
            {parsed.actions.map((a, i) => (
              <span key={i} className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 rounded-full border border-indigo-300/40 dark:border-indigo-600/40">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button onClick={fetchRoadmap} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow">
          Regenerate Roadmap
        </button>

        <button
          onClick={() => {
            localStorage.removeItem(cacheKey);
            loadedOnce.current = false; // allow regeneration again
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
          {open ? <ChevronDown /> : <ChevronRight />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
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
