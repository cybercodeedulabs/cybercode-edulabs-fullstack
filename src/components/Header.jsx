// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/logo.png";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useUser } from "../contexts/UserContext";

function Header({ darkMode, setDarkMode }) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

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

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const links = [
    { name: "Home", to: "/" },
    { name: "Courses", to: "/courses" },
    { name: "Projects", to: "/projects" },
    { name: "Cloud", to: "/cloud", highlight: true },
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

      {/* Main Header */}
      <div className="p-4 flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Cybercode EduLabs Logo" className="h-10 w-auto" />
          <div>
            <div className="text-xl font-bold tracking-wide text-gray-900 dark:text-gray-100">
              Cybercode EduLabs
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 transition-opacity duration-1000 ease-in-out">
              {taglines[taglineIndex]}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-5">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`hover:underline transition-colors duration-200 ${
                link.highlight
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {link.name === "Cloud" ? "☁️ Cloud" : link.name}
            </Link>
          ))}

          {/* Conditional Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-3">
              <img
                src={user.photo}
                alt={user.name}
                title={user.name}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate("/dashboard")}
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/register"
                className="text-gray-700 dark:text-gray-200 hover:underline"
              >
                Register
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <img src="/images/google.svg" alt="Google" className="w-4 h-4" />
                <span>Sign in</span>
              </Link>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md transform transition-all duration-300 origin-top ${
          menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`hover:underline transition-colors ${
                link.highlight
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {link.name === "Cloud" ? "☁️ Cloud" : link.name}
            </Link>
          ))}

          {user ? (
            <>
              <div className="flex items-center space-x-3 mt-3">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <img src="/images/google.svg" alt="Google" className="w-4 h-4" />
              <span>Sign in</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
