// src/pages/Dashboard.jsx
import { useUser } from "../contexts/UserContext";
import useUserData from "../hooks/useUserData";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const {
    enrolledCourses = [],
    projects = [],
    hasCertificationAccess = false,
    hasServerAccess = false,
  } = useUserData(user) || {};

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
        <p className="text-lg mt-4">Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 text-center">
        Welcome, {user.displayName}
      </h1>

      <div className="flex flex-col items-center space-y-6">
        <img
          src={user.photoURL}
          alt="User Avatar"
          className="w-24 h-24 rounded-full shadow-md"
        />
        <p className="text-lg text-gray-700 dark:text-gray-300">
          <strong>Email:</strong> {user.email}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Courses */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📚 My Courses</h2>
            {enrolledCourses.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {enrolledCourses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                You haven't enrolled in any courses yet.
              </p>
            )}
          </div>

          {/* Projects */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📁 My Projects</h2>
            {projects.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {projects.map((project) => (
                  <li key={project}>{project}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Real-time project progress will appear here once you start learning.
              </p>
            )}
          </div>
        </div>

        {/* Access Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Certification */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">🎓 Certification Access</h2>
            {hasCertificationAccess ? (
              <p className="text-green-600">You have access to certification exams.</p>
            ) : (
              <Link
                to="/payment?type=certification"
                className="inline-block mt-2 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
              >
                Unlock Certification
              </Link>
            )}
          </div>

          {/* Server */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">🖥️ 1-Year Server Access</h2>
            {hasServerAccess ? (
              <p className="text-green-600">Server access active.</p>
            ) : (
              <Link
                to="/payment?type=server"
                className="inline-block mt-2 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
              >
                Activate Server Access
              </Link>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
        >
          🔓 Logout
        </button>
      </div>
    </div>
  );
}
