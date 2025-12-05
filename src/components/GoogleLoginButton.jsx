// src/components/GoogleLoginButton.jsx
import React from "react";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function GoogleLoginButton() {
  const { setUser } = useUser();
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  /** Safe base64url decode */
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
    if (!window.google || !CLIENT_ID) {
      alert("Google Sign-In unavailable. Please try again.");
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => {
          try {
            const userData = decodeJwt(response.credential);

            const userObj = {
              name: userData.name || "",
              email: userData.email || "",
              photo: userData.picture || "/images/default-avatar.png",
              // stable backend id for PostgreSQL
              uid: userData.sub ? `google-${userData.sub}` : `local-${Date.now()}`
            };

            // Save user into localStorage (safe shape)
            window.localStorage.setItem("cybercodeUser", JSON.stringify(userObj));
            setUser(userObj);

            // Build user doc
            const docKey = `cc_userdoc_${userObj.uid}`;
            const existing = JSON.parse(localStorage.getItem(docKey) || "null");

            const normalized = {
              enrolledCourses: Array.isArray(existing?.enrolledCourses)
                ? existing.enrolledCourses
                : [],

              projects: Array.isArray(existing?.projects)
                ? existing.projects
                : [],

              isPremium: Boolean(existing?.isPremium),
              hasCertificationAccess: Boolean(existing?.hasCertificationAccess),
              hasServerAccess: Boolean(existing?.hasServerAccess),

              courseProgress:
                existing?.courseProgress && typeof existing.courseProgress === "object"
                  ? existing.courseProgress
                  : {},

              userStats:
                existing?.userStats && typeof existing.userStats === "object"
                  ? {
                      totalMinutes: existing.userStats.totalMinutes || 0,
                      daily: existing.userStats.daily || {},
                      streakDays: existing.userStats.streakDays || 0,
                      longestStreak: existing.userStats.longestStreak || 0,
                      lastStudyDate: existing.userStats.lastStudyDate || "",
                    }
                  : {
                      totalMinutes: 0,
                      daily: {},
                      streakDays: 0,
                      longestStreak: 0,
                      lastStudyDate: "",
                    },

              generatedProjects: Array.isArray(existing?.generatedProjects)
                ? existing.generatedProjects
                : [],

              updatedAt: Date.now()
            };

            window.localStorage.setItem(docKey, JSON.stringify(normalized));

            // 🚫 Do NOT redirect here → Register.jsx handles redirect AFTER hydration

          } catch (err) {
            console.error("Google login callback failed:", err);
            alert("Login failed. Try again.");
          }
        }
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
      className="flex items-center justify-center gap-3 px-6 py-3 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                 border border-gray-300 dark:border-gray-700 
                 rounded-xl shadow-md hover:shadow-lg 
                 hover:bg-gray-50 dark:hover:bg-gray-700 
                 transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <img src="/images/google.svg" className="w-5 h-5" />
      <span className="text-sm md:text-base font-medium">
        Sign in with Google
      </span>
    </motion.button>
  );
}
