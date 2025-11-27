// src/pages/GoalSetupWizard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/**
 * Simple multi-step Goal Setup Wizard
 * - Uses local state
 * - Validates basic fields
 * - Saves to Firestore via saveUserGoals from context
 */
const ROLE_OPTIONS = [
  "Cloud Engineer",
  "DevOps Engineer",
  "Security Analyst",
  "Backend Developer",
  "Site Reliability Engineer",
  "Machine Learning Engineer",
];

export default function GoalSetupWizard() {
  const { user, saveUserGoals } = useUser();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState({
    currentStatus: "",
    motivation: "",
    targetRole: "",
    salaryExpectation: "",
    skills: {
      programming: 30,
      cloud: 30,
      networking: 30,
      cybersecurity: 20,
      softSkills: 50,
    },
    hoursPerWeek: 6,
    deadlineMonths: 6,
    learningStyle: "Hands-on Labs",
  });

  const update = (path, value) => {
    if (path.includes(".")) {
      const [k, sub] = path.split(".");
      setPayload((p) => ({ ...p, [k]: { ...(p[k] || {}), [sub]: value } }));
    } else {
      setPayload((p) => ({ ...p, [path]: value }));
    }
  };

  const next = () => setStep((s) => Math.min(7, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!user) return alert("Please login first.");
    try {
      await saveUserGoals(payload);
      // optional: navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Save goals error:", err);
      alert("Failed to save goals.");
    }
  };

  return (
    <motion.section className="max-w-3xl mx-auto px-6 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">Set your Career Goals</h1>
        <p className="text-gray-600 mt-2">This helps us build a personalized roadmap. Takes 1–3 minutes.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow">
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div style={{ width: `${(step / 7) * 100}%` }} className="h-full bg-indigo-600 rounded-full transition-all" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Step {step} of 7</p>
        </div>

        {/* STEP 1: Current Status */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Who are you today?</h2>
            <div className="flex gap-3">
              {["Student", "Fresher", "Working Professional"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => update("currentStatus", opt)}
                  className={`px-4 py-2 rounded-lg border ${payload.currentStatus === opt ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-900"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Motivation */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Why do you want to learn?</h2>
            <textarea
              value={payload.motivation}
              onChange={(e) => update("motivation", e.target.value)}
              rows={4}
              placeholder="e.g., Switch career, promotion, build products, freelance"
              className="w-full border rounded p-2"
            />
          </div>
        )}

        {/* STEP 3: Target Role */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Choose your target role</h2>
            <select value={payload.targetRole} onChange={(e) => update("targetRole", e.target.value)} className="w-full border rounded p-2">
              <option value="">Select role</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <div className="mt-3">
              <input
                value={payload.salaryExpectation}
                onChange={(e) => update("salaryExpectation", e.target.value)}
                placeholder="Expected salary (optional)"
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Self Skill Evaluation */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Rate your skills (0-100)</h2>
            {Object.entries(payload.skills).map(([k, v]) => (
              <div key={k} className="mb-3">
                <label className="capitalize text-sm">{k.replace(/([A-Z])/g, " $1")}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={v}
                  onChange={(e) => update(`skills.${k}`, Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">{v}%</div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 5: Time Commitment */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">How many hours per week can you commit?</h2>
            <input
              type="number"
              min={1}
              max={80}
              value={payload.hoursPerWeek}
              onChange={(e) => update("hoursPerWeek", Number(e.target.value))}
              className="w-32 border rounded p-2"
            />
            <div className="mt-4">
              <label className="text-sm">Preferred learning style</label>
              <select value={payload.learningStyle} onChange={(e) => update("learningStyle", e.target.value)} className="w-full border rounded p-2 mt-2">
                <option>Hands-on Labs</option>
                <option>Video + Notes</option>
                <option>Mentor-led Cohort</option>
                <option>Self-paced</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 6: Timeline */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Target timeline</h2>
            <div className="flex gap-3">
              {[3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => update("deadlineMonths", m)}
                  className={`px-4 py-2 rounded-lg ${payload.deadlineMonths === m ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-900"}`}
                >
                  {m} months
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Review */}
        {step === 7 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Review & Confirm</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{JSON.stringify(payload, null, 2)}</pre>
          </div>
        )}

        {/* NAV */}
        <div className="mt-6 flex justify-between">
          <button onClick={back} disabled={step === 1} className="px-4 py-2 bg-gray-200 rounded">
            Back
          </button>

          {step < 7 ? (
            <button onClick={next} className="px-4 py-2 bg-indigo-600 text-white rounded">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
              Save Goals
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
