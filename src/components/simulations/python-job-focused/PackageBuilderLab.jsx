// src/components/simulations/python-job-focused/PackageBuilderLab.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Simulates building a Python package and creating a dist artifact.
 * Client-side only; shows steps and simulated output file name.
 */
export default function PackageBuilderLab() {
  const [logs, setLogs] = useState([]);
  const [artifact, setArtifact] = useState(null);
  const [running, setRunning] = useState(false);

  const add = (m) => setLogs((l) => [...l.slice(-30), `[${new Date().toLocaleTimeString()}] ${m}`]);

  const build = async () => {
    setRunning(true);
    setLogs([]);
    setArtifact(null);
    add("Preparing packaging environment...");
    await sleep(600);
    add("Reading setup.py / pyproject.toml...");
    await sleep(600);
    add("Building source distribution and wheel...");
    await sleep(900);
    const name = `mypackage-1.0.0.tar.gz`;
    setArtifact(name);
    add(`✅ Artifact created: dist/${name}`);
    setRunning(false);
  };

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">📦 Package Builder Lab (Simulated)</h4>
        <motion.button whileTap={{ scale: 0.97 }} onClick={build} disabled={running} className={`px-4 py-2 rounded-md ${running ? "bg-indigo-400 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
          {running ? "Building..." : "Build Package"}
        </motion.button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded h-40 overflow-auto font-mono text-sm">
        {logs.length === 0 ? <div className="italic text-gray-400">No activity. Click Build to simulate packaging.</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
        {artifact && <div className="mt-3 font-semibold text-green-700">Download: dist/{artifact} (simulated)</div>}
      </div>
    </div>
  );
}
