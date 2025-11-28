import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Lightbulb, Loader2 } from "lucide-react";
import { useUser } from "../contexts/UserContext";

export default function AIProjectGeneratorModal({ isOpen, onClose }) {
  const { saveGeneratedProject, user } = useUser();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);

  if (!isOpen) return null;

  /** ---------------------------------------
   *  Normalizes AI JSON → camelCase for UI
   ---------------------------------------- */
  const normalizeProject = (raw) => {
    if (!raw || typeof raw !== "object") return {};

    return {
      id: raw.id || crypto.randomUUID(),

      title: raw.title || raw.project_title || "Untitled Project",

      description:
        raw.description ||
        raw.summary ||
        raw["Project Summary"] ||
        "No description provided.",

      techStack:
        raw.techStack ||
        raw.tech_stack ||
        raw["tech-stack"] ||
        [],

      difficulty: raw.difficulty || raw.level || "Intermediate",

      steps:
        raw.steps ||
        raw.tasks ||
        raw.milestones ||
        raw["quick_steps"] ||
        [],

      // timestamp normalization
      timestamp: Date.now(),
    };
  };

  const generateProject = async () => {
    if (!topic.trim()) return;
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
          - difficulty
          - tasks (5 items)
          Topic: ${topic}`,
          user,
        }),
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "{}";

      let parsed = {};
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse failed, raw text:", text);
      }

      // ⭐ FIX: Normalize shape for UI
      const finalProject = normalizeProject(parsed);

      const saved = await saveGeneratedProject({
        ...finalProject,
        type: "ai",
      });

      setGenerated(saved);
    } catch (err) {
      console.error("Project generation failed:", err);
    }

    setLoading(false);
  };

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
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={22} className="text-indigo-500" />
          <h2 className="text-xl font-bold text-indigo-600">
            AI Project Generator
          </h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
          Describe what type of project you want, and Cybercode AI will generate a
          professional, real-world project structure.
        </p>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Cloud automation using Terraform"
          className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg mb-4"
        />

        <button
          onClick={generateProject}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow text-sm font-semibold flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Generating..." : "Generate Project"}
        </button>

        {generated && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-indigo-600">
              {generated.title}
            </h3>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
              {generated.description}
            </p>
            <button
              className="mt-3 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
