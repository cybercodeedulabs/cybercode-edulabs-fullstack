// src/pages/Courses.jsx
import CourseCategoryTabs from "../components/CourseCategoryTabs";

export default function Courses() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
          Explore Our Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Learn from a wide range of industry-focused programs across Cloud, DevOps, Programming, and more.
        </p>
      </div>

      <CourseCategoryTabs />
    </div>
  );
}
