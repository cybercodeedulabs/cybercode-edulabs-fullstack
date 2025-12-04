// src/pages/StudentProjectDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function StudentProjectDetail() {
  const { id } = useParams();
  const { generatedProjects = [] } = useUser();

  if (!Array.isArray(generatedProjects)) return null;

  const project = generatedProjects.find((p) => String(p.id) === String(id));


  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Project Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The project you are looking for does not exist.
        </p>
        <Link
          to="/student-projects"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <motion.section
      className="max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Back Button */}
      <Link
        to="/student-projects"
        className="inline-block mb-8 text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        ← Back to Projects
      </Link>

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
        {project.title}
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Created on{" "}
        {new Date(project.timestamp || project.createdAt || Date.now()).toLocaleDateString()}
      </p>

      {/* Description */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10 border">
        <h2 className="text-xl font-semibold mb-3">📘 Description</h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Tech Stack */}
      {project.techStack?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10 border">
          <h2 className="text-xl font-semibold mb-3">🛠 Tech Stack</h2>
          <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">
            {project.techStack.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      {project.steps?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10 border">
          <h2 className="text-xl font-semibold mb-3">📌 Project Steps</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            {project.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Difficulty */}
      {project.difficulty && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-10 border">
          <h2 className="text-xl font-semibold mb-3">⚡ Difficulty</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {project.difficulty}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
          Export as PDF (Coming Soon)
        </button>

        <button
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-ai-assistant", {
                detail: { focus: true, context: project },
              })
            )
          }
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
        >
          Improve with AI
        </button>
      </div>
    </motion.section>
  );
}
