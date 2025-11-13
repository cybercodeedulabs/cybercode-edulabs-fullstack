// src/components/simulations/ccna/NetworkDeviceQuiz.jsx
import React, { useState } from "react";

const devices = [
  { name: "Router", description: "Connects multiple networks and directs traffic" },
  { name: "Switch", description: "Connects devices within the same LAN" },
  { name: "Firewall", description: "Controls and filters network traffic" },
  { name: "Access Point", description: "Provides Wi-Fi connectivity" }
];

export default function NetworkDeviceQuiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const correctAnswers = {
    Router: "Connects multiple networks and directs traffic",
    Switch: "Connects devices within the same LAN",
    Firewall: "Controls and filters network traffic",
    "Access Point": "Provides Wi-Fi connectivity"
  };

  const handleSelect = (device, desc) => {
    setAnswers((prev) => ({ ...prev, [device]: desc }));
  };

  const checkAnswers = () => setSubmitted(true);

  const getStatus = (device) => {
    if (!submitted) return "";
    return answers[device] === correctAnswers[device] ? "✅ Correct" : "❌ Incorrect";
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-gray-700 p-6 rounded-2xl shadow-md text-sm">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
        🧠 Network Device Identification Quiz
      </h3>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {devices.map((d) => (
          <div
            key={d.name}
            className="p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800"
          >
            <p className="font-semibold mb-2">{d.name}</p>
            <select
              className="w-full p-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              value={answers[d.name] || ""}
              onChange={(e) => handleSelect(d.name, e.target.value)}
            >
              <option value="">Select description...</option>
              {devices.map((opt) => (
                <option key={opt.description} value={opt.description}>
                  {opt.description}
                </option>
              ))}
            </select>
            {submitted && (
              <p
                className={`mt-2 text-xs font-medium ${
                  getStatus(d.name).includes("✅")
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {getStatus(d.name)}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={checkAnswers}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all"
        >
          Check Answers
        </button>
      </div>
    </div>
  );
}
