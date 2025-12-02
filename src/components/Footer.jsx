// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 text-gray-700 dark:text-gray-300">

        {/* A. Brand / Description */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
            Cybercode Suite
          </h2>
          <p className="text-sm leading-relaxed mb-4">
            A unified learning & cloud ecosystem — from real-time IT courses to India’s upcoming
            developer cloud platform.
          </p>

          {/* Socials */}
          <div className="flex space-x-4 mt-3">
            <a
              href="https://www.linkedin.com/company/cybercodeedulabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition-all transform hover:scale-110"
            >
              <Icon icon="mdi:linkedin" width={18} height={18} />
            </a>
            <a
              href="https://youtube.com/@cybercodeedulabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition-all transform hover:scale-110"
            >
              <Icon icon="mdi:youtube" width={18} height={18} />
            </a>
          </div>
        </div>

        {/* B. Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-indigo-500">Home</Link></li>
            <li><Link to="/courses" className="hover:text-indigo-500">Courses</Link></li>
            <li><Link to="/projects" className="hover:text-indigo-500">Projects</Link></li>
            <li><Link to="/labs" className="hover:text-indigo-500">Labs</Link></li>
            <li><Link to="/register" className="hover:text-indigo-500">Free Demo Class</Link></li>
          </ul>
        </div>

        {/* C. Community */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Community
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/podcast" className="hover:text-indigo-500">Prime Techies Podcast</Link></li>
            <li><Link to="/community" className="hover:text-indigo-500">Community Hub</Link></li>
            <li><Link to="/student-projects" className="hover:text-indigo-500">Student Projects</Link></li>
            <li><Link to="/blog" className="hover:text-indigo-500">Blog</Link></li>
          </ul>
        </div>

        {/* D. Cloud Platform */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Cybercode Cloud
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Icon icon="mdi:cloud-outline" width={16} height={16} className="text-indigo-500" />
              <Link to="/cloud" className="hover:text-indigo-500">Overview</Link>
            </li>
            <li><Link to="/admin/waitlist" className="hover:text-indigo-500">Admin Panel</Link></li>
            <li>
              <Link
                to="/cloud"
                className="inline-block px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 transition"
              >
                Join Cloud Waitlist
              </Link>
            </li>
          </ul>
        </div>

        {/* E. Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-indigo-500">FAQ</Link></li>
            <li><Link to="/support" className="hover:text-indigo-500">Support</Link></li>
            <li><Link to="/payment" className="hover:text-indigo-500">Payment Options</Link></li>
          </ul>
        </div>

        {/* F. Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Legal & Policies
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-indigo-500">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-indigo-500">Terms of Service</Link></li>
            <li><Link to="/cookie" className="hover:text-indigo-500">Cookie Policy</Link></li>
            <li><Link to="/refund" className="hover:text-indigo-500">Refund & Cancellation</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Cybercode Suite — All rights reserved.</p>
        <p className="mt-1 text-xs opacity-80">Powered by Indian Innovation</p>
      </div>
    </footer>
  );
}

export default Footer;
