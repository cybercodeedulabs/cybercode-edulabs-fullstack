// src/components/simulations/python-absolute-beginners/LoopSimulator.jsx
import React, { useState } from "react";

export default function LoopSimulator() {
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");

  const simulateLoop = () => {
    let logs = "";
    for (let i = 0; i < count; i++) {
      logs += `Iteration ${i + 1}\n`;
    }
    setOutput(logs);
  };

  return (
    <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 shadow-lg mt-6">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
        🔁 Loop Simulator
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Enter how many times you want the loop to run.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          min="1"
          max="20"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <button
          onClick={simulateLoop}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
        >
          Run ▶
        </button>
      </div>

      {output && (
        <pre className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 font-mono text-indigo-700 dark:text-indigo-300 whitespace-pre-wrap">
          {output}
        </pre>
      )}
    </div>
  );
}
