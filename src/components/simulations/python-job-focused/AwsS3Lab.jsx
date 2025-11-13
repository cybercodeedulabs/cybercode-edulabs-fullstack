// src/components/simulations/python-job-focused/AwsS3Lab.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Simulates an AWS S3 Explorer (read-only, client-side).
 * No real AWS calls — purely illustrative for learners.
 */
export default function AwsS3Lab() {
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [buckets, setBuckets] = useState([]);

  const simulate = async () => {
    setRunning(true);
    setStatus("Connecting to AWS (simulated)...");
    setBuckets([]);
    await sleep(700);
    setStatus("Authenticating (simulated)...");
    await sleep(600);
    setStatus("Listing buckets...");
    await sleep(800);
    const found = ["cybercode-lab-logs", "python-training-data", "student-uploads"];
    setBuckets(found);
    setStatus(`✅ ${found.length} buckets found.`);
    setRunning(false);
  };

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">☁️ AWS S3 Explorer (Simulated)</h4>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={simulate}
          disabled={running}
          className={`px-4 py-2 rounded-md text-sm font-medium ${running ? "bg-indigo-400 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
        >
          {running ? "Working..." : "Simulate S3 List"}
        </motion.button>
      </div>

      <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">{status || "Ready. Click to simulate connecting and listing buckets."}</div>

        <div className="space-y-2">
          {buckets.length === 0 ? (
            <div className="italic text-gray-400">No buckets listed yet.</div>
          ) : (
            buckets.map((b) => (
              <div key={b} className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded px-3 py-2">
                <div className="font-medium text-sm text-indigo-700">{b}</div>
                <div className="text-xs text-gray-500">Simulated — view objects</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
