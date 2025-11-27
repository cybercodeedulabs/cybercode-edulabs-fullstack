// src/components/TopBar.jsx
import React from "react";
import { useUser } from "../contexts/UserContext";
import { LogOut, User } from "lucide-react";

const TopBar = () => {
  const { user, logout } = useUser(); // <-- CORRECT: invoke the hook

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-md">
      
      {/* Left Section: Console Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-cyan-400 tracking-wide">
          C3 Cloud Console
        </h1>
        <span className="text-xs text-slate-400 italic">
          powered by Cybercode EduLabs
        </span>
      </div>

      {/* Right Section: IAM User Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <User size={18} className="text-cyan-400" />
          <span className="text-sm">
            {user?.iamUsername || user?.email?.split("@")[0] || "IAM User"}
          </span>
        </div>

        <button
          onClick={logout} // <-- CORRECT
          className="flex items-center gap-1 text-sm bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-600 px-3 py-1.5 rounded-md transition"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
