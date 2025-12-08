import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import { useUser } from "../contexts/UserContext";

/**
 * UnifiedAIRoadmap
 * - Combines deterministic Goal timeline (based on goals) with an AI-generated detailed
 *   month-by-month plan fetched from your Netlify GROQ function.
 * - Shows concise summary, collapsible monthly sections, recommended projects & action items.
 * - Smooth animations, fast loading states, graceful error handling.
 */

export default function UnifiedAIRoadmap({ goals }) {
  const { userStats = {}, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [aiRaw, setAiRaw] = useState(""); // raw markdown from AI
  const [error, setError] = useState("");
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  // Local lightweight roadmap derived from goals (fallback / timeline)
  const localRoadmap = useMemo(() => {
    if (!goals) return null;
    const { skills = {}, hoursPerWeek = 6, deadlineMonths = 6, targetRole } = goals;
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
      },
      {
        id: 2,
        monthRange: `${Math.max(1, Math.round(months * 0.25)) + 1} - ${Math.max(
          1,
          Math.round(months * 0.5)
        )}`,
        title: "Core Platform Skills",
        desc: "Cloud IAM, compute, storage, networking, observability.",
      },
      {
        id: 3,
        monthRange: `${Math.max(1, Math.round(months * 0.5)) + 1} - ${projectFocusMonth}`,
        title: "Hands-on Projects",
        desc: "Build 2–3 deployable real-world projects.",
      },
      {
        id: 4,
        monthRange: `${projectFocusMonth + 1} - ${months}`,
        title: "Interview & Portfolio",
        desc: "Resume, mock interviews, portfolio polishing, job prep.",
      },
    ];

    return {
      summary: `Target Role: ${targetRole || "Your chosen role"} • Duration: ${months} months • Intensity: ${intensity} • Readiness: ${avgSkill}%`,
      phases,
      months,
    };
  }, [goals]);

  // Parse AI markdown into structured sections: outcome, months (map), projects, actions
  const parsedAi = useMemo(() => {
    if (!aiRaw) return null;

    // Split sections by headings "##"
    const sections = {};
    const lines = aiRaw.split(/\r?\n/);
    let current = null;
    for (const line of lines) {
      const h = line.match(/^#{2,}\s*(.+)/);
      if (h) {
        current = h[1].trim();
        sections[current] = sections[current] || [];
        continue;
      }
      if (current) sections[current].push(line);
    }

    // Convert blocks to HTML using marked for safety and style
    const toHtml = (arr) => marked.parse(arr.join("\n").trim());

    // Month-by-month: gather lines under "Month-by-Month Roadmap" if available,
    // otherwise attempt to collect lines that look like "Month 1" etc.
    const monthBlock = sections["Month-by-Month Roadmap"] || sections["Month by Month Roadmap"] || [];
    const monthMap = {};
    if (monthBlock.length > 0) {
      let curMonth = null;
      for (const line of monthBlock) {
        const m = line.match(/^Month\s*([\d]+)\s*[:\-–]?\s*(.*)/i);
        if (m) {
          curMonth = `Month ${m[1]}`;
          monthMap[curMonth] = monthMap[curMonth] || [];
          if (m[2]) monthMap[curMonth].push(m[2]);
          continue;
        }
        // bullets
        if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
          if (curMonth) monthMap[curMonth].push(line.replace(/^[-*]\s?/, ""));
        } else {
          if (curMonth) monthMap[curMonth].push(line);
        }
      }
    } else {
      // fallback: search for lines starting with "Month"
      for (const line of aiRaw.split(/\r?\n/)) {
        const m = line.match(/^Month\s*([\d]+)\s*[:\-–]?\s*(.*)/i);
        if (m) {
          const key = `Month ${m[1]}`;
          monthMap[key] = monthMap[key] || [];
          if (m[2]) monthMap[key].push(m[2]);
        }
      }
    }

    return {
      outcomeHtml: sections["Outcome Summary"] ? toHtml(sections["Outcome Summary"]) : null,
      months: Object.keys(monthMap).length > 0 ? Object.fromEntries(
        Object.entries(monthMap).slice(0, 24).map(([k, v]) => [k, marked.parse(v.join("\n"))])
      ) : null,
      projectsHtml: sections["Recommended Projects"] ? toHtml(sections["Recommended Projects"]) : null,
      actionsHtml: sections["Next 5 Action Items"] ? toHtml(sections["Next 5 Action Items"]) : null,
      raw: aiRaw,
    };
  }, [aiRaw]);

  // Fetch AI roadmap from server
  const fetchRoadmap = async (force = false) => {
    if (!goals) return;
    // Avoid refetching too often unless forced
    if (!force && lastFetchedAt && Date.now() - lastFetchedAt < 60 * 1000) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "roadmap",
          prompt: "Generate a structured month-by-month roadmap for this user.",
          userGoals: goals,
          userStats,
          user,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "AI server error");
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || "";

      // small cleanup
      const cleaned = content.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
      setAiRaw(cleaned);
      setLastFetchedAt(Date.now());
      // expand first month by default
      setExpandedMonth(null);
    } catch (e) {
      console.error("UnifiedAIRoadmap fetch error:", e);
      setError("Failed to generate AI roadmap. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  useEffect(() => {
    if (goals) fetchRoadmap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals]);

  // UI helpers
  const toggleMonth = (monthKey) => {
    setExpandedMonth((prev) => (prev === monthKey ? null : monthKey));
  };

  // Render month list: prefer AI months if available else synthesize from localRoadmap
  const monthEntries = useMemo(() => {
    if (parsedAi?.months) {
      return Object.entries(parsedAi.months);
    }
    if (localRoadmap?.months) {
      const months = Number(localRoadmap.months || 6);
      const arr = [];
      for (let i = 1; i <= months; i++) {
        arr.push([`Month ${i}`, `<p>Suggested focus: ${localRoadmap.phases[Math.floor(((i-1)/months)*localRoadmap.phases.length)].title}</p>`]);
      }
      return arr;
    }
    return [];
  }, [parsedAi, localRoadmap]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Summary + timeline */}
      <div className="lg:col-span-5 space-y-5">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 border shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-700">Roadmap Summary</h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {localRoadmap?.summary || "Provide goals to generate a personalized roadmap."}
          </p>

          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <div>Months: <span className="font-medium text-gray-700 dark:text-gray-200">{localRoadmap?.months || "—"}</span></div>
            <div>Estimated Intensity: <span className="font-medium">{localRoadmap ? localRoadmap.summary.split("•")[2].trim() : "—"}</span></div>
            <div>AI Status: <span className="font-medium">{loading ? "Generating…" : parsedAi ? "Ready" : "Idle"}</span></div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => fetchRoadmap(true)}
              disabled={loading}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm shadow hover:bg-indigo-700"
            >
              {loading ? "Generating…" : "Regenerate AI Roadmap"}
            </button>

            <button
              onClick={() => { setAiRaw(""); setError(""); setExpandedMonth(null); }}
              className="px-3 py-2 bg-white dark:bg-gray-800 border rounded-md text-sm shadow"
            >
              Clear AI View
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border shadow-sm">
          <h4 className="font-semibold text-indigo-600 mb-3">Timeline</h4>
          <div className="space-y-4">
            {localRoadmap?.phases?.map((ph) => (
              <motion.div
                key={ph.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: ph.id * 0.03 }}
                className="flex items-start gap-3"
              >
                <div className="w-3 h-3 mt-1 rounded-full bg-indigo-600 shrink-0" />
                <div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{ph.title}</div>
                    <div className="text-xs text-gray-500">{ph.monthRange}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{ph.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border shadow-sm">
          <h4 className="font-semibold text-indigo-600 mb-2">Recommended Projects (Preview)</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            AI-generated projects (if available) will appear on the right. You can pin them to your dashboard when satisfied.
          </p>
          {parsedAi?.projectsHtml ? (
            <div className="mt-3 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: parsedAi.projectsHtml }} />
          ) : (
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li>• Build a cloud-deployed microservice</li>
              <li>• Create an end-to-end ML inference pipeline</li>
              <li>• Implement a secure CI/CD workflow</li>
            </ul>
          )}
        </div>
      </div>

      {/* Right: AI Month-by-Month + Actions */}
      <div className="lg:col-span-7 space-y-5">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border shadow-sm">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-lg font-semibold text-indigo-600">AI Detailed Plan</h3>
              <p className="text-sm text-gray-500 mt-1">Step-by-step weekly tasks and clear action items generated by AI.</p>
            </div>

            <div className="text-right text-xs text-gray-400">
              <div>{lastFetchedAt ? `Generated: ${new Date(lastFetchedAt).toLocaleString()}` : "Not generated yet"}</div>
              <div className="mt-2">
                <button
                  onClick={() => fetchRoadmap(true)}
                  disabled={loading}
                  className="px-3 py-1 rounded-md text-sm bg-indigo-50 text-indigo-700 border"
                >
                  {loading ? "Working…" : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            {!loading && parsedAi?.outcomeHtml && (
              <AnimatePresence>
                <motion.div
                  key="outcome"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 p-4 rounded-md border"
                >
                  <div className="text-sm font-semibold text-yellow-800">Outcome Summary</div>
                  <div className="mt-2 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: parsedAi.outcomeHtml }} />
                </motion.div>
              </AnimatePresence>
            )}

            {loading && (
              <div className="py-8">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                </div>
              </div>
            )}

            {/* Month-by-month list */}
            <div className="mt-4 space-y-3">
              {monthEntries.length === 0 && !loading && (
                <div className="text-sm text-gray-500">No detailed month plan available yet.</div>
              )}

              {monthEntries.map(([monthKey, html], idx) => {
                const isOpen = expandedMonth === monthKey || (expandedMonth === null && idx === 0 && !!html);
                return (
                  <motion.div
                    key={monthKey}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: idx * 0.02 }}
                    className="border rounded-lg"
                  >
                    <div
                      onClick={() => toggleMonth(monthKey)}
                      className="flex items-center justify-between cursor-pointer p-3"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{monthKey}</div>
                        <div className="text-xs text-gray-500">{`Focus: ${localRoadmap?.phases?.[Math.floor((idx/localRoadmap.months)*localRoadmap.phases.length)]?.title || "Skills & Projects"}`}</div>
                      </div>

                      <div className="text-xs text-indigo-600 font-medium">
                        {isOpen ? "Collapse" : "Expand"}
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-4 pb-4"
                        >
                          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Action items */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-indigo-600">Next Action Items</h4>
              <div className="mt-2">
                {parsedAi?.actionsHtml ? (
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: parsedAi.actionsHtml }} />
                ) : (
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Finalize learning hours & commit to weekly sprints.</li>
                    <li>• Pick first project and define scope (deliverable in 4 weeks).</li>
                    <li>• Set up cloud lab and CI/CD pipeline.</li>
                    <li>• Build README & documentation as you go.</li>
                    <li>• Prepare 2 interview questions and answers for weekly practice.</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Raw / debug panel (collapsed) */}
        <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border text-xs text-gray-500">
          <details>
            <summary className="cursor-pointer">Raw AI Output (debug)</summary>
            <pre className="mt-2 max-h-48 overflow-auto text-xs whitespace-pre-wrap">{aiRaw || "—"}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}
