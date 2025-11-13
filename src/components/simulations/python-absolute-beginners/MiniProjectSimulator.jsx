// src/components/simulations/python-absolute-beginners/MiniProjectSimulator.jsx
import React, { useState } from "react";

export default function MiniProjectSimulator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [op, setOp] = useState("+");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);

    if (isNaN(num1) || isNaN(num2)) {
      setError("❌ Please enter valid numbers");
      setResult(null);
      return;
    }

    setError("");
    let res;
    switch (op) {
      case "+":
        res = num1 + num2;
        break;
      case "-":
        res = num1 - num2;
        break;
      case "*":
        res = num1 * num2;
        break;
      case "/":
        if (num2 === 0) return setError("🚫 Cannot divide by zero");
        res = num1 / num2;
        break;
      default:
        return setError("❌ Invalid operation selected");
    }
    setResult(res);
  };

  return (
    <div className="p-6 mt-8 rounded-2xl border bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 shadow-lg">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
        🧮 Mini Project Playground — Simple Calculator
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        This interactive calculator combines everything you’ve learned:
        <strong> Input, Functions, and Conditionals.</strong>
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          type="number"
          placeholder="Enter first number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <input
          type="number"
          placeholder="Enter second number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-gray-700 dark:text-gray-300">Operation:</label>
        <select
          value={op}
          onChange={(e) => setOp(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value="+">+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
      </div>

      <button
        onClick={calculate}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
      >
        Run ▶
      </button>

      {error && (
        <div className="mt-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded-lg font-mono">
          {error}
        </div>
      )}

      {result !== null && (
        <div className="mt-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-3 rounded-lg font-mono">
          ✅ Result: {result}
        </div>
      )}
    </div>
  );
}
