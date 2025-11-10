// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cloud,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Instances", path: "/dashboard/instances", icon: <Server size={18} /> },
    { name: "Users", path: "/dashboard/users", icon: <Users size={18} /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`h-screen transition-all duration-300 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 shadow-lg ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >
      {/* Logo and toggle */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
          <Cloud size={22} className="text-cyan-400" />
          {!collapsed && <span>C3 Cloud</span>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-300 hover:text-cyan-400 transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-700 text-cyan-300"
                  : "text-slate-300 hover:bg-slate-800 hover:text-cyan-200"
              }`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        {!collapsed && <p>© 2025 Cybercode EduLabs</p>}
      </div>
    </aside>
  );
};

export default Sidebar;
