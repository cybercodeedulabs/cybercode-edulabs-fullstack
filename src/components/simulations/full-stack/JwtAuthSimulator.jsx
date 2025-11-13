// src/components/simulations/full-stack/JwtAuthSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Lock, Server, ShieldCheck } from "lucide-react";

export default function JwtAuthSimulator() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "1️⃣ User Logs In", desc: "User enters username and password in the frontend login form." },
    { title: "2️⃣ Server Verifies Credentials", desc: "Backend checks if username and password are correct using bcrypt." },
    { title: "3️⃣ JWT Token Generated", desc: "Server creates a signed JSON Web Token containing user info." },
    { title: "4️⃣ Token Sent to Frontend", desc: "Frontend stores JWT in localStorage or cookies." },
    { title: "5️⃣ Token Used in API Calls", desc: "Frontend sends token in Authorization header for protected routes." },
    { title: "6️⃣ Server Verifies Token", desc: "Backend validates JWT before allowing access to secured endpoints." },
    { title: "✅ Access Granted!", desc: "Server responds with protected data — user authenticated successfully!" }
  ];

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="p-6 mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-yellow-300 dark:border-yellow-700 shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-4">
        🔐 JWT Authentication Flow Visualizer
      </h2>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
        Step through this simulation to understand how **frontend and backend** securely exchange JWT tokens.
      </p>

      <div className="flex items-center justify-center gap-6 mb-6">
        <motion.div
          animate={{ scale: step === 0 || step === 1 ? 1.1 : 1 }}
          className="bg-white dark:bg-gray-900 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 text-center shadow-md"
        >
          <UserCheck size={40} className="text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <p className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">User (Client)</p>
        </motion.div>

        <motion.div
          animate={{ scale: step >= 2 && step <= 6 ? 1.1 : 1 }}
          className="bg-white dark:bg-gray-900 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 text-center shadow-md"
        >
          <Server size={40} className="text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <p className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">Backend (Server)</p>
        </motion.div>

        {step === 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-900 border border-green-300 dark:border-green-700 rounded-xl p-4 text-center shadow-md"
          >
            <ShieldCheck size={40} className="text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="font-semibold text-green-700 dark:text-green-300 text-sm">Access Granted</p>
          </motion.div>
        )}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6"
      >
        <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
          {steps[step].title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{steps[step].desc}</p>
      </motion.div>

      <div className="flex justify-center gap-4">
        <button
          onClick={prev}
          disabled={step === 0}
          className={`px-5 py-2 rounded-lg font-medium ${
            step === 0 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700 text-white"
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={next}
          disabled={step === steps.length - 1}
          className={`px-5 py-2 rounded-lg font-medium ${
            step === steps.length - 1 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700 text-white"
          }`}
        >
          Next →
        </button>
      </div>

      {step === 6 && (
        <motion.div
          className="mt-6 text-center text-green-700 dark:text-green-300 font-semibold"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          ✅ Authentication Complete — Token Verified Successfully!
        </motion.div>
      )}
    </div>
  );
}
