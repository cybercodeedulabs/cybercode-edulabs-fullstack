// src/components/TopBar.jsx
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Icon } from "@iconify/react";

const TopBar = () => {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between px-6 py-3
      bg-[#0f172a] border-b border-slate-700 shadow-md">

      {/* Title */}
      <div>
        <h1 className="text-lg font-semibold text-cyan-400">C3 Cloud Console</h1>
        <p className="text-xs text-slate-400">powered by Cybercode EduLabs</p>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition"
        >
          <img
            src={user?.photo || "/images/default-avatar.png"}
            className="w-9 h-9 rounded-full border border-cyan-400 object-cover"
          />
          <Icon icon="mdi:chevron-down" width={18} />
        </button>

        {open && (
          <div className="absolute right-0 top-14 w-52 bg-slate-800 border border-slate-700 
            rounded-xl shadow-xl p-2 animate-fadeIn z-50">
            <div className="p-3">
              <p className="font-semibold text-slate-200">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <button
              onClick={() => (window.location.href = "/edit-profile")}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md 
              hover:bg-slate-700 text-slate-300"
            >
              <Icon icon="mdi:account-outline" width={16} /> Edit Profile
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md 
              hover:bg-red-700 text-red-300"
            >
              <Icon icon="mdi:logout" width={16} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
