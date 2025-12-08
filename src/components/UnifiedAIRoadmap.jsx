// src/components/UnifiedAIRoadmap.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import { useUser } from "../contexts/UserContext";

export default function UnifiedAIRoadmap({ goals }) {
  const { userStats = {}, user } = useUser();

  const [loading, setLoading] = useState(false);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [error, setError] = useState("");
  const [expandedMonth, setExpandedMonth] = useState(1); // Month 1 auto-open

  // Parsed structured roadmap sections
  const [summary, setSummary] = useState("");
  const [months, setMonths] = useState([]);
  const [projects, setProjects] = useState([]);
  const [actions, setActions] = useState([]);

  const fetchRoadmap = async () => {
    if (!goals) return;
    setLoading(true);
    setError("");
    setSummary("");
    setMonths([]);
    setProjects([]);
    setActions([]);

    try {
      const res = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "roadmap",
          prompt: "Generate my AI roadmap",
          userGoals: goals,
          userStats,
          user
        }),
      });

      const data = await res.json();
      const markdown = data?.choices?.[0]?.message?.content || "";

      setRawMarkdown(markdown);
      parseRoadmap(markdown);
    } catch (e) {
      setError("Failed to generate roadmap.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoadmap();
  }, [goals]);

  // ----------- PARSER: Extract AI sections into UI-friendly structure ----------
  const parseRoadmap = (md) => {
    if (!md) return;

    const lines = md.split("\n").map((l) => l.trim());

    let currentMonth = null;
    let tempMonths = [];
    let tempProjects = [];
    let tempActions = [];
    let summaryText = "";

    let mode = "";

    for (let line of lines) {
      if (line.startsWith("## Outcome Summary")) {
        mode = "summary";
        continue;
      }
      if (line.startsWith("## Month-by-Month")) {
        mode = "months";
        continue;
      }
      if (line.startsWith("## Recommended Projects")) {
        mode = "projects";
        continue;
      }
      if (line.startsWith("## Next 5 Action Items")) {
        mode = "actions";
        continue;
      }

      // SUMMARY
      if (mode === "summary" && line.length > 0) {
        summaryText += line + "\n";
      }

      // MONTH PHASES
      if (mode === "months") {
        if (line.startsWith("### Month")) {
          // New month header
          if (currentMonth) tempMonths.push(currentMonth);

          currentMonth = {
            title: line.replace("### ", "").trim(),
            weeks: []
          };
        } else if (line.startsWith("- Week") && currentMonth) {
          currentMonth.weeks.push(line.substring(2));
        }
      }

      // PROJECTS
      if (mode === "projects" && line.startsWith("- ")) {
        tempProjects.push(line.substring(2));
      }

      // ACTION ITEMS
      if (mode === "actions" && line.startsWith("- ")) {
        tempActions.push(line.substring(2));
      }
    }

    if (currentMonth) tempMonths.push(currentMonth);

    setSummary(summaryText);
    setMonths(tempMonths);
    setProjects(tempProjects);
    setActions(tempActions);
  };

  // ---------- UI Rendering ----------
  return (
    <div
      className="
        p-8 rounded-2xl border shadow-sm
        bg-gradient-to-br from-white to-gray-50
        dark:from-gray-900 dark:to-gray-800
      "
    >
      {/* Header & Regenerate Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Your AI-Generated Roadmap
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Personalized study plan built from your goals, skills & intensity.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={fetchRoadmap}
          className="
            px-5 py-2 rounded-xl bg-indigo-600 text-white shadow
            hover:bg-indigo-700 transition-all
          "
        >
          Regenerate
        </motion.button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 space-y-4 animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && rawMarkdown && (
        <div className="space-y-10">

          {/* -------- Outcome Summary -------- */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="
                p-6 rounded-xl border shadow-sm
                bg-gradient-to-br from-indigo-50 to-purple-50
                dark:from-gray-800 dark:to-gray-900
              "
            >
              <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                Outcome Summary
              </h3>

              <div
                className="prose dark:prose-invert max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: marked.parse(summary) }}
              />
            </motion.div>
          )}

          {/* -------- Months Accordion -------- */}
          <div className="space-y-5">
            {months.map((month, index) => {
              const monthNumber = index + 1;
              const isOpen = expandedMonth === monthNumber;

              return (
                <motion.div
                  key={monthNumber}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    rounded-xl border shadow-sm overflow-hidden
                    bg-white dark:bg-gray-800
                  "
                >
                  <button
                    onClick={() => setExpandedMonth(isOpen ? null : monthNumber)}
                    className="w-full flex justify-between items-center p-5 text-left"
                  >
                    <span className="font-semibold text-lg text-indigo-600">
                      {month.title}
                    </span>

                    <motion.span
                      initial={{ rotate: 0 }}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-500 text-xl"
                    >
                      ▼
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-5"
                      >
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                          {month.weeks.map((week, i) => (
                            <li key={i} className="text-sm leading-relaxed">
                              {week}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* -------- Projects Section -------- */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                p-6 rounded-xl border shadow-sm
                bg-gradient-to-br from-blue-50 to-indigo-50
                dark:from-gray-800 dark:to-gray-900
              "
            >
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                Recommended Projects
              </h3>

              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                {projects.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* -------- Action Items -------- */}
          {actions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                p-6 rounded-xl border shadow-sm
                bg-gradient-to-br from-teal-50 to-emerald-50
                dark:from-gray-800 dark:to-gray-900
              "
            >
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                Next 5 Action Items
              </h3>

              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                {actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
