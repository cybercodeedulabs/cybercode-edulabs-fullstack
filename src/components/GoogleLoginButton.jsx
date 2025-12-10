// src/components/GoogleLoginButton.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL; // Backend base URL

  const handleLogin = () => {
    if (loading) return;

    setLoading(true);

    try {
      if (!API) {
        console.error("VITE_API_URL is missing. Cannot proceed with login.");
        alert("Login unavailable. Please try again later.");
        setLoading(false);
        return;
      }

      const redirectUrl = `${API}/auth/google/login`;

      // Validate redirect URL (basic but prevents silent failures)
      try {
        new URL(redirectUrl);
      } catch (urlErr) {
        console.error("Invalid OAuth redirect URL:", redirectUrl, urlErr);
        alert("Login configuration error. Please contact support.");
        setLoading(false);
        return;
      }

      // 🔥 High-standard implementation:
      // Redirect user to backend, which then redirects to Google OAuth.
      window.location.href = redirectUrl;

    } catch (err) {
      console.error("Google OAuth redirect failed:", err);
      alert("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLogin}
      disabled={loading}
      className={`flex items-center justify-center gap-3 px-6 py-3 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                 border border-gray-300 dark:border-gray-700 
                 rounded-xl shadow-md hover:shadow-lg 
                 hover:bg-gray-50 dark:hover:bg-gray-700 
                 transition-all duration-200
                 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.97 }}
    >
      <img src="/images/google.svg" className="w-5 h-5" alt="Google logo" />
      <span className="text-sm md:text-base font-medium">
        {loading ? "Redirecting…" : "Sign in with Google"}
      </span>
    </motion.button>
  );
}
