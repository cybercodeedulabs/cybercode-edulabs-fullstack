// src/components/simulations/python-absolute-beginners/FunctionSimulator.jsx
import React, { useState } from "react";

export default function FunctionSimulator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState("");

  const handleAdd = () => {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    if (isNaN(num1) || isNaN(num2)) {
      setResult("❌ Enter valid numbers");
    } else {
      setResult(`✅ Sum: ${num1 + num2}`);
    }
  };

  return (
    <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 shadow-lg mt-6">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
        🧮 Function Simulator
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Simulates a Python function that adds two numbers.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          placeholder="First number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <input
          type="number"
          placeholder="Second number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
        >
          Run ▶
        </button>
      </div>

      {result && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 font-mono text-indigo-700 dark:text-indigo-300">
          {result}
        </div>
      )}
    </div>
  );
}
