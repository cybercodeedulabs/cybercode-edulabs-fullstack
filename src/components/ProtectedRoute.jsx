// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/**
 * Ultra-stable ProtectedRoute
 * - Waits for full hydration + loading
 * - Allows access if user exists and has a stable identity field (email)
 * - Writes redirect path precisely (pathname + search)
 * - Never causes redirect loops
 */
export default function ProtectedRoute({ children }) {
  const { user, loading, hydrated } = useUser();
  const location = useLocation();

  // 🟡 1. Still hydrating or loading
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

  // 🔴 2. Hydration complete → no authenticated user
  // Our stable identity requirement: email must exist
  if (!user || !user.email) {
    sessionStorage.setItem(
      "redirectAfterLogin",
      location.pathname + location.search
    );
    return <Navigate to="/register" replace />;
  }

  // 🟢 3. Safe to render protected content
  return children;
}
