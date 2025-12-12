// src/main.jsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext";
import { IAMProvider } from "./contexts/IAMContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

/**
 * SANITIZE localStorage user doc
 * - Try to parse localStorage.getItem('user') (or whatever key your UserContext expects).
 * - If parsing fails, remove the key (to avoid crashes) and return null.
 *
 * IMPORTANT: This is conservative — we only delete the offending key when parse fails.
 * If your app uses a different key name for the user (e.g., 'authUser', 'currentUser'),
 * update KEY_NAMES accordingly.
 */
function sanitizeLocalUserStorage() {
  const KEY_NAMES = ["user", "authUser", "currentUser", "iamUser"];
  for (const key of KEY_NAMES) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) continue;

      JSON.parse(raw); // must be valid JSON
    } catch (err) {
      console.error(`[main] Malformed localStorage "${key}" removed.`, err);
      try {
        localStorage.removeItem(key);
      } catch (removeErr) {
        console.error("[main] Failed to remove malformed key:", key, removeErr);
      }
    }
  }
}

/**
 * Install minimal global handlers for visibility during init.
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
 * Mount the React app safely.
 */
function mountApp() {
  const rootEl = document.getElementById("root");
  if (!rootEl) {
    console.error("[main] Unable to find #root element. React app not mounted.");
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

/* ----------------- STARTUP ------------------ */
try {
  if (typeof window !== "undefined" && window.localStorage) {
    sanitizeLocalUserStorage();
    installGlobalErrorHandlers();
  } else {
    console.warn("[main] window or localStorage not available at startup.");
  }

  mountApp();
} catch (startupErr) {
  console.error("[main] Fatal error during app startup:", startupErr);

  try {
    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.innerHTML =
        "<div style='padding:20px;font-family:system-ui,Arial;'><h2>App failed to start</h2><p>Check console for details.</p></div>";
    }
  } catch (e) {}
}
