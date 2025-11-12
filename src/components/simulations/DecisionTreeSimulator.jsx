// src/components/simulations/DecisionTreeSimulator.jsx
import React, { useState } from "react";

/**
 * DecisionTreeSimulator
 * Small interactive ethical decision tree.
 * Learners choose options and receive feedback (ethical/legal).
 */
export default function DecisionTreeSimulator() {
  const scenarios = [
    {
      id: 1,
      title: "You find a company database exposed online.",
      choices: [
        { id: "a", text: "Download the data to inspect later", result: "bad", reason: "Unethical & illegal to copy data." },
        { id: "b", text: "Notify the company and provide reproduction steps", result: "good", reason: "Responsible disclosure." },
        { id: "c", text: "Post on social media to warn others", result: "neutral", reason: "Causes panic; disclose privately first." }
      ]
    },
    {
      id: 2,
      title: "A friend asks you to test their employer's site without permission.",
      choices: [
        { id: "a", text: "Help them — it's just a quick check", result: "bad", reason: "Testing without RoE is illegal." },
        { id: "b", text: "Explain legal risks and refuse", result: "good", reason: "Ethical & professional response." },
        { id: "c", text: "Tell them to give written permission", result: "good", reason: "Permission is required to test." }
      ]
    }
  ];

  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const choose = (choice) => {
    setFeedback(choice);
  };

  const next = () => {
    setFeedback(null);
    setCurrent((s) => Math.min(s + 1, scenarios.length - 1));
  };
  const prev = () => {
    setFeedback(null);
    setCurrent((s) => Math.max(s - 1, 0));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-indigo-700">🧭 Ethical Decision Tree — Practice</h3>
      <div className="mb-3 text-sm text-gray-700">{scenarios[current].title}</div>

      <div className="space-y-2 mb-4">
        {scenarios[current].choices.map((c) => (
          <button
            key={c.id}
            onClick={() => choose(c)}
            className="w-full text-left px-3 py-2 rounded-md border hover:shadow-sm transition flex justify-between items-center bg-gray-50"
          >
            <span>{c.text}</span>
            <span className="text-xs text-gray-500">Choose</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`p-3 rounded-md ${feedback.result === "good" ? "bg-green-50 border border-green-200 text-green-700" : feedback.result === "bad" ? "bg-red-50 border border-red-200 text-red-700" : "bg-yellow-50 border border-yellow-200 text-yellow-700" } mb-4`}>
          <div className="font-semibold">{feedback.result === "good" ? "✅ Ethical" : feedback.result === "bad" ? "❌ Not Ethical" : "⚠️ Mixed"}</div>
          <div className="text-sm mt-1">{feedback.reason}</div>
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={prev} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200">← Prev</button>
        <div className="space-x-2">
          <button onClick={() => { setFeedback(null); setCurrent(0); }} className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-700">Restart</button>
          <button onClick={next} className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Next →</button>
        </div>
      </div>
    </div>
  );
}
