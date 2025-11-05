// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Github, Linkedin, Youtube } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-gray-700 dark:text-gray-300">

        {/* A. Logo + Description */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            Cybercode EduLabs
          </h2>
          <p className="text-sm mb-4">
            Empowering learners with real-world projects, corporate exposure, and industry-ready skills.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://github.com/cybercodeedulabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition-colors duration-200 transform hover:scale-110"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/cybercodeedulabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition-colors duration-200 transform hover:scale-110"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://youtube.com/@cybercodeedulabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition-colors duration-200 transform hover:scale-110"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* B. Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-indigo-500 transition-colors duration-200">Home</Link></li>
            <li><Link to="/courses" className="hover:text-indigo-500 transition-colors duration-200">Courses</Link></li>
            <li><Link to="/projects" className="hover:text-indigo-500 transition-colors duration-200">Projects</Link></li>
            <li><Link to="/cloud" className="hover:text-indigo-500 transition-colors duration-200">Cloud</Link></li>
            <li><Link to="/dashboard" className="hover:text-indigo-500 transition-colors duration-200">Dashboard</Link></li>
          </ul>
        </div>

        {/* C. Legal & Policies */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Legal & Policies</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-indigo-500 transition-colors duration-200">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-indigo-500 transition-colors duration-200">Terms of Service</Link></li>
            <li><Link to="/cookie" className="hover:text-indigo-500 transition-colors duration-200">Cookie Policy</Link></li>
            <li><Link to="/refund" className="hover:text-indigo-500 transition-colors duration-200">Refund & Cancellation</Link></li>
          </ul>
        </div>

        {/* D. Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-indigo-500 transition-colors duration-200">FAQ</Link></li>
            <li><Link to="/support" className="hover:text-indigo-500 transition-colors duration-200">Support</Link></li>
            <li><Link to="/register" className="hover:text-indigo-500 transition-colors duration-200">Register</Link></li>
          </ul>
        </div>

        {/* E. Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Contact</h3>
          <p className="text-sm mb-2">
            <a
              href="mailto:cybercodeedulabs@gmail.com"
              className="hover:text-indigo-500 transition-colors duration-200"
            >
              support@cybercodeedulabs.com
            </a>
          </p>
          <p className="text-sm">© {new Date().getFullYear()} Cybercode EduLabs</p>
          <p className="text-xs mt-1 opacity-75">Made in India</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
