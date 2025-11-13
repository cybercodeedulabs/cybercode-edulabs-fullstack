// src/components/simulations/full-stack/DeploymentPipelineSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, CloudUpload, Globe, Server } from "lucide-react";

export default function DeploymentPipelineSimulator() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: <GitBranch />, label: "Code Pushed to GitHub" },
    { icon: <CloudUpload />, label: "CI/CD Builds on Netlify + Render" },
    { icon: <Server />, label: "Backend Deployed (Render)" },
    { icon: <Globe />, label: "Frontend Live on Netlify 🌐" },
  ];

  const next = () => setStep((s) => (s < steps.length - 1 ? s + 1 : s));
  const reset = () => setStep(0);

  return (
    <div className="p-6 mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-purple-300 dark:border-purple-700 shadow-lg">
      <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4">
        🚀 Deployment Pipeline Visualizer
      </h2>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Watch how your full-stack project moves from code commit to live deployment using Netlify (frontend) and Render (backend).
      </p>

      <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.4, scale: 0.9 }}
            animate={{
              opacity: i === step ? 1 : 0.4,
              scale: i === step ? 1.1 : 0.9,
            }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-900 border border-purple-300 dark:border-purple-700 rounded-xl p-4 w-52 text-center shadow-md"
          >
            <div className="text-purple-600 dark:text-purple-400 text-3xl mb-2">{s.icon}</div>
            <p className="font-semibold text-purple-700 dark:text-purple-300 text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={next}
          disabled={step === steps.length - 1}
          className={`px-5 py-2 rounded-lg font-medium ${
            step === steps.length - 1
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {step === steps.length - 1 ? "Complete ✅" : "Next →"}
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {step === steps.length - 1 && (
        <motion.div
          className="mt-6 text-center text-purple-700 dark:text-purple-300 font-semibold"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          🌎 Your app is now LIVE for the world to see!
        </motion.div>
      )}
    </div>
  );
}
