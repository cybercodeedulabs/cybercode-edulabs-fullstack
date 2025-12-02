// src/components/simulations/full-stack/ProjectWorkflowSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function ProjectWorkflowSimulator() {
  const [stage, setStage] = useState(0);

  const steps = [
    {
      icon: <Icon icon="mdi:code-tags" width={28} />,
      title: "Develop Your App",
      desc: "Write and test your full-stack app locally using React, Express, and MongoDB.",
    },
    {
      icon: <Icon icon="mdi:source-branch" width={28} />,
      title: "Push to GitHub",
      desc: "Commit and push your source code to a public or private GitHub repository.",
    },
    {
      icon: <Icon icon="mdi:cloud-upload-outline" width={28} />,
      title: "Deploy Frontend + Backend",
      desc: "Host frontend on Netlify and backend on Render — connect via live API URL.",
    },
    {
      icon: <Icon icon="mdi:check-circle-outline" width={28} />,
      title: "Submit for Review",
      desc: "Share your GitHub repo and live links for project evaluation.",
    },
    {
      icon: <Icon icon="mdi:trophy-outline" width={28} />,
      title: "Project Approved!",
      desc: "Congratulations! You’ve completed your Full-Stack Capstone Project.",
    },
  ];

  const next = () => setStage((s) => (s < steps.length - 1 ? s + 1 : s));
  const prev = () => setStage((s) => (s > 0 ? s - 1 : s));
  const reset = () => setStage(0);

  return (
    <div className="p-6 mt-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-green-300 dark:border-green-700 shadow-lg">
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
        🧩 Capstone Project Workflow Visualizer
      </h2>

      <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Follow each step to understand how your project moves from development to final certification.
      </p>

      {/* Steps */}
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.4, scale: 0.9 }}
            animate={{
              opacity: i === stage ? 1 : 0.4,
              scale: i === stage ? 1.1 : 0.9,
            }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-900 border border-green-300 dark:border-green-700 rounded-xl p-4 w-56 text-center shadow-md"
          >
            <div className="text-green-600 dark:text-green-400 text-3xl mb-2">
              {s.icon}
            </div>

            <p className="font-semibold text-green-700 dark:text-green-300 text-sm mb-1">
              {s.title}
            </p>

            <p className="text-xs text-gray-600 dark:text-gray-400">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={prev}
          disabled={stage === 0}
          className={`px-5 py-2 rounded-lg font-medium ${
            stage === 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          ← Previous
        </button>

        <button
          onClick={next}
          disabled={stage === steps.length - 1}
          className={`px-5 py-2 rounded-lg font-medium ${
            stage === steps.length - 1
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Next →
        </button>

        <button
          onClick={reset}
          className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Completion Banner */}
      {stage === steps.length - 1 && (
        <motion.div
          className="mt-6 text-center text-green-700 dark:text-green-300 font-semibold"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          🏆 Congratulations! Your Full-Stack journey is complete — you’re job-ready now.
        </motion.div>
      )}
    </div>
  );
}
