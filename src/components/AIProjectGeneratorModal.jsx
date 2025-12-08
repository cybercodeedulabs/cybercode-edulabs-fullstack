// src/components/AIProjectGeneratorModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useUser } from "../contexts/UserContext";

/**
 * AIProjectGeneratorModal
 *
 * - Sends a request to the Netlify ask-ai function (mode: "project")
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
  const [generated, setGenerated] = useState(null); // full project object returned by saveGeneratedProject
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  // ---------- Helpers: sanitize and parse AI output ----------

  // Remove code fences and surrounding markdown
  const stripCodeFences = (text) => {
    if (!text || typeof text !== "string") return text;
    // remove triple backtick blocks wrappers (but keep inner)
    const fenceRe = /```(?:json|js|javascript|json5)?\s*([\s\S]*?)```/i;
    const m = text.match(fenceRe);
    if (m && m[1]) return m[1].trim();
    // remove single-line fences or ``` on their own lines
    return text.replace(/```/g, "").trim();
  };

  // Try to find the first JSON object substring in a mixed string
  const extractFirstJsonSubstring = (s) => {
    if (!s || typeof s !== "string") return null;
    const start = s.indexOf("{");
    if (start === -1) return null;

    // Attempt to find matching closing brace by tracking braces
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

  // Try multiple parsing strategies to obtain a JS object from AI text
  const safeParseJsonFromText = (text) => {
    if (!text || typeof text !== "string") return null;

    // 1) strip fences
    let cleaned = stripCodeFences(text);

    // common issue: AI returns markdown lists or extra commentary. attempt direct parse first
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // continue
    }

    // 2) attempt to extract first {...} substring and parse
    const jsonSub = extractFirstJsonSubstring(cleaned);
    if (jsonSub) {
      try {
        return JSON.parse(jsonSub);
      } catch (e) {
        // try to sanitize small issues like trailing commas
        const fixed = jsonSub.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
        try {
          return JSON.parse(fixed);
        } catch (e2) {
          // continue
        }
      }
    }

    // 3) fallback: attempt to find property-like lines and build object heuristically
    // This is a minimal heuristic: lines like `title: Value` -> { title: "Value" }
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

    // 4) give up
    return null;
  };

  // Normalize structure to UI-friendly shape
  const normalizeProject = (raw, fallbackTopic) => {
    if (!raw || typeof raw !== "object") raw = {};

    // Prefer arrays for tech_stack/tasks
    const techStackCandidates =
      raw.tech_stack || raw.techStack || raw["tech-stack"] || raw.tech || raw.stack || [];
    const tasksCandidates = raw.tasks || raw.tasks_list || raw.steps || raw.milestones || raw.tasks_list || [];

    const toArray = (v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      if (typeof v === "string") {
        // split by line breaks or commas
        const sep = v.includes("\n") ? "\n" : ",";
        return v.split(sep).map((s) => s.trim()).filter(Boolean);
      }
      return [];
    };

    const title =
      raw.title ||
      raw.project_title ||
      raw.name ||
      (fallbackTopic ? `Project: ${fallbackTopic}` : "Untitled Project");

    const description =
      raw.description ||
      raw.summary ||
      raw["Project Summary"] ||
      raw.details ||
      "No description provided.";

    const difficulty =
      raw.difficulty ||
      raw.level ||
      raw.skill_level ||
      (raw.difficulty_level ? String(raw.difficulty_level) : undefined) ||
      "Intermediate";

    return {
      id: raw.id || `local-${Date.now()}-${Math.random()}`,
      title,
      description,
      techStack: toArray(techStackCandidates),
      difficulty,
      steps: toArray(tasksCandidates).slice(0, 10), // keep reasonable limit
      timestamp: Date.now(),
      rawJson: raw,
    };
  };

  // ---------- Main generation flow ----------
  const generateProject = async () => {
    setError(null);
    setGenerated(null);
    if (!topic || !topic.trim()) {
      setError("Please enter a topic or project idea.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "project",
          prompt: `Generate a real-world engineering project with:
- title
- description
- tech_stack (array)
- difficulty (Beginner, Intermediate, Advanced)
- tasks (exactly 5 items)
Topic: ${topic}`,
          user: user ? { uid: user.uid } : null,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`AI service error: ${res.status} ${txt}`);
      }

      const data = await res.json().catch(() => null);
      const text = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";

      if (!text) {
        throw new Error("AI returned empty response.");
      }

      // Parse AI output robustly
      const parsed = safeParseJsonFromText(String(text));

      if (!parsed) {
        // as a last resort, attempt to parse the entire returned raw (if raw exists)
        const fallbackRaw = data?.raw?.choices?.[0]?.message?.content || data?.raw?.choices?.[0]?.text;
        const parsedFallback = fallbackRaw ? safeParseJsonFromText(String(fallbackRaw)) : null;
        if (parsedFallback) {
          parsed = parsedFallback;
        }
      }

      if (!parsed) {
        // final fallback: build a minimal object from the prompt/topic
        const fallbackObj = {
          title: `Project: ${topic}`,
          description: `AI returned an unparsable response. Please try again with a simpler topic or check logs.`,
          tech_stack: [],
          difficulty: "Intermediate",
          tasks: [],
        };
        // still save this as raw so you have a record
        const finalNormalized = normalizeProject(fallbackObj, topic);
        const saved = await saveGeneratedProject({
          title: finalNormalized.title,
          description: finalNormalized.description,
          rawJson: fallbackObj,
        });
        setGenerated(saved);
        setError("AI returned unexpected output; saved a fallback project. Try regenerating with a simpler prompt.");
        setLoading(false);
        return;
      }

      // At this point we have a parsed JSON object
      const finalNormalized = normalizeProject(parsed, topic);

      // Save both normalized and raw parsed JSON to server (rawJson = parsed)
      const saved = await saveGeneratedProject({
        title: finalNormalized.title,
        description: finalNormalized.description,
        rawJson: parsed,
      });

      // saveGeneratedProject now returns the full object (per UserContext update)
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

  // ---------- Delete saved project (server-backed only) ----------
  const handleDeleteSaved = async () => {
    if (!generated || !generated.id) return;
    const isLocal = String(generated.id).startsWith("local-");
    if (isLocal) {
      // Per Option A, block deletion for local-only projects
      alert("This project is local-only and cannot be deleted. Login to manage projects.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const res = await deleteProject(generated.id);
      setDeleting(false);
      if (res?.success) {
        setGenerated(null);
        // Optionally close modal after deletion
        // onClose();
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
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl max-w-lg w-full relative"
      >
        {/* Close */}
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <Icon icon="mdi:close" width={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Icon icon="mdi:lightbulb-on-outline" width={22} className="text-indigo-500" />
          <h2 className="text-xl font-bold text-indigo-600">AI Project Generator</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
          Describe the project idea and Cybercode AI will generate a professional project structure.
        </p>

        <input
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
            {loading && <Icon icon="mdi:loading" width={18} className="animate-spin" />}
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

              {/* Show delete only for server-backed projects (UserContext blocks local deletions) */}
              <button
                onClick={handleDeleteSaved}
                disabled={deleting}
                className={`px-4 py-2 text-sm rounded-lg border ${
                  deleting ? "border-gray-400 text-gray-400" : "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
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
