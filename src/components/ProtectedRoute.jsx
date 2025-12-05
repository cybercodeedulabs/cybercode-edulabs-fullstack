// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/**
 * Fully safe ProtectedRoute
 * - Waits for BOTH loading + hydration
 * - Never mounts children until user.uid exists
 */
export default function ProtectedRoute({ children }) {
  const { user, loading, hydrated } = useUser();
  const location = useLocation();

  // 🚧 1. Still hydrating OR loading user from localStorage
  if (loading || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <div className="text-center space-y-2">
          <div className="text-2xl font-semibold">Checking access...</div>
          <div className="text-sm text-gray-500">Please wait…</div>
        </div>
      </div>
    );
  }

  // ❌ 2. User hydration completed → user is still null → redirect to login
  if (!user || !user.uid) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/register" replace />;
  }

  // ✅ 3. Safe to render protected content
  return children;
}
