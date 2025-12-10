// src/components/GoogleLoginButton.jsx
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useUser();
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [loading, setLoading] = useState(false);

  // Safe base64url decode
  function decodeJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
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

  /** Handle Login */
  const handleLogin = () => {
    if (loading) return; // prevent double clicks
    if (!window.google || !CLIENT_ID) {
      alert("Google Sign-In unavailable. Please try again.");
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          setLoading(true);
          try {
            const payload = decodeJwt(response.credential);

            const userData = {
              uid: payload.sub ? `google-${payload.sub}` : `local-${Date.now()}`,
              name: payload.name || "",
              email: payload.email || "",
              photo: payload.picture || "/images/default-avatar.png",

              // (optional) forward original Google token to backend
              googleToken: response.credential
            };

            // 🔥 Send to backend → store user → receive JWT
            await loginWithGoogle(userData);

            // ❌ Register.jsx handles redirect — do NOT redirect here

          } catch (err) {
            console.error("Google login failed:", err);
            alert("Login failed. Try again.");
          } finally {
            setLoading(false);
          }
        },
      });

      window.google.accounts.id.prompt();
    } catch (err) {
      console.error("Google Sign-In initialize error:", err);
      alert("Google Sign-In failed. Try again.");
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
