// src/components/GoogleLoginButton.jsx
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useUser();
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [loading, setLoading] = useState(false);

  // Safe base64url decode (robust with padding)
  function decodeJwt(token) {
    try {
      if (!token || typeof token !== "string") return {};
      const parts = token.split(".");
      if (parts.length < 2) return {};
      let base64Url = parts[1];
      // replace url chars and add padding if needed
      base64Url = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const pad = base64Url.length % 4 === 0 ? "" : "=".repeat(4 - (base64Url.length % 4));
      const base64 = base64Url + pad;
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("decodeJwt failed:", err);
      return {};
    }
  }

  /** Handle Login — Google Identity Services (redirect mode) */
  const handleLogin = () => {
    if (loading) return;
    if (!CLIENT_ID) {
      alert("Google Sign-In unavailable. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // We rely on the GIS library being loaded (main.jsx ensures this).
      if (!window.google || !window.google.accounts?.id) {
        alert("Google Sign-In library not loaded.");
        setLoading(false);
        return;
      }

      // Save any app-specific redirect target for after login (fallback)
      // e.g., pages set sessionStorage.setItem("redirectAfterLogin", "/some/path")
      // If none set, AuthCallback will default to /dashboard
      // NOTE: We keep this here for continuity — pages can set redirectBeforeLogin.
      // No change needed here if you already set redirectAfterLogin elsewhere.

      // Initialize GIS in redirect mode and use a single callback route (unified).
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        ux_mode: "redirect",
        // IMPORTANT: Use the single canonical callback route in your app
        login_uri: `${window.location.origin}/auth/google/callback`,
        // callback isn't used in redirect mode; passes through URL instead.
      });

      // Prompt (this will redirect in redirect mode)
      window.google.accounts.id.prompt();
    } catch (err) {
      console.error("Google redirect init error:", err);
      alert("Google login failed. Try again.");
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
      <img src="/images/google.svg" className="w-5 h-5" />
      <span className="text-sm md:text-base font-medium">
        {loading ? "Signing in…" : "Sign in with Google"}
      </span>
    </motion.button>
  );
}
