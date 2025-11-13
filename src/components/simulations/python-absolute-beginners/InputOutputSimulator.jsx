// src/components/simulations/python-absolute-beginners/InputOutputSimulator.jsx
import React, { useState } from "react";

export default function InputOutputSimulator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleRun = () => {
    if (input.trim() === "") {
      setOutput("Please enter something!");
    } else {
      setOutput(`Welcome, ${input}!`);
    }
  };

  return (
    <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 shadow-lg mt-6">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
        🧠 Input/Output Simulator
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Type your name to simulate Python’s <code>input()</code> and{" "}
        <code>print()</code> functions.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Enter your name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <button
          onClick={handleRun}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
        >
          Run ▶
        </button>
      </div>

      {output && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 font-mono text-indigo-700 dark:text-indigo-300">
          {output}
        </div>
      )}
    </div>
  );
}
