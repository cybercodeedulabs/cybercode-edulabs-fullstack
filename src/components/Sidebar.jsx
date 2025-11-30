// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Server,
  FolderKanban,
  Cloud,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { useUser } from "../contexts/UserContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const learningMenu = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "My Roadmap", path: "/dashboard/roadmap", icon: <Map size={18} /> },
    { name: "My Courses", path: "/dashboard#courses", icon: <BookOpen size={18} />, anchor: "courses" },
    { name: "My Projects", path: "/dashboard#projects", icon: <FolderKanban size={18} />, anchor: "projects" },
  ];

  const cloudMenu = [
    { name: "Cloud Console", path: "/cloud", icon: <Cloud size={18} /> },
    { name: "Instances", path: "/dashboard/instances", icon: <Server size={18} /> },
    { name: "Users", path: "/dashboard/users", icon: <Users size={18} /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  const handleNav = (item) => {
    if (item.anchor) {
      if (location.pathname.startsWith("/dashboard")) {
        window.dispatchEvent(new CustomEvent("dashboard-scroll-to", { detail: { target: item.anchor } }));
      } else {
        navigate("/dashboard");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("dashboard-scroll-to", { detail: { target: item.anchor } }));
        }, 300);
      }
      return;
    }

    navigate(item.path);
  };

  return (
    <aside
      className={`h-screen bg-[#0f172a] border-r border-slate-700 text-slate-200 
      transition-all duration-300 flex flex-col shadow-xl
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo + Collapse */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
          <Cloud size={22} />
          {!collapsed && <span>Cybercode</span>}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-cyan-400 transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <img
            src={user?.photo || "/images/default-avatar.png"}
            className="w-10 h-10 rounded-full border border-cyan-400 object-cover"
          />
          <div>
            <p className="font-semibold">{user?.name}</p>
            <button
              onClick={() => navigate("/edit-profile")}
              className="text-xs text-cyan-300 hover:underline"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Learning */}
      <div className="mt-4">
        {!collapsed && (
          <p className="text-xs px-4 mb-2 text-slate-400 uppercase tracking-wide">
            Learning
          </p>
        )}

        <nav className="px-2 space-y-1">
          {learningMenu.map((item) => {
            if (item.anchor) {
              return (
                <button
                  key={item.name}
                  onClick={() => handleNav(item)}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm 
                  text-slate-300 hover:bg-slate-800 hover:text-cyan-200 transition"
                >
                  {item.icon}
                  {!collapsed && <span>{item.name}</span>}
                </button>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                  ${isActive ? "bg-slate-800 text-cyan-300" : "text-slate-300 hover:bg-slate-800 hover:text-cyan-200"}`
                }
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Cloud Menu */}
      <div className="mt-6">
        {!collapsed && (
          <p className="text-xs px-4 mb-2 text-slate-400 uppercase tracking-wide">
            C3 Cloud
          </p>
        )}

        <nav className="px-2 space-y-1">
          {cloudMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                ${isActive ? "bg-slate-800 text-cyan-300" : "text-slate-300 hover:bg-slate-800 hover:text-cyan-200"}`
              }
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-auto p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm w-full px-4 py-2 rounded-lg 
          bg-slate-800 hover:bg-red-700 text-red-300 border border-slate-600 transition"
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
