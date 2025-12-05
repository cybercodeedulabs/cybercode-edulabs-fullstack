// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const safeCanUseLS = () => {
    try {
      if (typeof window === "undefined") return false;
      if (!window.localStorage) return false;
      const testKey = "__cc_theme_test__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  };

  // 🛡 SAFE INITIAL THEME (always light until hydrated)
  const [darkMode, setDarkMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // 🧊 AFTER MOUNT → read actual theme preference
  useEffect(() => {
    try {
      let preferred = false;

      if (safeCanUseLS()) {
        const saved = localStorage.getItem("cybercode_theme");
        if (saved === "dark") preferred = true;
        if (saved === "light") preferred = false;
      } else {
        // fallback to system preference
        preferred = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches || false;
      }

      setDarkMode(preferred);
      setHydrated(true);
    } catch (err) {
      console.warn("Theme hydration error", err);
      setHydrated(true);
    }
  }, []);

  // 🌓 Once hydrated → apply theme class and save to LS
  useEffect(() => {
    if (!hydrated) return;

    const root = document.documentElement;
    try {
      if (darkMode) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      if (safeCanUseLS()) {
        localStorage.setItem("cybercode_theme", darkMode ? "dark" : "light");
      }
    } catch (err) {
      console.warn("Theme apply error", err);
    }
  }, [darkMode, hydrated]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, hydrated }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
