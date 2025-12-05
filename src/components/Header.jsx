// src/components/Header.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/logo.png";
import { Icon } from "@iconify/react";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";

function Header() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { darkMode, setDarkMode } = useTheme();
  const { user, logout, loading, hydrated } = useUser();
  const navigate = useNavigate();

  // 🛡 Prevent header from rendering before hydration (fixes React #311)
  if (loading || !hydrated) {
    return (
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="px-3 py-2 max-w-[1280px] mx-auto">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  // Safe fallbacks
  const displayName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "Learner";

  const displayPhoto =
    user?.photo ||
    user?.picture ||
    "/images/default-avatar.png";

  // Taglines
  const taglines = useMemo(
    () => [
      "India’s First Cloud & EdTech Hybrid",
      "Empowering Skills and Cloud Innovation",
      "Learn. Build. Deploy. All at Cybercode",
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(
      () => setTaglineIndex((prev) => (prev + 1) % taglines.length),
      4000
    );
    return () => clearInterval(interval);
  }, [taglines.length]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = async () => {
    await logout(); // logout already redirects
  };

  const links = useMemo(
    () => [
      { name: "Home", to: "/" },
      { name: "Courses", to: "/courses" },
      { name: "Labs", to: "/labs" },
      { name: "Projects", to: "/projects" },
      { name: "Cloud", to: "/cloud", highlight: true },
      { name: "Demo Class", to: "/demo", demo: true },
      { name: "Contact", to: "/contact" },
    ],
    []
  );

  const navClassFor = (link) => {
    const base = ["transition-all", "font-medium"];
    if (link.highlight)
      return [
        ...base,
        "text-indigo-600",
        "dark:text-indigo-400",
        "font-semibold",
      ].join(" ");
    if (link.demo)
      return [
        ...base,
        "px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl animate-pulse-slow",
      ].join(" ");
    return [
      ...base,
      "text-gray-800 dark:text-gray-200 hover:text-indigo-500",
    ].join(" ");
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      {/* Vision Strip */}
      <div className="bg-indigo-600 text-white text-xs md:text-sm py-1.5 overflow-hidden">
        <p className="animate-marquee font-medium tracking-wide">
          ☁️ Cybercode Cloud — India's Own Developer Cloud • ⚡ EduLabs — Real-Time IT Courses & Labs • 🌐 Learn, Build & Deploy
        </p>
      </div>

      <div className="px-3 py-2 md:px-6 md:py-3 flex justify-between items-center max-w-[1280px] mx-auto">
        {/* Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} className="h-9 md:h-11" />
          <div>
            <div className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              Cybercode Suite
            </div>
            <div className="text-[10px] md:text-xs text-indigo-600 dark:text-indigo-400">
              {taglines[taglineIndex]}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link key={link.name} to={link.to} className={navClassFor(link)}>
              {link.name === "Cloud" ? "☁️ Cloud" : link.name}
            </Link>
          ))}

          {/* Auth */}
          {user ? (
            <div className="flex items-center space-x-3">
              <img
                src={displayPhoto}
                className="w-9 h-9 rounded-full cursor-pointer border hover:scale-105"
                onClick={() => navigate("/dashboard")}
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
              >
                <Icon icon="mdi:logout" width={16} height={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/register"
                className="hover:underline text-gray-700 dark:text-gray-200"
              >
                Register
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 border px-3 py-1.5 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <img src="/images/google.svg" className="w-4 h-4" />
                Sign in
              </Link>
            </div>
          )}

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>

        {/* Mobile Menu Buttons */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
          >
            {menuOpen ? (
              <Icon icon="mdi:close" width={20} height={20} />
            ) : (
              <Icon icon="mdi:menu" width={20} height={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white dark:bg-gray-800 border-t shadow-md ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setTimeout(() => setMenuOpen(false), 150)}
              className={
                link.demo
                  ? "text-lg px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-center animate-pulse-slow"
                  : "text-lg text-gray-800 dark:text-gray-200"
              }
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <div className="flex items-center space-x-3 mt-3">
                <img
                  src={displayPhoto}
                  className="w-8 h-8 rounded-full border"
                />
                <span>{displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md"
              >
                <Icon icon="mdi:logout" width={16} height={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 border px-3 py-1.5 rounded-md"
            >
              <img src="/images/google.svg" className="w-4 h-4" />
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
