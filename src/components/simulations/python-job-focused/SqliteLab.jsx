// src/components/simulations/python-job-focused/SqliteLab.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Simulates simple SQLite operations in the browser (not real DB).
 * Shows insert/query steps and outputs.
 */
export default function SqliteLab() {
  const [running, setRunning] = useState(false);
  const [rows, setRows] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (m) => setLogs((s) => [...s.slice(-20), `[${new Date().toLocaleTimeString()}] ${m}`]);

  const run = async () => {
    setRunning(true);
    setRows([]);
    setLogs([]);
    addLog("Initializing in-memory SQLite (simulated)...");
    await sleep(500);
    addLog("Creating table users(id INTEGER, name TEXT, email TEXT)...");
    await sleep(600);
    addLog("Inserting sample rows...");
    await sleep(600);
    const sample = [
      { id: 1, name: "alice", email: "alice@example.com" },
      { id: 2, name: "bob", email: "bob@example.com" },
      { id: 3, name: "charlie", email: "charlie@example.com" },
    ];
    setRows(sample);
    addLog("3 rows inserted.");
    await sleep(400);
    addLog("Running SELECT * FROM users WHERE id <= 2;");
    await sleep(500);
    addLog("Query returned 2 rows.");
    setRunning(false);
  };

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">🗄️ SQLite Lab (Simulated)</h4>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={run}
          disabled={running}
          className={`px-4 py-2 rounded-md text-sm font-medium ${running ? "bg-indigo-400 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
        >
          {running ? "Simulating..." : "Run DB Simulation"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded h-40 overflow-auto font-mono text-sm">
          <div className="text-xs text-gray-500 mb-2">Activity</div>
          {logs.length === 0 ? <div className="italic text-gray-400">No actions yet.</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded h-40 overflow-auto text-sm">
          <div className="text-xs text-gray-500 mb-2">Query Results</div>
          {rows.length === 0 ? (
            <div className="italic text-gray-400">No results yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="py-1">{r.id}</td>
                    <td className="py-1">{r.name}</td>
                    <td className="py-1">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
