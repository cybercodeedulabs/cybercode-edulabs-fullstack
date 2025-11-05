// src/components/Header.jsx
import { Link } from "react-router-dom";
import logo from "/images/logo.png";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function Header({ darkMode, setDarkMode }) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const taglines = [
    "Empowering Future Through Cloud & AI",
    "Building Smarter Infrastructures Together",
    "Innovating Cloud Solutions for Everyone",
  ];

  // Tagline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll detection for sticky shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", to: "/" },
    { name: "Courses", to: "/courses" },
    { name: "Projects", to: "/projects" },
    { name: "Cloud", to: "/cloud", highlight: true },
    { name: "Register", to: "/register" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      {/* Vision Scroller */}
      <div className="bg-indigo-600 text-white text-sm py-2 overflow-hidden">
        <p className="animate-marquee font-medium tracking-wide">
          ☁️ Cloud Vision: Building a unified, intelligent cloud ecosystem that empowers
          learners, developers, and enterprises with innovation, scalability, and
          collaboration — across every horizon of technology.
        </p>
      </div>

      {/* Main Header Bar */}
      <div className="p-4 flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Cybercode EduLabs Logo" className="h-10 w-auto" />
          <div>
            <div className="text-xl font-bold tracking-wide text-gray-900 dark:text-gray-100">
              Cybercode EduLabs
            </div>
            {/* Animated Tagline */}
            <div className="text-xs text-indigo-600 dark:text-indigo-400 transition-opacity duration-1000 ease-in-out">
              {taglines[taglineIndex]}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="space-x-4 hidden md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`hover:underline transition-colors duration-200 ${
                link.highlight ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {link.name === "Cloud" ? "☁️ Cloud" : link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger & Dark Mode Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Slide Animation */}
      <div
        className={`md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md transform transition-transform duration-300 origin-top ${
          menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`hover:underline transition-colors duration-200 ${
                link.highlight ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {link.name === "Cloud" ? "☁️ Cloud" : link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
