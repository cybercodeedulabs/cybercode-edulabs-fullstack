// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/logo.png";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";

function Header() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🌙 Global theme
  const { darkMode, setDarkMode } = useTheme();

  const { user, logout } = useUser();
  const navigate = useNavigate();

  const taglines = [
    "India’s First Cloud & EdTech Hybrid",
    "Empowering Skills and Cloud Innovation",
    "Learn. Build. Deploy. All at Cybercode",
  ];

  // Rotate tagline
  useEffect(() => {
    const interval = setInterval(
      () => setTaglineIndex((prev) => (prev + 1) % taglines.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const links = [
    { name: "Home", to: "/" },
    { name: "Courses", to: "/courses" },
    { name: "Labs", to: "/labs" },
    { name: "Projects", to: "/projects" },
    { name: "Cloud", to: "/cloud", highlight: true },
    { name: "Demo Class", to: "/demo", demo: true },
    { name: "Contact", to: "/contact" },
  ];

  // helper to compute nav class without complex template literals inside JSX
  const navClassFor = (link) => {
    const parts = ["transition-all", "font-medium"];
    if (link.highlight) {
      parts.push("text-indigo-600", "dark:text-indigo-400", "font-semibold");
    }
    if (link.demo) {
      parts.push(
        "px-4",
        "py-1.5",
        "bg-green-600",
        "hover:bg-green-700",
        "text-white",
        "rounded-full",
        "shadow-xl",
        "animate-pulse-slow"
      );
    } else {
      parts.push("text-gray-800", "dark:text-gray-200", "hover:text-indigo-500");
    }
    return parts.join(" ");
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      {/* VISION STRIP */}
      <div className="bg-indigo-600 text-white text-xs md:text-sm py-1.5 overflow-hidden">
        <p className="animate-marquee font-medium tracking-wide">
          ☁️ Cybercode Cloud — India's Own Developer Cloud • ⚡ EduLabs —
          Real-Time IT Courses & Labs • 🌐 Learn, Build & Deploy
        </p>
      </div>

      {/* MAIN HEADER */}
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
          {links.map((link) => {
            // Do not return fragments inside JSX attribute — handle Demo label rendering here
            if (link.demo) {
              return (
                <Link key={link.name} to={link.to} className={navClassFor(link)}>
                  <span className="flex items-center gap-2">
                    <span>Demo Class</span>
                    <span className="bg-white text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                      FREE
                    </span>
                  </span>
                </Link>
              );
            }

            return (
              <Link key={link.name} to={link.to} className={navClassFor(link)}>
                {link.name === "Cloud" ? "☁️ Cloud" : link.name}
              </Link>
            );
          })}

          {/* Auth */}
          {user ? (
            <div className="flex items-center space-x-3">
              <img
                src={user.photo}
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
              <Link to="/register" className="hover:underline text-gray-700 dark:text-gray-200">
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

        {/* MOBILE NAVBAR BUTTONS */}
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

      {/* MOBILE MENU */}
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
                <img src={user.photo} className="w-8 h-8 rounded-full border" />
                <span>{user.name}</span>
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
