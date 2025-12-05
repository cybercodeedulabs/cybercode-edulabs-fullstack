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
 * - Try to parse localStorage.getItem('user') (or whatever key your UserContext expects).
 * - If parsing fails, remove the key (to avoid crashes) and return null.
 *
 * IMPORTANT: This is conservative — we only delete the offending key when parse fails.
 * If your app uses a different key name for the user (e.g., 'authUser', 'currentUser'), update KEY_NAMES accordingly.
 */
function sanitizeLocalUserStorage() {
  const KEY_NAMES = ["user", "authUser", "currentUser"]; // include likely keys; harmless to check all
  for (const key of KEY_NAMES) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) continue;
      // quick sanity check: it should be JSON. We'll try parse.
      JSON.parse(raw);
      // if parse succeeded, assume okay
    } catch (err) {
      // malformed JSON — remove it to prevent crash on next app init
      console.error(`[main] Malformed localStorage "${key}" removed to prevent mount crash.`, err);
      try {
        localStorage.removeItem(key);
      } catch (removeErr) {
        console.error("[main] Failed to remove malformed localStorage key:", key, removeErr);
      }
    }
  }
}

/**
 * Install minimal global handlers for visibility during init.
 * These handlers do not swallow all errors — they log and allow ErrorBoundary to still handle render-time UI errors.
 */
function installGlobalErrorHandlers() {
  window.addEventListener("unhandledrejection", (ev) => {
    // At least log unhandled promise rejections so we can trace broken async init logic.
    console.error("[main] Unhandled Promise rejection:", ev.reason);
  });

  window.addEventListener("error", (ev) => {
    // This captures uncaught errors not handled by React error boundaries.
    // Don't preventDefault — we only log to aid debugging; ErrorBoundary will catch render errors.
    console.error("[main] Uncaught error event:", ev.error ?? ev.message, ev);
  });
}

/**
 * Mount the React app safely.
 * - Guard root element presence
 * - Wrap with ErrorBoundary -> StrictMode -> Providers -> App
 */
function mountApp() {
  const rootEl = document.getElementById("root");
  if (!rootEl) {
    // In unusual cases (wrong index.html, server-render mismatch) the 'root' element may be missing.
    // Fail gracefully and log a clear message so the problem can be remedied.
    console.error("[main] Unable to find #root element. React app not mounted.");
    return;
  }

  // If you later need SSR/hydration toggle here: check for server-rendered content then use hydrateRoot.
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
  // 1) clean up any obviously broken localStorage entries that would cause JSON.parse errors
  if (typeof window !== "undefined" && window.localStorage) {
    sanitizeLocalUserStorage();
    installGlobalErrorHandlers();
  } else {
    console.warn("[main] window or localStorage not available at startup (non-browser env?)");
  }

  // 2) mount app
  mountApp();
} catch (startupErr) {
  // Final catch-all to prevent a silent abort. Log with full stack.
  // This should be extremely rare because we sanitise and guard above.
  console.error("[main] Fatal error during app startup:", startupErr);
  // Optionally: show a minimal DOM fallback to inform user (unobtrusive).
  try {
    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.innerHTML =
        "<div style='padding:20px;font-family:system-ui,Arial;'><h2>App failed to start</h2><p>Check console for details.</p></div>";
    }
  } catch (e) {
    /* ignore */
  }
}
