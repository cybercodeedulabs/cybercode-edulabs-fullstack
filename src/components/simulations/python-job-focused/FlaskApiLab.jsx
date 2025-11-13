// src/components/simulations/python-job-focused/FlaskApiLab.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Simulated Flask API playground: 'start' server and make sample requests.
 * Client-side only; no server launched.
 */
export default function FlaskApiLab() {
  const [running, setRunning] = useState(false);
  const [serverStatus, setServerStatus] = useState("stopped");
  const [logs, setLogs] = useState([]);

  const add = (m) => setLogs((l) => [...l.slice(-30), `[${new Date().toLocaleTimeString()}] ${m}`]);

  const startServer = async () => {
    setRunning(true);
    add("Starting Flask server (simulated)...");
    await sleep(700);
    setServerStatus("running");
    add("✅ Flask API available at http://localhost:5000 (simulated)");
    setRunning(false);
  };

  const stopServer = () => {
    setServerStatus("stopped");
    add("Flask server stopped (simulated).");
  };

  const callEndpoint = async (path) => {
    if (serverStatus !== "running") {
      add("❌ Server is not running. Start the server first.");
      return;
    }
    add(`GET ${path} → sending request (simulated)...`);
    await sleep(500);
    // simple simulated responses
    const responses = {
      "/status": { status: "running", message: "Flask API active" },
      "/health": { status: "ok", uptime: "120s" },
    };
    const res = responses[path] || { status: "ok", result: "sample response" };
    add(`200 OK — ${JSON.stringify(res)}`);
  };

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">🌐 Flask API Builder (Simulated)</h4>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} onClick={startServer} disabled={running || serverStatus === "running"} className="px-3 py-1 bg-green-600 text-white rounded">
            Start
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={stopServer} disabled={serverStatus !== "running"} className="px-3 py-1 bg-red-600 text-white rounded">
            Stop
          </motion.button>
        </div>
      </div>

      <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">Server status: <strong className={serverStatus === "running" ? "text-green-700" : "text-red-600"}>{serverStatus}</strong></div>

      <div className="flex gap-2 mb-3">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => callEndpoint("/status")} className="px-3 py-1 bg-indigo-600 text-white rounded">GET /status</motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => callEndpoint("/health")} className="px-3 py-1 bg-indigo-600 text-white rounded">GET /health</motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => callEndpoint("/custom")} className="px-3 py-1 bg-indigo-500 text-white rounded">GET /custom</motion.button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded h-44 overflow-auto font-mono text-sm">
        {logs.length === 0 ? <div className="italic text-gray-400">No server activity yet.</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
