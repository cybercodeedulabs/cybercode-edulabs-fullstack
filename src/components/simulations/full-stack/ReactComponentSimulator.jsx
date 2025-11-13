// src/components/simulations/full-stack/ReactComponentSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Square, Repeat, ArrowRight } from "lucide-react";

export default function ReactComponentSimulator() {
  const [name, setName] = useState("Student");
  const [renderCount, setRenderCount] = useState(1);

  const handleChange = (e) => {
    setName(e.target.value);
    setRenderCount((prev) => prev + 1);
  };

  return (
    <div className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-indigo-200 dark:border-gray-700 shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
        ⚛️ React Component Re-render Visualizer
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
        This simulator shows how React updates components when <strong>state</strong> changes.  
        Each time you type in the input, the component re-renders and updates the UI instantly.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Input */}
        <div className="flex flex-col items-center">
          <input
            value={name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-center"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Type to trigger re-render
          </span>
        </div>

        <ArrowRight className="hidden sm:block text-indigo-600 dark:text-indigo-400" size={40} />

        {/* Render Box */}
        <motion.div
          key={name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-indigo-300 dark:border-indigo-700 text-center"
        >
          <Square size={40} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-2" />
          <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
            Hello, {name}! 👋
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Render Count: <strong>{renderCount}</strong>
          </p>
        </motion.div>
      </div>

      <motion.div
        className="mt-6 text-center text-indigo-700 dark:text-indigo-300 font-mono text-sm"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        🔄 React efficiently updates only the changed part of the DOM.
      </motion.div>
    </div>
  );
}
