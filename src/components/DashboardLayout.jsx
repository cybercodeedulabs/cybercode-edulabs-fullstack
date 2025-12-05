// src/components/DashboardLayout.jsx
import React, { memo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useUser } from "../contexts/UserContext";
import { Icon } from "@iconify/react";

/**
 * Ultra-stable Dashboard Layout
 * - Matches ProtectedRoute logic exactly
 * - Uses user.email (universal identity)
 * - Never renders layout shell before hydration is 100% complete
 */
const DashboardLayout = () => {
  const { user, loading, hydrated } = useUser();
  const navigate = useNavigate();

  // 🟡 Prevent premature dashboard rendering
  if (loading || !hydrated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        <div className="text-center space-y-2">
          <div className="text-xl font-semibold">Loading dashboard…</div>
          <div className="text-sm opacity-70">Please wait…</div>
        </div>
      </div>
    );
  }

  // 🔴 If user is not authenticated → do NOT show dashboard shell
  if (!user || !user.email) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        <div className="text-center space-y-2">
          <div className="text-xl font-semibold">Access denied</div>
          <div className="text-sm opacity-70">Please sign in again.</div>
        </div>
      </div>
    );
  }

  // 🟢 Safe to render full dashboard layout
  return (
    <div className="cloud-console flex min-h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* INTERNAL DASHBOARD HEADER */}
        <header className="bg-slate-800 dark:bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              title="Back to public site"
              className="text-slate-200 hover:text-white rounded p-1"
            >
              <Icon icon="mdi:arrow-left" width={20} />
            </button>

            <div className="text-sm font-semibold">
              C3 Cloud Console{" "}
              <span className="text-slate-400 text-xs ml-2">
                powered by Cybercode EduLabs
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-300">
              Signed in as{" "}
              <span className="text-white ml-2 font-medium">
                {user?.name?.split(" ")[0] || "Learner"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
