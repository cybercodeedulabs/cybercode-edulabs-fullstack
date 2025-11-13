// src/components/simulations/python-job-focused/FileAutomationLab.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Simulates a simple log rotation automation.
 * Safe, client-side only — shows step-by-step output.
 */
export default function FileAutomationLab() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  const add = (msg) => setLogs((l) => [...l.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const run = async () => {
    setLogs([]);
    setRunning(true);
    add("Starting log rotation simulation...");
    await sleep(700);
    add("Scanning /var/log/app for *.log files...");
    await sleep(800);
    add("Found: access.log, app.log, debug.log");
    await sleep(700);
    add("Creating archive folder: /archives/2025-11-12/");
    await sleep(600);
    add("Rotating access.log → access_2025-11-12.log");
    await sleep(500);
    add("Compressing rotated files (simulated)...");
    await sleep(800);
    add("Removing logs older than 30 days (simulated)...");
    await sleep(700);
    add("Updating symlink latest → access_2025-11-12.log");
    await sleep(500);
    add("✅ Log rotation completed successfully.");
    setRunning(false);
  };

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">🧰 File Automation Lab — Log Rotation</h4>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={run}
          disabled={running}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            running ? "bg-indigo-400 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {running ? "Running..." : "Run Simulation"}
        </motion.button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md h-48 overflow-auto font-mono text-sm text-gray-700 dark:text-gray-200">
        {logs.length === 0 ? <div className="italic text-gray-400">No activity yet. Click Run to simulate.</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
