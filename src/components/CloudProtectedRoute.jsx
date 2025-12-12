// src/components/CloudProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIAM } from "../contexts/IAMContext";

/**
 * CloudProtectedRoute
 * - Waits for IAM hydration (token → user)
 * - Prevents redirect loops
 * - Redirects safely to /cloud/login with return URL
 */
export default function CloudProtectedRoute({ children }) {
  const { iamUser, loading, hydrated } = useIAM();
  const location = useLocation();

  /** 1) Still verifying token → Show loader */
  if (loading || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        <div className="text-center">
          <div className="text-xl font-semibold">Checking Cloud Access…</div>
          <div className="text-sm opacity-70 mt-1">Please wait</div>
        </div>
      </div>
    );
  }

  /** 2) Prevent redirect loop */
  if (location.pathname.startsWith("/cloud/login")) {
    return children;
  }

  /** 3) Not authenticated → Redirect to Cloud Login */
  if (!iamUser) {
    return (
      <Navigate
        to="/cloud/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  /** 4) Authenticated → Allow access */
  return children;
}
