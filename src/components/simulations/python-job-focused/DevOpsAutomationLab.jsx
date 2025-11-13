// src/components/simulations/python-job-focused/DevOpsAutomationLab.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Simulates simple DevOps user-management automation.
 * Client-side only; demonstrates commands & output.
 */
export default function DevOpsAutomationLab() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  const add = (m) => setLogs((l) => [...l.slice(-30), `[${new Date().toLocaleTimeString()}] ${m}`]);

  const simulateCreate = async (username) => {
    setRunning(true);
    add(`Running: sudo useradd ${username}`);
    await sleep(600);
    add(`✅ User ${username} created.`);
    await sleep(300);
    add(`Adding ${username} to 'developers' group...`);
    await sleep(400);
    add(`✅ ${username} added to developers group.`);
    setRunning(false);
  };

  const simulateDelete = async (username) => {
    setRunning(true);
    add(`Running: sudo userdel ${username}`);
    await sleep(600);
    add(`✅ User ${username} deleted (simulated).`);
    setRunning(false);
  };

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">🛠️ DevOps Automation Lab (Sim)</h4>

      <div className="flex gap-2 mb-4">
        <input id="user-name" placeholder="username" className="flex-1 p-2 border rounded" />
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => simulateCreate(document.getElementById("user-name").value)} disabled={running} className="px-4 py-2 bg-green-600 text-white rounded">
          Create
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => simulateDelete(document.getElementById("user-name").value)} disabled={running} className="px-4 py-2 bg-red-600 text-white rounded">
          Delete
        </motion.button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded h-48 overflow-auto font-mono text-sm">
        {logs.length === 0 ? <div className="italic text-gray-400">No operations yet.</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
