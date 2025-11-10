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

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="bg-indigo-600 text-white text-sm py-2 overflow-hidden">
        <p className="animate-marquee font-medium tracking-wide">
          ☁️ Cloud Vision: Building a unified, intelligent cloud ecosystem that
          empowers learners, developers, and enterprises.
        </p>
      </div>

      <div className="p-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Cybercode EduLabs Logo" className="h-10 w-auto" />
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Cybercode EduLabs
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 transition-opacity duration-1000 ease-in-out">
              {taglines[taglineIndex]}
            </div>
          </div>
        </div>

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

          {user ? (
            <div className="flex items-center space-x-3">
              <img
                src={user.photo || "/images/default-avatar.png"}
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
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <img src="/images/google.svg" alt="Google" className="w-4 h-4" />
                <span>Sign in</span>
              </Link>
            </div>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>

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
    </header>
  );
}

export default Header;
