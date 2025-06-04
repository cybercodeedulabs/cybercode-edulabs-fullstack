// src/components/Footer.jsx
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-700 dark:text-gray-300">
        
        {/* Logo + Description */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Cybercode EduLabs</h2>
          <p className="text-sm">
            Empowering learners with real-world projects, corporate exposure, and industry-ready skills.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-indigo-500">Home</Link></li>
            <li><Link to="/courses" className="hover:text-indigo-500">Courses</Link></li>
            <li><Link to="/projects" className="hover:text-indigo-500">Projects</Link></li>
            <li><Link to="/about" className="hover:text-indigo-500">About</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-indigo-500">FAQ</Link></li>
            <li><Link to="/support" className="hover:text-indigo-500">Support</Link></li>
            <li><Link to="/register" className="hover:text-indigo-500">Register</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Contact</h3>
          <p className="text-sm mb-2">support@cybercodeedulabs.com</p>
          <p className="text-sm">© {new Date().getFullYear()} Cybercode EduLabs</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
