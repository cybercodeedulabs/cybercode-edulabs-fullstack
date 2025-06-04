import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-6xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-4">404</h1>
      <p className="text-xl font-medium mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        ⬅ Back to Home
      </Link>
    </div>
  );
}
