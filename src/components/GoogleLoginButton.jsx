// src/components/GoogleLoginButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

 const handleLogin = () => {
  if (!window.google || !CLIENT_ID) {
    alert("Google Sign-In unavailable. Please try again.");
    return;
  }

  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (response) => {
      try {
        const userData = decodeJwt(response.credential);

        const userObj = {
          name: userData.name,
          email: userData.email,
          photo: userData.picture,
          uid: `google-${userData.sub}`,
        };

        // Save session user
        localStorage.setItem("cybercodeUser", JSON.stringify(userObj));
        setUser(userObj);

        // 🔥 ENSURE FULL INITIAL cc_userdoc_<uid>
        const docKey = `cc_userdoc_${userObj.uid}`;
        const existing = JSON.parse(localStorage.getItem(docKey) || "null");

        const normalized = {
          enrolledCourses: existing?.enrolledCourses || [],
          projects: existing?.projects || [],
          isPremium: existing?.isPremium || false,
          hasCertificationAccess: existing?.hasCertificationAccess || false,
          hasServerAccess: existing?.hasServerAccess || false,
          courseProgress: existing?.courseProgress || {},
          userStats: existing?.userStats || {
            totalMinutes: 0,
            daily: {},
            streakDays: 0,
            longestStreak: 0,
            lastStudyDate: "",
          },
          generatedProjects: existing?.generatedProjects || [],
          updatedAt: Date.now(),
        };

        localStorage.setItem(docKey, JSON.stringify(normalized));

        // Redirect back
        const redirect =
          sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
        sessionStorage.removeItem("redirectAfterLogin");

        navigate(redirect);
      } catch (err) {
        console.error("Login error:", err);
        alert("Login failed. Try again.");
      }
    },
  });

  window.google.accounts.id.prompt();
};


  // Decode JWT returned by Google
  function decodeJwt(token) {
    return JSON.parse(atob(token.split(".")[1]));
  }

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
