// src/pages/Payment.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function Payment() {
  const { user } = useUser();
  const navigate = useNavigate();

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-6">Please login to continue.</p>
        <button
          onClick={() => navigate("/register")}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-20 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">
        Premium Upgrade
      </h1>

      <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
        Premium upgrade will unlock downloadable certificates, cloud labs,
        server access, and exclusive project resources.
      </p>

      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-10">
        <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Online payments will be enabled shortly.  
          For now, certificates can only be unlocked after the admin approves your premium.
        </p>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg transition"
      >
        Go Back to Dashboard
      </button>
    </motion.div>
  );
}
