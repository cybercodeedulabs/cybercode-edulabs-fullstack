// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Icon } from "@iconify/react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, loading, hydrated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // 🛡 Prevent sidebar from rendering early (prevents hydration mismatches)
  if (loading || !hydrated) {
    return (
      <aside className="w-64 h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center">
        <div className="text-center text-slate-400 text-sm">
          Loading…
        </div>
      </aside>
    );
  }

  // 🔴 If user still not valid → block sidebar entirely
  if (!user || !user.email) {
    return (
      <aside className="w-64 h-screen bg-[#0f172a] text-slate-300 flex items-center justify-center">
        <div className="text-center text-sm opacity-70">
          User not found
        </div>
      </aside>
    );
  }

  const displayName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "Learner";

  const displayPhoto =
    user?.photo ||
    user?.picture ||
    "/images/default-avatar.png";

  const learningMenu = [
    { name: "Home", path: "/", icon: "mdi:home-outline" },
    { name: "Dashboard", path: "/dashboard", icon: "mdi:view-dashboard-outline" },
    { name: "My Roadmap", path: "/dashboard/roadmap", icon: "mdi:map-outline" },
    {
      name: "My Courses",
      path: "/dashboard#courses",
      icon: "mdi:book-open-variant-outline",
      anchor: "courses",
    },
    {
      name: "My Projects",
      path: "/dashboard#projects",
      icon: "mdi:folder-outline",
      anchor: "projects",
    },
  ];

  const cloudMenu = [
    { name: "Cloud Console", path: "/cloud", icon: "mdi:cloud-outline" },
    { name: "Instances", path: "/dashboard/instances", icon: "mdi:server-outline" },
    { name: "Users", path: "/dashboard/users", icon: "mdi:account-multiple-outline" },
    { name: "Settings", path: "/dashboard/settings", icon: "mdi:cog-outline" },
  ];

  const handleNav = (item) => {
    if (item.anchor) {
      if (location.pathname.startsWith("/dashboard")) {
        window.dispatchEvent(
          new CustomEvent("dashboard-scroll-to", {
            detail: { target: item.anchor },
          })
        );
      } else {
        navigate("/dashboard");
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("dashboard-scroll-to", {
              detail: { target: item.anchor },
            })
          );
        }, 350);
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
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
          <Icon icon="mdi:cloud-outline" width={22} />
          {!collapsed && <span>Cybercode</span>}
        </div>

      <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-cyan-400 transition"
        >
          <Icon
            icon={collapsed ? "mdi:chevron-right" : "mdi:chevron-left"}
            width={20}
          />
        </button>
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <img
            src={displayPhoto}
            className="w-10 h-10 rounded-full border border-cyan-400 object-cover"
          />
          <div>
            <p className="font-semibold">{displayName}</p>
            <button
              onClick={() => navigate("/edit-profile")}
              className="text-xs text-cyan-300 hover:underline"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Learning Menu */}
      <div className="mt-4">
        {!collapsed && (
          <p className="text-xs px-4 mb-2 text-slate-400 uppercase tracking-wide">
            Learning
          </p>
        )}

        <nav className="px-2 space-y-1">
          {learningMenu.map((item) =>
            item.anchor ? (
              <button
                key={item.name}
                onClick={() => handleNav(item)}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm 
                  text-slate-300 hover:bg-slate-800 hover:text-cyan-200 transition"
              >
                <Icon icon={item.icon} width={18} />
                {!collapsed && <span>{item.name}</span>}
              </button>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                  ${
                    isActive
                      ? "bg-slate-800 text-cyan-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-cyan-200"
                  }`
                }
              >
                <Icon icon={item.icon} width={18} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            )
          )}
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
                ${
                  isActive
                    ? "bg-slate-800 text-cyan-300"
                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-200"
                }`
              }
            >
              <Icon icon={item.icon} width={18} />
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
          <Icon icon="mdi:logout" width={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
