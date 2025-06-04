import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Header({ darkMode, setDarkMode }) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Cybercode EduLabs Logo" className="h-10 w-auto" />
        <div className="text-xl font-bold tracking-wide">Cybercode EduLabs</div>
      </div>

      {/* Navigation for medium+ screens */}
      <nav className="space-x-4 hidden md:block">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/courses" className="hover:underline">Courses</Link>
        <Link to="/projects" className="hover:underline">Projects</Link>
        <Link to="/register" className="hover:underline">Register</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </nav>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="ml-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}

export default Header;
