// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/**
 * ProtectedRoute.jsx
 * Guards access to premium routes (like /labs, /enroll, /dashboard)
 * Redirects non-logged-in users to /register (Google sign-in page)
 * and remembers their intended destination using sessionStorage.
 */

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();
  const location = useLocation();

  // Show loading screen while auth state is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        <div className="text-center space-y-2">
          <div className="text-2xl font-semibold">Checking access...</div>
          <div className="text-sm text-gray-500">Please wait a moment.</div>
        </div>
      </div>
    );
  }

  // If user is not logged in — redirect to Google login (Register)
  if (!user) {
    // Remember where the user was trying to go before login
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/register" replace />;
  }

  // If user exists — allow route access
  return children;
}
