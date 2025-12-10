// src/main.jsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

/**
 * SANITIZE localStorage user doc
 */
function sanitizeLocalUserStorage() {
  const KEY_NAMES = ["user", "authUser", "currentUser"];
  for (const key of KEY_NAMES) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) continue;
      JSON.parse(raw);
    } catch (err) {
      console.error(`[main] Malformed localStorage "${key}" removed.`, err);
      try {
        localStorage.removeItem(key);
      } catch (removeErr) {
        console.error("[main] Failed to remove key:", key, removeErr);
      }
    }
  }
}

/**
 * Global error handlers
 */
function installGlobalErrorHandlers() {
  window.addEventListener("unhandledrejection", (ev) => {
    console.error("[main] Unhandled Promise rejection:", ev.reason);
  });

  window.addEventListener("error", (ev) => {
    console.error("[main] Uncaught error event:", ev.error ?? ev.message, ev);
  });
}

/**
 * Mount React App
 */
function mountApp() {
  const rootEl = document.getElementById("root");
  if (!rootEl) {
    console.error("[main] Unable to find #root");
    return;
  }

  const root = createRoot(rootEl);

  root.render(
    <ErrorBoundary>
      <StrictMode>
        <UserProvider>
          <App />
        </UserProvider>
      </StrictMode>
    </ErrorBoundary>
  );
}

/* ---------------------------------------------------------
   ✅ ADD THIS — Load Google Identity script BEFORE mounting app
--------------------------------------------------------- */
function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    try {
      // prevent duplicate loads
      if (document.getElementById("google-identity-script")) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-identity-script";

      script.onload = () => {
        console.log("[main] Google Identity Services loaded");
        resolve();
      };

      script.onerror = (err) => {
        console.error("[main] Failed to load Google script", err);
        reject(err);
      };

      document.head.appendChild(script);
    } catch (err) {
      reject(err);
    }
  });
}

/* ----------------- STARTUP ------------------ */
(async () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      sanitizeLocalUserStorage();
      installGlobalErrorHandlers();
    } else {
      console.warn("[main] window/localStorage unavailable");
    }

    // 🔵 Ensure Google OAuth script loads before React app
    await loadGoogleScript();

    // Now mount app
    mountApp();
  } catch (startupErr) {
    console.error("[main] Fatal startup error:", startupErr);

    try {
      const rootEl = document.getElementById("root");
      if (rootEl) {
        rootEl.innerHTML =
          "<div style='padding:20px;font-family:system-ui,Arial;'><h2>App failed to start</h2><p>Check console.</p></div>";
      }
    } catch {}
  }
})();
