// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/**
 * Enterprise-grade ProtectedRoute
 * - Avoids redirect loops
 * - Supports token-first OAuth hydration
 * - Waits for user profile fully before rejecting access
 * - Works perfectly with /auth-success redirect flow
 */
export default function ProtectedRoute({ children }) {
  const { user, token, loading, hydrated } = useUser();
  const location = useLocation();

  // 🟡 1. Still hydrating OR still loading the user profile
  if (loading || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <div className="text-center space-y-2">
          <div className="text-2xl font-semibold">Checking access…</div>
          <div className="text-sm text-gray-500">Please wait…</div>
        </div>
      </div>
    );
  }

  // 🟡 2. Token exists but user not fully loaded yet (OAuth redirect)
  if (token && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-200">
        <div className="text-center space-y-2">
          <div className="text-xl font-semibold">Loading your profile…</div>
        </div>
      </div>
    );
  }

  // 🔴 3. No token and no user → not authenticated
  if (!user || !user.email) {
    sessionStorage.setItem(
      "redirectAfterLogin",
      location.pathname + location.search
    );
    return <Navigate to="/register" replace />;
  }

  // 🟢 4. Authenticated → allow page
  return children;
}
