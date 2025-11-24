// src/pages/Dashboard.jsx
import { useUser } from "../contexts/UserContext";
import useUserData from "../hooks/useUserData";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import { PERSONAS_LIST } from "../utils/personaEngine";

export default function Dashboard() {
  const { user, setUser, personaScores, getTopPersona } = useUser();
  const navigate = useNavigate();

  const {
    enrolledCourses = [],
    projects = [],
    hasCertificationAccess = false,
    hasServerAccess = false,
  } = useUserData() || {};

  const topPersona = getTopPersona();

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
  };

  // -------------------------------------
  // UNAUTHORIZED VIEW
  // -------------------------------------
  if (!user) {
    return (
      <motion.div
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please log in to access your dashboard and learning resources.
        </p>
        <Link
          to="/register"
          className="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
        >
          Go to Login
        </Link>
      </motion.div>
    );
  }

  // -------------------------------------
  // DASHBOARD VIEW
  // -------------------------------------
  return (
    <motion.section
      className="max-w-6xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* HEADER */}
      <motion.div
        className="text-center mb-12"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          Welcome, {user.name || "User"}
        </h1>

        {user.isPremium && (
          <span className="inline-block mt-2 px-3 py-1 bg-yellow-300 text-yellow-900 rounded-full text-sm font-semibold shadow">
            ⭐ Premium Member
          </span>
        )}

        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-3">
          Manage your learning progress, access real-time projects, and unlock certifications.
        </p>
      </motion.div>

      {/* USER INFO */}
      <motion.div
        className="flex flex-col items-center mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <img
          src={user.photo || "/images/default-avatar.png"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full shadow-lg border-4 border-indigo-500 dark:border-indigo-400"
        />
        <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
          <strong>Email:</strong> {user.email}
        </p>
          {/* EDIT PROFILE BUTTON */}
          <Link
            to="/edit-profile"
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 
                      text-white rounded-lg text-sm shadow transition"
          >
            ✏️ Edit Profile
          </Link>
      </motion.div>

      {/* ===========================================
            ✨ IMPROVED PERSONA CARD
      ============================================ */}
      <motion.div
        className="p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                   rounded-2xl shadow-xl border border-indigo-100 dark:border-gray-700 mb-12"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        {/* Title + Edit Profile */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            🧠 Your Learning Persona
          </h2>

          <button
            onClick={() => navigate("/edit-profile")}
            className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow"
          >
            Edit Profile
          </button>
        </div>

        {/* Persona Not Detected Yet */}
        {!topPersona ? (
          <p className="text-gray-600 dark:text-gray-400 text-sm italic">
            Start exploring lessons — your persona will be detected automatically.
          </p>
        ) : (
          <>
            {/* Top Persona Display */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {PERSONAS_LIST[topPersona.persona] || topPersona.persona}
                <span className="text-xs bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-full">
                  ⭐ Top Persona
                </span>
              </h3>
            </div>

            {/* Persona Progress Bars */}
            <div className="space-y-3">
              {personaScores &&
                Object.entries(personaScores).map(([name, score]) => (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {PERSONAS_LIST[name] || name}
                      </span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {score}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 transition-all"
                        style={{ width: `${Math.min(score, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-5">
              <Link
                to="/courses"
                className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm shadow transition"
              >
                Explore Recommended Courses →
              </Link>
            </div>
          </>
        )}
      </motion.div>

      {/* COURSES & PROJECTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[
          {
            title: "📚 My Courses",
            items: enrolledCourses,
            emptyText: "You haven’t enrolled in any courses yet.",
            linkPrefix: "/courses/",
          },
          {
            title: "📁 My Projects",
            items: projects,
            emptyText: "Your project progress will appear here once you start learning.",
            linkPrefix: "/projects/",
          },
        ].map((section, index) => (
          <motion.div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 
                       p-6 rounded-2xl shadow hover:shadow-lg transition"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              {section.title}
            </h2>

            {section.items.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                {section.items.map((item) => (
                  <li key={item}>
                    <Link
                      to={`${section.linkPrefix}${item}`}
                      className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{section.emptyText}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* ACCESS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Certification Access */}
        <motion.div
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                     p-6 rounded-2xl shadow hover:shadow-lg transition"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
            🎓 Certification Access
          </h2>

          {hasCertificationAccess ? (
            <p className="text-green-600 dark:text-green-400">Access granted.</p>
          ) : (
            <Link
              to="/payment?type=certification"
              className="inline-block mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white 
                         rounded-lg text-sm transition"
            >
              Unlock Certification
            </Link>
          )}
        </motion.div>

        {/* Server Access */}
        <motion.div
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                     p-6 rounded-2xl shadow hover:shadow-lg transition"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
            🖥️ 1-Year Server Access
          </h2>

          {hasServerAccess ? (
            <p className="text-green-600 dark:text-green-400">Server Access Active.</p>
          ) : (
            <Link
              to="/payment?type=server"
              className="inline-block mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white 
                         rounded-lg text-sm transition"
            >
              Activate Server Access
            </Link>
          )}
        </motion.div>

        {/* Cloud Console */}
        <motion.div
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                     p-6 rounded-2xl shadow hover:shadow-lg transition"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
            ☁️ Cybercode Cloud Console
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
            Launch AI, Cloud, or IoT projects instantly.
          </p>

          <Link
            to="/cloud"
            className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white 
                       rounded-lg text-sm transition"
          >
            Open Cloud Console
          </Link>
        </motion.div>
      </div>

      {/* LOGOUT */}
      <motion.div
        className="text-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
        >
          🔓 Logout
        </button>
      </motion.div>
    </motion.section>
  );
}
