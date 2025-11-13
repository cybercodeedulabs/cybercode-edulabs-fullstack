// src/components/simulations/python-absolute-beginners/DataTypesSimulator.jsx
import React, { useState } from "react";

export default function DataTypesSimulator() {
  const [value, setValue] = useState("");
  const [type, setType] = useState("");

  const detectType = () => {
    if (value.trim() === "") return setType("❌ No input provided");
    if (!isNaN(value) && value.includes(".")) return setType("float");
    if (!isNaN(value)) return setType("int");
    if (value.toLowerCase() === "true" || value.toLowerCase() === "false")
      return setType("bool");
    return setType("str");
  };

  return (
    <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 shadow-lg mt-6">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
        🧩 Data Type Detector
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Type any value to see what Python would consider its data type.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Try: 100, 99.9, True, hello"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <button
          onClick={detectType}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
        >
          Detect ▶
        </button>
      </div>

      {type && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 font-mono text-indigo-700 dark:text-indigo-300">
          Detected type → <strong>{type}</strong>
        </div>
      )}
    </div>
  );
}
