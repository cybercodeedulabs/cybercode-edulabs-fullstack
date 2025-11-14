import React, { useState } from "react";

/**
 * DecisionTreeSimulator
 * Interactive ethical decision tree with mobile-friendly styling.
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
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">

      <h3 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-indigo-300">
        🧭 Ethical Decision Tree — Practice
      </h3>

      <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">
        {scenarios[current].title}
      </div>

      {/* Choices */}
      <div className="space-y-3 mb-5">
        {scenarios[current].choices.map((c) => (
          <button
            key={c.id}
            onClick={() => choose(c)}
            className="
              w-full flex justify-between items-center 
              px-4 py-3 rounded-md border shadow-sm
              bg-gray-50 dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition
            "
          >
            <span className="font-medium">{c.text}</span>
            <span className="text-xs text-gray-600 dark:text-gray-300">Choose</span>
          </button>
        ))}
      </div>

      {/* Feedback Box */}
      {feedback && (
        <div
          className={`
            p-3 rounded-md mb-4
            ${
              feedback.result === "good"
                ? "bg-green-50 border border-green-300 text-green-700"
                : feedback.result === "bad"
                ? "bg-red-50 border border-red-300 text-red-700"
                : "bg-yellow-50 border border-yellow-300 text-yellow-700"
            }
          `}
        >
          <div className="font-semibold">
            {feedback.result === "good"
              ? "✅ Ethical"
              : feedback.result === "bad"
              ? "❌ Not Ethical"
              : "⚠️ Mixed"}
          </div>
          <div className="text-sm mt-1">{feedback.reason}</div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={prev}
          className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          ← Prev
        </button>

        <div className="space-x-2">
          <button
            onClick={() => {
              setFeedback(null);
              setCurrent(0);
            }}
            className="px-4 py-2 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
          >
            Restart
          </button>

          <button
            onClick={next}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
