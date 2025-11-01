// import { Link } from "react-router-dom";
// import logo from "/images/logo.png";

// function Header({ darkMode, setDarkMode }) {
//   return (
//     <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
//       {/* Logo & Brand */}
//       <div className="flex items-center space-x-3">
//         <img src={logo} alt="Cybercode EduLabs Logo" className="h-10 w-auto" />
//         <div className="text-xl font-bold tracking-wide">Cybercode EduLabs</div>
//       </div>

//       {/* Navigation for medium+ screens */}
//       <nav className="space-x-4 hidden md:block">
//         <Link to="/" className="hover:underline">Home</Link>
//         <Link to="/courses" className="hover:underline">Courses</Link>
//         <Link to="/projects" className="hover:underline">Projects</Link>
//         <Link to="/cloud" className="hover:underline text-indigo-600 dark:text-indigo-400 font-semibold">
//           ☁️ Cloud
//         </Link>
//         <Link to="/register" className="hover:underline">Register</Link>
//         <Link to="/dashboard" className="hover:underline">Dashboard</Link>
//         <Link to="/contact" className="hover:underline">Contact</Link>
//       </nav>

//       {/* Dark mode toggle */}
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         className="ml-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded transition hover:bg-gray-300 dark:hover:bg-gray-600"
//       >
//         {darkMode ? "☀️ Light" : "🌙 Dark"}
//       </button>
//     </header>
//   );
// }

// export default Header;
import { Link } from "react-router-dom";
import logo from "/images/logo.png";
import { useState, useEffect } from "react";

function Header({ darkMode, setDarkMode }) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const taglines = [
    "Empowering Future Through Cloud & AI",
    "Building Smarter Infrastructures Together",
    "Innovating Cloud Solutions for Everyone",
  ];

  // Fade animation effect for taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
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

        {/* Navigation for medium+ screens */}
        <nav className="space-x-4 hidden md:block">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/courses" className="hover:underline">Courses</Link>
          <Link to="/projects" className="hover:underline">Projects</Link>
          <Link to="/cloud" className="hover:underline text-indigo-600 dark:text-indigo-400 font-semibold">
            ☁️ Cloud
          </Link>
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </nav>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded transition hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}

export default Header;
