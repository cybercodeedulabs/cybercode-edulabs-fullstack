// src/components/simulations/python-absolute-beginners/ConditionSimulator.jsx
import React, { useState } from "react";

export default function ConditionSimulator() {
  const [age, setAge] = useState("");
  const [result, setResult] = useState("");

  const checkAge = () => {
    const num = parseInt(age);
    if (isNaN(num)) return setResult("❌ Please enter a valid number");
    if (num >= 18) setResult("✅ You are eligible to vote!");
    else setResult("🚫 You are not eligible yet.");
  };

  return (
    <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 shadow-lg mt-6">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
        ⚖️ Condition Check Simulator
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Enter your age to simulate an <code>if-else</code> condition.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          placeholder="Enter your age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <button
          onClick={checkAge}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
        >
          Check ▶
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
