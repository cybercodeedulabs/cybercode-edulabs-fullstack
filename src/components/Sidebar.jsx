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
  User,
} from "lucide-react";
import { useUser } from "../contexts/UserContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const learningMenu = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "My Roadmap", path: "/dashboard/roadmap", icon: <Map size={18} /> },
    // The below two will be handled specially to scroll to sections inside dashboard:
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
    // if item has an anchor, we try to scroll inside dashboard
    if (item.anchor) {
      if (location.pathname.startsWith("/dashboard")) {
        // dispatch custom event to dashboard to scroll
        window.dispatchEvent(new CustomEvent("dashboard-scroll-to", { detail: { target: item.anchor } }));
      } else {
        // navigate to dashboard first, then scroll after small delay
        navigate("/dashboard");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("dashboard-scroll-to", { detail: { target: item.anchor } }));
        }, 250);
      }
      return;
    }

    // otherwise do regular navigation
    navigate(item.path);
  };

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 shadow-xl transition-all duration-300 flex flex-col
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo & collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
          <Cloud size={22} />
          {!collapsed && <span>Cybercode</span>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-300 hover:text-cyan-400 transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* LEARNING SECTION */}
      <div className="mt-3">
        {!collapsed && (
          <p className="text-xs px-4 mb-2 text-slate-400 uppercase tracking-wide">Learning</p>
        )}
        <nav className="px-2 space-y-1">
          {learningMenu.map((item) => {
            const isSpecialAnchor = !!item.anchor;
            if (isSpecialAnchor) {
              return (
                <button
                  key={item.name}
                  onClick={() => handleNav(item)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${location.pathname === item.path.split("#")[0] && !collapsed ? "bg-slate-700 text-cyan-300" : "text-slate-300 hover:bg-slate-800 hover:text-cyan-200"}`}
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
                  `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive ? "bg-slate-700 text-cyan-300" : "text-slate-300 hover:bg-slate-800 hover:text-cyan-200"}`
                }
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* CLOUD SECTION */}
      <div className="mt-6">
        {!collapsed && (
          <p className="text-xs px-4 mb-2 text-slate-400 uppercase tracking-wide">C3 Cloud</p>
        )}
        <nav className="px-2 space-y-1">
          {cloudMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive ? "bg-slate-700 text-cyan-300" : "text-slate-300 hover:bg-slate-800 hover:text-cyan-200"}`
              }
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* FOOTER / LOGOUT */}
      <div className="mt-auto p-4 border-t border-slate-700 flex flex-col gap-3">
        {!collapsed && (
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <User size={16} className="text-cyan-400" />
            <span>Account</span>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-slate-800 hover:bg-red-700 text-red-300 border border-slate-600 transition"
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
