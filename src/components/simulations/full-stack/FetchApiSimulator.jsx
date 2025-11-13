// src/components/simulations/full-stack/FetchApiSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Laptop, Server, Database } from "lucide-react";

export default function FetchApiSimulator() {
  const [status, setStatus] = useState("idle");

  const simulateFetch = async () => {
    setStatus("request");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("processing");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("response");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("idle");
  };

  return (
    <div className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-blue-300 dark:border-blue-700 shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
        🌐 React ↔ Express API Flow
      </h2>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
        This simulator demonstrates how your frontend (React) communicates with the backend (Express) to fetch or send data.
      </p>

      <div className="flex items-center justify-center gap-6 mb-8">
        <motion.div
          animate={{ scale: status === "request" ? 1.1 : 1 }}
          className="bg-white dark:bg-gray-900 border border-indigo-300 dark:border-indigo-700 rounded-xl p-4 text-center shadow-md"
        >
          <Laptop size={40} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">Frontend (React)</p>
        </motion.div>

        <motion.div
          animate={{ scale: status === "processing" ? 1.1 : 1 }}
          className="bg-white dark:bg-gray-900 border border-indigo-300 dark:border-indigo-700 rounded-xl p-4 text-center shadow-md"
        >
          <Server size={40} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">Backend (Express)</p>
        </motion.div>

        <motion.div
          animate={{ scale: status === "response" ? 1.1 : 1 }}
          className="bg-white dark:bg-gray-900 border border-indigo-300 dark:border-indigo-700 rounded-xl p-4 text-center shadow-md"
        >
          <Database size={40} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">Database (MongoDB)</p>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={simulateFetch}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md"
        >
          🔄 Simulate API Request
        </button>
      </div>

      <motion.div
        className="mt-6 text-center text-indigo-700 dark:text-indigo-300 font-mono text-sm"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {status === "idle"
          ? "Ready to simulate an API call."
          : status === "request"
          ? "📡 Sending request from React..."
          : status === "processing"
          ? "⚙️ Express processing data..."
          : "✅ Response received! UI updated."}
      </motion.div>
    </div>
  );
}
