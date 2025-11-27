// src/pages/GoalSetupWizard.jsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ROLE_OPTIONS = [
  "Cloud Engineer",
  "DevOps Engineer",
  "Security Analyst",
  "Backend Developer",
  "Site Reliability Engineer",
  "Machine Learning Engineer",
];

const LOCAL_KEY = "cybercode_goal_draft_v1";

/** Memoized Preview Component */
const ReviewPreview = React.memo(({ payload }) => {
  return (
    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{JSON.stringify(payload, null, 2)}</pre>
  );
});

export default function GoalSetupWizard() {
  const { user, saveUserGoals } = useUser();
  const navigate = useNavigate();

  // split state: meta and skills (reduces re-renders)
  const [meta, setMeta] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw).meta : {
        currentStatus: "",
        motivation: "",
        targetRole: "",
        salaryExpectation: "",
        hoursPerWeek: 6,
        deadlineMonths: 6,
        learningStyle: "Hands-on Labs",
      };
    } catch {
      return {
        currentStatus: "",
        motivation: "",
        targetRole: "",
        salaryExpectation: "",
        hoursPerWeek: 6,
        deadlineMonths: 6,
        learningStyle: "Hands-on Labs",
      };
    }
  });

  const [skills, setSkills] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw).skills : {
        programming: 30,
        cloud: 30,
        networking: 30,
        cybersecurity: 20,
        softSkills: 50,
      };
    } catch {
      return {
        programming: 30,
        cloud: 30,
        networking: 30,
        cybersecurity: 20,
        softSkills: 50,
      };
    }
  });

  const [step, setStep] = useState(1);
  const maxSteps = 7;

  // autosave draft
  useEffect(() => {
    const draft = { meta, skills };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(draft));
  }, [meta, skills]);

  const updateMeta = useCallback((key, value) => {
    setMeta((m) => ({ ...m, [key]: value }));
  }, []);

  const updateSkill = useCallback((k, v) => {
    setSkills((s) => ({ ...s, [k]: v }));
  }, []);

  const payload = useMemo(() => ({ ...meta, skills }), [meta, skills]);

  const next = () => setStep((s) => Math.min(maxSteps, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!user) return alert("Please login first.");
    try {
      await saveUserGoals(payload);
      localStorage.removeItem(LOCAL_KEY);
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
            <div style={{ width: `${(step / maxSteps) * 100}%` }} className="h-full bg-indigo-600 rounded-full transition-all" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Step {step} of {maxSteps}</p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Who are you today?</h2>
            <div className="flex gap-3">
              {["Student", "Fresher", "Working Professional"].map((opt) => (
                <button key={opt} onClick={() => updateMeta("currentStatus", opt)} className={`px-4 py-2 rounded-lg border ${meta.currentStatus === opt ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-900"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Why do you want to learn?</h2>
            <textarea value={meta.motivation} onChange={(e) => updateMeta("motivation", e.target.value)} rows={4} placeholder="e.g., Switch career, promotion, build products, freelance" className="w-full border rounded p-2" />
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Choose your target role</h2>
            <select value={meta.targetRole} onChange={(e) => updateMeta("targetRole", e.target.value)} className="w-full border rounded p-2">
              <option value="">Select role</option>
              {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="mt-3">
              <input value={meta.salaryExpectation} onChange={(e) => updateMeta("salaryExpectation", e.target.value)} placeholder="Expected salary (optional)" className="w-full border rounded p-2" />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Rate your skills (0-100)</h2>
            {Object.entries(skills).map(([k, v]) => (
              <div key={k} className="mb-3">
                <label className="capitalize text-sm">{k.replace(/([A-Z])/g, " $1")}</label>
                <input type="range" min="0" max="100" value={v} onChange={(e) => updateSkill(k, Number(e.target.value))} className="w-full" />
                <div className="text-xs text-gray-500">{v}%</div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">How many hours per week can you commit?</h2>
            <input type="number" min={1} max={80} value={meta.hoursPerWeek} onChange={(e) => updateMeta("hoursPerWeek", Number(e.target.value))} className="w-32 border rounded p-2" />
            <div className="mt-4">
              <label className="text-sm">Preferred learning style</label>
              <select value={meta.learningStyle} onChange={(e) => updateMeta("learningStyle", e.target.value)} className="w-full border rounded p-2 mt-2">
                <option>Hands-on Labs</option>
                <option>Video + Notes</option>
                <option>Mentor-led Cohort</option>
                <option>Self-paced</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 6 */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Target timeline</h2>
            <div className="flex gap-3">
              {[3, 6, 12].map((m) => (
                <button key={m} onClick={() => updateMeta("deadlineMonths", m)} className={`px-4 py-2 rounded-lg ${meta.deadlineMonths === m ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-900"}`}>{m} months</button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW */}
        {step === 7 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Review & Confirm</h2>
            <ReviewPreview payload={payload} />
          </div>
        )}

        {/* NAV */}
        <div className="mt-6 flex justify-between">
          <button onClick={back} disabled={step === 1} className="px-4 py-2 bg-gray-200 rounded">Back</button>

          {step < maxSteps ? (
            <button onClick={next} className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
          ) : (
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Save Goals</button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
