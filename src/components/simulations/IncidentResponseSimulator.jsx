// src/components/simulations/IncidentResponseSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * IncidentResponseSimulator.jsx
 * Simulates the key stages of incident response:
 * - Detection → Containment → Eradication → Recovery → Lessons Learned
 * Learners can simulate different response speeds and see resulting damage impact.
 */

export default function IncidentResponseSimulator() {
  const stages = ["Detection", "Containment", "Eradication", "Recovery", "Lessons Learned"];
  const [currentStage, setCurrentStage] = useState(null);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [impact, setImpact] = useState(100); // impact score (lower = better)
  const [speed, setSpeed] = useState("medium");

  const addLog = (msg) =>
    setLogs((prev) => [...prev.slice(-12), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const reset = () => {
    setLogs([]);
    setCurrentStage(null);
    setImpact(100);
  };

  const runResponse = async () => {
    reset();
    setRunning(true);
    addLog("🚨 Incident detected — starting response...");

    let impactValue = 100;
    const stageDuration = { fast: 600, medium: 1000, slow: 1600 }[speed];
    const impactDrop = { fast: 20, medium: 10, slow: 5 }[speed];

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(stages[i]);
      addLog(`➡️ Executing phase: ${stages[i]}`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, stageDuration));
      impactValue -= impactDrop;
      setImpact(impactValue);
      addLog(`✅ Completed: ${stages[i]}`);
    }

    addLog("🎉 Incident fully mitigated.");
    setRunning(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
        🧠 Incident Response Lifecycle Simulator
      </h3>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <div>
          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            Response Speed:
          </label>
          <select
            className="ml-2 border rounded-md p-1 text-sm dark:bg-gray-800 dark:text-gray-200"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          >
            <option value="fast">Fast</option>
            <option value="medium">Medium</option>
            <option value="slow">Slow</option>
          </select>
        </div>
        <button
          onClick={runResponse}
          disabled={running}
          className={`px-4 py-2 rounded-md font-semibold ${
            running ? "bg-indigo-400 text-white cursor-wait" : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {running ? "Running..." : "Start Simulation"}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Visualization */}
      <div className="space-y-3 mb-6">
        {stages.map((stage, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: currentStage === stage ? 1 : 0.5,
              x: currentStage === stage ? [0, 10, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-md border ${
              currentStage === stage
                ? "bg-indigo-100 dark:bg-indigo-800 border-indigo-400"
                : "bg-gray-50 dark:bg-gray-800 border-gray-700"
            }`}
          >
            <div className="font-medium text-sm">{stage}</div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mt-2 overflow-hidden">
              <motion.div
                animate={{ width: currentStage === stage ? "100%" : "0%" }}
                transition={{ duration: 0.9 }}
                className="h-full bg-indigo-500"
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Impact meter */}
      <div className="text-center mb-4">
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
          Remaining Impact Level (lower = better)
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <motion.div
            animate={{ width: `${impact}%`, backgroundColor: impact > 60 ? "#ef4444" : impact > 30 ? "#f59e0b" : "#10b981" }}
            transition={{ duration: 0.5 }}
            className="h-full"
          ></motion.div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-3 rounded-md h-40 overflow-auto font-mono text-xs text-gray-700 dark:text-gray-300">
        {logs.length === 0 ? <div className="italic text-gray-400">Simulation logs will appear here...</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
