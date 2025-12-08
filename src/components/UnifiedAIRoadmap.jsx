// src/components/UnifiedAIRoadmap.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import { createPortal } from "react-dom";
import { useUser } from "../contexts/UserContext";

export default function UnifiedAIRoadmap({ goals }) {
  const { userStats = {}, user } = useUser();

  const [loading, setLoading] = useState(false);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [error, setError] = useState("");
  const [expandedMonth, setExpandedMonth] = useState(1);

  // Parsed sections
  const [summary, setSummary] = useState("");
  const [months, setMonths] = useState([]);
  const [projects, setProjects] = useState([]);
  const [actions, setActions] = useState([]);

  // Timestamp
  const [timestamp, setTimestamp] = useState("");

  // NEW — month explanations
  const [monthExplanations, setMonthExplanations] = useState({});
  const [explainLoading, setExplainLoading] = useState(null);

  // NEW — modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMonthTitle, setModalMonthTitle] = useState("");
  const [modalMonthNumber, setModalMonthNumber] = useState(null);

  // ------------------------------------------------------------
  // Fetch Full Roadmap
  // ------------------------------------------------------------
  const fetchRoadmap = async () => {
    if (!goals) return;

    setLoading(true);
    setError("");
    setSummary("");
    setMonths([]);
    setProjects([]);
    setActions([]);
    setMonthExplanations({});
    setModalOpen(false);

    try {
      const res = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "roadmap",
          prompt: "Generate my AI roadmap",
          userGoals: goals,
          userStats,
          user,
        }),
      });

      const data = await res.json();
      const markdown = data?.choices?.[0]?.message?.content || "";

      setRawMarkdown(markdown);
      parseRoadmap(markdown);
      setTimestamp(new Date().toLocaleString());
    } catch (e) {
      setError("Failed to generate roadmap.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoadmap();
  }, [goals]);

  // ------------------------------------------------------------
  // Fetch Explanation For a Month
  // ------------------------------------------------------------
  const fetchMonthExplanation = async (monthTitle, monthNumber) => {
    if (!monthTitle || !goals) return;

    setExplainLoading(monthNumber);
    setModalMonthTitle(monthTitle);
    setModalMonthNumber(monthNumber);
    setModalOpen(true);

    try {
      const res = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "roadmap_explain",
          prompt: `Explain ${monthTitle} in simple, motivating terms.`,
          monthTitle,
          userGoals: goals,
          userStats,
          user
        }),
      });

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || "";

      setMonthExplanations((prev) => ({
        ...prev,
        [monthNumber]: marked.parse(content),
      }));
    } catch (e) {
      setMonthExplanations((prev) => ({
        ...prev,
        [monthNumber]: "<p class='text-red-500'>Failed to load explanation.</p>",
      }));
    }

    setExplainLoading(null);
  };

  // ------------------------------------------------------------
  // Parse Markdown
  // ------------------------------------------------------------
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

      if (mode === "summary" && line.length > 0)
        summaryText += line + "\n";

      if (mode === "months") {
        if (line.startsWith("### Month")) {
          if (currentMonth) tempMonths.push(currentMonth);

          currentMonth = {
            title: line.replace("### ", "").trim(),
            weeks: [],
          };
        } else if (line.startsWith("- Week") && currentMonth) {
          currentMonth.weeks.push(line.substring(2));
        }
      }

      if (mode === "projects" && line.startsWith("- "))
        tempProjects.push(line.substring(2));

      if (mode === "actions" && line.startsWith("- "))
        tempActions.push(line.substring(2));
    }

    if (currentMonth) tempMonths.push(currentMonth);

    setSummary(summaryText);
    setMonths(tempMonths);
    setProjects(tempProjects);
    setActions(tempActions);
  };

  // ------------------------------------------------------------
  // Modal UI (Glassmorphic)
  // ------------------------------------------------------------
  const ExplanationModal = () => {
    if (!modalOpen) return null;

    return createPortal(
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[2000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              bg-white/20 dark:bg-gray-800/30 
              rounded-2xl p-6 w-[90%] max-w-xl shadow-xl
              border border-white/30 dark:border-gray-700/40
              backdrop-blur-xl
            "
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
          >
            {/* Title */}
            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-3">
              {modalMonthTitle}
            </h3>

            {/* Loading Spinner */}
            {explainLoading === modalMonthNumber && (
              <div className="text-center py-6 text-indigo-500 animate-pulse">
                Fetching explanation…
              </div>
            )}

            {/* Explanation Content */}
            {!explainLoading && monthExplanations[modalMonthNumber] && (
              <div
                className="prose dark:prose-invert max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: monthExplanations[modalMonthNumber],
                }}
              />
            )}

            {/* Close Button */}
            <div className="mt-6 text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="
                  px-4 py-2 rounded-lg bg-indigo-600 text-white 
                  hover:bg-indigo-700 transition
                "
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };

  // ------------------------------------------------------------
  // Main UI
  // ------------------------------------------------------------
  return (
    <div className="
      p-8 rounded-2xl border shadow-sm 
      bg-gradient-to-br from-white to-gray-50 
      dark:from-gray-900 dark:to-gray-800
    ">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-indigo-600">
            Your AI-Generated Roadmap
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
            A personalized, AI-built month–by–month learning plan.
          </p>

          {timestamp && (
            <p className="text-xs text-gray-400 mt-1">
              Last generated: <span className="font-medium">{timestamp}</span>
            </p>
          )}
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

      {/* LOADING STATE */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-2/4 bg-gray-300/70 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300/70 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-300/70 dark:bg-gray-700 rounded"></div>

          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200/70 dark:bg-gray-800 rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && rawMarkdown && (
        <div className="space-y-10">

          {/* Outcome Summary */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="
                p-6 rounded-xl border shadow-sm
                bg-gradient-to-br from-indigo-50 to-purple-50
                dark:from-gray-800 dark:to-gray-900
              "
            >
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                Outcome Summary
              </h3>

              <div
                className="prose dark:prose-invert max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: marked.parse(summary) }}
              />
            </motion.div>
          )}

          {/* Months Accordion */}
          <div className="space-y-5">
            {months.map((month, index) => {
              const number = index + 1;
              const isOpen = expandedMonth === number;

              return (
                <motion.div
                  key={number}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border shadow-sm bg-white dark:bg-gray-800"
                >
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700">

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-indigo-600 text-lg">
                        {month.title}
                      </span>

                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-500 text-xl cursor-pointer"
                        onClick={() =>
                          setExpandedMonth(isOpen ? null : number)
                        }
                      >
                        ▼
                      </motion.span>
                    </div>

                    {/* Explain Button */}
                    <button
                      disabled={explainLoading === number}
                      onClick={() =>
                        fetchMonthExplanation(month.title, number)
                      }
                      className="
                        mt-2 text-sm px-3 py-1 rounded-lg border
                        bg-white dark:bg-gray-900
                        text-indigo-600 border-indigo-300 
                        hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                        transition
                      "
                    >
                      {explainLoading === number
                        ? "Explaining…"
                        : "Explain This Month"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 py-4">
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                            {month.weeks.map((week, i) => (
                              <li
                                key={i}
                                className="text-sm leading-relaxed tracking-tight"
                              >
                                {week}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Projects */}
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

          {/* Action Items */}
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

      {/* Modal Renderer */}
      <ExplanationModal />
    </div>
  );
}
