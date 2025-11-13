// src/components/simulations/full-stack/ExpressServerSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Laptop, Server, FileCode, CheckCircle } from "lucide-react";

export default function ExpressServerSimulator() {
  const [stage, setStage] = useState(0);
  const steps = [
    { title: "Client Sends Request", text: "The browser (frontend) sends a GET or POST request to the server." },
    { title: "Express Route Matches", text: "Express checks if a route matches the request path, like app.get('/')." },
    { title: "Middleware Runs", text: "Middleware processes or validates the request (e.g., JSON parsing, authentication)." },
    { title: "Server Responds", text: "Express sends a JSON or HTML response back to the frontend." }
  ];

  const next = () => setStage((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStage((s) => Math.max(s - 1, 0));

  return (
    <div className="p-6 mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-yellow-300 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-4">
        ⚙️ Express Server Request Flow
      </h2>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
        This simulator demonstrates how **Express.js** handles an incoming HTTP request from the client and sends a response back.
      </p>

      <div className="flex items-center justify-center gap-6 mb-8">
        <motion.div
          animate={{ scale: stage === 0 ? 1.1 : 1 }}
          className="bg-white dark:bg-gray-900 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 text-center shadow-md"
        >
          <Laptop size={40} className="text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <p className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">Client (Browser)</p>
        </motion.div>

        <motion.div
          animate={{ scale: stage === 1 || stage === 2 ? 1.1 : 1 }}
          className="bg-white dark:bg-gray-900 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 text-center shadow-md"
        >
          <Server size={40} className="text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <p className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">Server (Express)</p>
        </motion.div>

        <motion.div
          animate={{ scale: stage === 3 ? 1.1 : 1 }}
          className="bg-white dark:bg-gray-900 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 text-center shadow-md"
        >
          <FileCode size={40} className="text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <p className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">Response Sent</p>
        </motion.div>
      </div>

      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6"
      >
        <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
          {steps[stage].title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{steps[stage].text}</p>
      </motion.div>

      <div className="flex justify-center gap-4">
        <button
          onClick={prev}
          disabled={stage === 0}
          className={`px-5 py-2 rounded-lg font-medium ${
            stage === 0 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700 text-white"
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={next}
          disabled={stage === steps.length - 1}
          className={`px-5 py-2 rounded-lg font-medium ${
            stage === steps.length - 1 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700 text-white"
          }`}
        >
          Next →
        </button>
      </div>

      {stage === 3 && (
        <motion.div
          className="mt-6 text-center text-green-700 dark:text-green-300 font-semibold"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          ✅ Response successfully delivered to the frontend!
        </motion.div>
      )}
    </div>
  );
}
