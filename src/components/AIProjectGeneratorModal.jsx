import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useUser } from "../contexts/UserContext";

/**
 * AIProjectGeneratorModal
 *
 * - Sends a request to the Netlify ask-ai function (mode: "project")
 * - Requests a COMPLETE blueprint (S2 schema)
 * - Parses, normalizes, and saves the AI output to backend via saveGeneratedProject
 * - Displays a minimal success card (title + description + Done)
 * - Allows deletion of server-backed projects (deleteProject)
 *
 * Notes:
 * - This component expects saveGeneratedProject to return the full project object (not just id).
 * - For offline/local mode (local- ids), delete is blocked by UserContext (per Option A).
 */

export default function AIProjectGeneratorModal({ isOpen, onClose }) {
  const { saveGeneratedProject, deleteProject, user } = useUser();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // NEW — input ref for auto-focus & Enter key
  const inputRef = useRef(null);

  // Auto-focus + Enter/Escape key handler
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();

    const handleKey = (e) => {
      if (!isOpen) return;

      if (e.key === "Enter") {
        // If focus is on a multi-line field in future, adjust accordingly. For now input is single-line.
        e.preventDefault();
        if (!loading) generateProject();
      }

      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, loading, topic]);

  if (!isOpen) return null;

  // ---------- Helpers: sanitize and parse AI output ----------

  const stripCodeFences = (text) => {
    if (!text || typeof text !== "string") return text;
    const fenceRe = /```(?:json|js|javascript|json5)?\s*([\s\S]*?)```/i;
    const m = text.match(fenceRe);
    if (m && m[1]) return m[1].trim();
    return text.replace(/```/g, "").trim();
  };

  const extractFirstJsonSubstring = (s) => {
    if (!s || typeof s !== "string") return null;
    const start = s.indexOf("{");
    if (start === -1) return null;

    let depth = 0;
    for (let i = start; i < s.length; i++) {
      const ch = s[i];
      if (ch === "{") depth += 1;
      else if (ch === "}") {
        depth -= 1;
        if (depth === 0) {
          return s.slice(start, i + 1);
        }
      }
    }
    return null;
  };

  const safeParseJsonFromText = (text) => {
    if (!text || typeof text !== "string") return null;

    let cleaned = stripCodeFences(text);

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // ignore
    }

    const jsonSub = extractFirstJsonSubstring(cleaned);
    if (jsonSub) {
      try {
        return JSON.parse(jsonSub);
      } catch (e) {
        const fixed = jsonSub.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
        try {
          return JSON.parse(fixed);
        } catch (e2) {
          // ignore
        }
      }
    }

    // heuristic parse (key: value lines)
    const obj = {};
    const lines = cleaned.split("\n").map((l) => l.trim()).filter(Boolean);
    let foundAny = false;
    for (const line of lines) {
      const kv = line.split(":").map((x) => x.trim());
      if (kv.length >= 2) {
        const key = kv[0].replace(/^[-•\d.\s]+/, "").replace(/["'`]/g, "");
        const value = kv.slice(1).join(":").replace(/^[-\s"]+|["\s]+$/g, "");
        if (key && value) {
          obj[key] = value;
          foundAny = true;
        }
      }
    }
    if (foundAny) return obj;

    return null;
  };

  // Normalize S2 schema to UI-friendly shape (keeps rawJson)
  const normalizeProject = (raw, fallbackTopic) => {
    if (!raw || typeof raw !== "object") raw = {};

    // friendly getters with fallbacks
    const title =
      raw.title ||
      raw.project_title ||
      raw.name ||
      (fallbackTopic ? `Project: ${fallbackTopic}` : "Untitled Project");

    const description =
      raw.description ||
      raw.summary ||
      (typeof raw.problem_statement === "string" ? raw.problem_statement : "") ||
      "No description provided.";

    // collect arrays / strings into arrays
    const toArray = (v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      if (typeof v === "string") {
        const sep = v.includes("\n") ? "\n" : ",";
        return v.split(sep).map((s) => s.trim()).filter(Boolean);
      }
      return [];
    };

    const techStack =
      raw.tech_stack ||
      raw.techStack ||
      raw["tech-stack"] ||
      raw.tech ||
      raw.stack ||
      [];
    const steps =
      raw.step_by_step_guide ||
      raw.steps_to_build ||
      raw.step_by_step ||
      raw.step_by_step ||
      raw.step_guide ||
      raw.steps ||
      [];
    const tasks =
      raw.tasks || raw.tasks_list || raw.milestones || raw.steps || [];

    const difficulty =
      raw.difficulty ||
      raw.level ||
      raw.skill_level ||
      (raw.difficulty_level ? String(raw.difficulty_level) : undefined) ||
      "Intermediate";

    // system_design may be object — keep as-is for rawJson but derive summary
    const architecture =
      (typeof raw.system_design === "string" && raw.system_design) ||
      (raw.system_design && raw.system_design.architecture_overview) ||
      raw.architecture ||
      "";

    // final normalized shape (UI-friendly)
    return {
      id: raw.id || `local-${Date.now()}-${Math.random()}`,
      title,
      description,
      problem_statement: raw.problem_statement || "",
      why_it_matters: raw.why_it_matters || raw["why_it_matters"] || "",
      goals: toArray(raw.goals),
      prerequisites: toArray(raw.prerequisites),
      system_design: raw.system_design || (architecture ? { architecture_overview: architecture } : null),
      techStack: toArray(techStack),
      tasks: toArray(tasks),
      steps: toArray(steps).slice(0, 50),
      deployment_guide: raw.deployment || raw.deployment_guide || raw.deploymentSteps || [],
      bonus_enhancements: toArray(raw.bonus_features || raw.bonus_enhancements || raw.bonus),
      interview_questions: toArray(raw.interview_questions || raw.interviewQuestions || raw.interview_questions_list),
      sample_code: raw.sample_code || raw.sampleCode || "",
      testing_plan: toArray(raw.testing_plan || raw.testingPlan || raw.tests),
      difficulty,
      timestamp: Date.now(),
      rawJson: raw,
    };
  };

  // ---------- Main generation ----------
  const generateProject = async () => {
    setError(null);
    setGenerated(null);

    if (!topic || !topic.trim()) {
      setError("Please enter a topic or project idea.");
      return;
    }

    setLoading(true);

    try {
      // Strong instruction: return strict JSON ONLY, using S2 schema
      const s2Prompt = `
Return ONLY a VALID JSON object (no markdown, no explanations).
Use this exact S2 schema. All fields optional but include sensible defaults where possible.

{
  "title": "",
  "description": "",
  "problem_statement": "",
  "why_it_matters": "",
  "goals": [],
  "prerequisites": [],
  "system_design": {
    "architecture_overview": "",
    "components": [],
    "data_flow": ""
  },
  "tech_stack": [],
  "tasks": [],
  "step_by_step_guide": [],
  "sample_code": "",
  "testing_plan": [],
  "deployment": {
    "steps": [],
    "commands": []
  },
  "security_best_practices": [],
  "optimizations": [],
  "bonus_features": [],
  "interview_questions": []
}

Now generate a COMPLETE project blueprint following the schema above for the Topic: "${topic}".
Keep fields concise but actionable. Arrays should be arrays (not newline text). Difficulty can be omitted.
`;

      const res = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "project",
          prompt: s2Prompt,
          user: user ? { uid: user.uid } : null,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`AI service error: ${res.status} ${txt}`);
      }

      const data = await res.json().catch(() => null);
      const text =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        "";

      if (!text) throw new Error("AI returned empty response.");

      let parsed = safeParseJsonFromText(String(text));

      // try fallback to raw representation returned by API if available
      if (!parsed) {
        const fallbackRaw =
          data?.raw?.choices?.[0]?.message?.content ||
          data?.raw?.choices?.[0]?.text;
        const parsedFallback = fallbackRaw
          ? safeParseJsonFromText(String(fallbackRaw))
          : null;
        if (parsedFallback) parsed = parsedFallback;
      }

      if (!parsed) {
        // final fallback: save minimal blueprint
        const fallbackObj = {
          title: `Project: ${topic}`,
          description:
            "AI returned an unparsable response. Please try again with a simpler topic.",
          problem_statement: "",
          tech_stack: [],
          tasks: [],
          step_by_step_guide: [],
        };

        const finalNormalized = normalizeProject(fallbackObj, topic);

        const saved = await saveGeneratedProject({
          title: finalNormalized.title,
          description: finalNormalized.description,
          rawJson: fallbackObj,
        });

        setGenerated(saved);
        setError("AI returned unexpected output; fallback project saved.");
        setLoading(false);
        return;
      }

      const finalNormalized = normalizeProject(parsed, topic);

      const saved = await saveGeneratedProject({
        title: finalNormalized.title,
        description: finalNormalized.description,
        rawJson: parsed,
      });

      if (!saved) {
        throw new Error("Failed to save generated project.");
      }

      setGenerated(saved);
    } catch (err) {
      console.error("Project generation failed:", err);
      setError(err?.message || "Project generation failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Delete saved ----------
  const handleDeleteSaved = async () => {
    if (!generated || !generated.id) return;

    const isLocal = String(generated.id).startsWith("local-");
    if (isLocal) {
      alert("Local-only projects cannot be deleted.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await deleteProject(generated.id);
      setDeleting(false);

      if (res?.success) {
        setGenerated(null);
      } else {
        alert(res?.message || "Failed to delete project.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete project.");
      setDeleting(false);
    }
  };

  // ---------- Render ----------
  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl max-w-2xl w-full relative"
      >
        {/* Close */}
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <Icon icon="mdi:close" width={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Icon
            icon="mdi:lightbulb-on-outline"
            width={22}
            className="text-indigo-500"
          />
          <h2 className="text-xl font-bold text-indigo-600">
            AI Project Generator (Detailed Blueprint)
          </h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
          Describe the project idea. The AI will return a full technical blueprint (system design, steps, tests, deployment, and more).
        </p>

        {/* INPUT WITH ENTER SUPPORT */}
        <input
          ref={inputRef}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Cloud automation using Terraform"
          className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={generateProject}
            disabled={loading}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow text-sm font-semibold flex items-center justify-center gap-2"
          >
            {loading && (
              <Icon
                icon="mdi:loading"
                width={18}
                className="animate-spin"
              />
            )}
            {loading ? "Generating..." : "Generate Project"}
          </button>

          <button
            onClick={() => {
              setTopic("");
              setError(null);
            }}
            className="px-4 py-3 bg-white border dark:bg-gray-800 dark:border-gray-700 text-indigo-600 rounded-lg shadow-sm text-sm"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        )}

        {generated && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-indigo-600">
              {generated.title || "Untitled Project"}
            </h3>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
              {generated.description || "No description provided."}
            </p>

            <div className="mt-3 flex gap-2">
              <button
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg"
                onClick={() => {
                  onClose();
                }}
              >
                Done
              </button>

              <button
                onClick={handleDeleteSaved}
                disabled={deleting}
                className={`px-4 py-2 text-sm rounded-lg border ${
                  deleting
                    ? "border-gray-400 text-gray-400"
                    : "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                }`}
              >
                {deleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
