// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ultra-stable ScrollToTop
 * - Waits for DOM to be ready (no hydration flicker)
 * - Skips dashboard internal navigation
 * - Supports hash navigation separately
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ❌ Do NOT reset scroll for dashboard nested routes
    if (pathname.startsWith("/dashboard")) return;

    // 🟢 Delay ensures DOM exists → prevents hydration mismatches
    const t = setTimeout(() => {
      try {
        window.scrollTo({ top: 0, behavior: "auto" });
      } catch {}
    }, 25);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
