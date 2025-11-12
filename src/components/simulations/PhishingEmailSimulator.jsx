// src/components/simulations/PhishingEmailSimulator.jsx
import React, { useState } from "react";

/**
 * PhishingEmailSimulator
 * Learners review sample emails and decide whether they are Phishing or Legitimate.
 */
export default function PhishingEmailSimulator() {
  const emails = [
    {
      id: 1,
      subject: "Password Expiry Notice – Immediate Action Required",
      from: "it-support@secureupdate.com",
      body: "Your password expires in 12 hours. Click below to reset now.",
      type: "phishing",
    },
    {
      id: 2,
      subject: "Invoice #2231 for your recent purchase",
      from: "billing@trustedvendor.com",
      body: "Your invoice is attached. Thank you for your business.",
      type: "legit",
    },
    {
      id: 3,
      subject: "Unusual sign-in detected on your account",
      from: "security-alert@bankofsafe.com",
      body: "Someone tried to sign in from a new device. Verify immediately.",
      type: "phishing",
    },
    {
      id: 4,
      subject: "Team Meeting Reminder",
      from: "hr@yourcompany.com",
      body: "Meeting scheduled at 3 PM today. Please join on Teams.",
      type: "legit",
    },
  ];

  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const handleChoice = (choice) => {
    const current = emails[index];
    const correct = current.type === choice;
    setFeedback(correct ? "✅ Correct" : "❌ Wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setIndex((i) => (i + 1) % emails.length);
    }, 1400);
  };

  const email = emails[index];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-indigo-700">
        📧 Phishing Email Classifier
      </h3>

      <div className="border rounded-md p-4 bg-gray-50 mb-4">
        <div className="text-sm text-gray-700 mb-1">
          <strong>From:</strong> {email.from}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          <strong>Subject:</strong> {email.subject}
        </div>
        <div className="mt-3 text-gray-600 text-sm">{email.body}</div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => handleChoice("phishing")}
          className="flex-1 px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-red-700 font-medium"
        >
          🚨 Phishing
        </button>
        <button
          onClick={() => handleChoice("legit")}
          className="flex-1 px-4 py-2 rounded bg-green-100 hover:bg-green-200 text-green-700 font-medium"
        >
          ✅ Legitimate
        </button>
      </div>

      {feedback && (
        <div
          className={`text-center font-semibold ${
            feedback.includes("Correct") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 text-center">
        Score: {score} / {emails.length}
      </div>
    </div>
  );
}
