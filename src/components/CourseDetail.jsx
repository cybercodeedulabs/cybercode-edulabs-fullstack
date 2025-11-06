// src/pages/CourseDetail.jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import courseData from "../data/courseData";
import lessonsData from "../data/lessonsData";
import { useUser } from "../contexts/UserContext";

export default function CourseDetail() {
  const { courseSlug } = useParams();
  const course = courseData.find((c) => c.slug === courseSlug);
  const lessons = lessonsData[courseSlug] || [];
  const { user, enrolledCourses, enrollInCourse, courseProgress } = useUser();
  const isEnrolled = user && enrolledCourses.includes(courseSlug);
  const progressData = courseProgress[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };

  const [showToast, setShowToast] = useState(false);

  const handleEnroll = () => {
    enrollInCourse(courseSlug);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!course) {
    return (
      <div className="text-center py-20 text-red-600">
        <h2 className="text-3xl font-bold">Course not found</h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          The course you're looking for doesn't exist.{" "}
          <Link to="/" className="text-indigo-600 underline hover:text-indigo-500">
            Go back home
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="text-left relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          🎉 Successfully enrolled in "{course.title}"!
        </div>
      )}

      {/* Banner */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-20 px-4 shadow-md rounded-xl mx-auto max-w-6xl mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{course.title}</h1>
          <p className="text-lg md:text-xl text-indigo-100">{course.description}</p>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
          Lessons ({lessons.length})
        </h2>

        {lessons.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No lessons available yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
            {lessons.map((lesson, index) => {
              const completed = progressData.completedLessons.includes(lesson.slug);
              const isNext = index === progressData.currentLessonIndex;

              return (
                <li key={lesson.slug}>
                  <Link
                    to={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                    className={`block px-6 py-4 transition-colors duration-200 rounded ${
                      completed
                        ? "bg-green-50 dark:bg-green-900"
                        : isNext
                        ? "bg-yellow-50 dark:bg-yellow-900"
                        : "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-lg font-medium text-indigo-800 dark:text-indigo-200">
                      {index + 1}. {lesson.title} {completed ? "✅" : isNext ? "🟡" : "🔒"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Call to Action */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {!user ? (
            <Link
              to="/register"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              🔒 Sign in to Enroll
            </Link>
          ) : !isEnrolled ? (
            <button
              onClick={handleEnroll}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              ✅ Enroll in this Course
            </button>
          ) : (
            <span className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-lg">
              🎉 You are enrolled in this course
            </span>
          )}

          <Link
            to="/courses"
            className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
