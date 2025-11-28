// src/components/DashboardLayout.jsx
import React, { memo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
// TopBar removed to avoid duplicate global header in dashboard pages.
// We'll provide a compact dashboard-specific header inside layout.

import { useUser } from "../contexts/UserContext";
import { ArrowLeft } from "lucide-react";

const DashboardLayout = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="cloud-console flex min-h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Compact internal dashboard header (keeps the visual separation
            but avoids repeating the global Header which is hidden on /dashboard) */}
        <header className="bg-slate-800 dark:bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              title="Back to public site"
              className="text-slate-200 hover:text-white rounded p-1"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="text-sm font-semibold">
              C3 Cloud Console <span className="text-slate-400 text-xs ml-2">powered by Cybercode EduLabs</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-300">Signed in as <span className="text-white ml-2 font-medium">{user?.name?.split(" ")[0] || "Learner"}</span></div>
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
