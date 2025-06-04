import { useParams, Link } from "react-router-dom";
import courseData from "../data/courseData";
import lessonsData from "../data/lessonsData";

function CourseDetail() {
  const { courseSlug } = useParams();
  const course = courseData.find((c) => c.slug === courseSlug);
  const lessons = lessonsData[courseSlug] || [];

  if (!course) {
    return (
      <div className="text-center py-20 text-red-600">
        <h2 className="text-3xl font-bold">Course not found</h2>
        <p className="mt-4">
          The course you're looking for doesn't exist.{" "}
          <Link to="/" className="text-indigo-600 underline">
            Go back home
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="text-left">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-20 px-4 shadow-md rounded-xl mx-auto max-w-6xl mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {course.title}
          </h1>
          <p className="text-lg md:text-xl text-indigo-100">{course.description}</p>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
          Lessons ({lessons.length})
        </h2>

        {lessons.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No lessons available yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
            {lessons.map((lesson, index) => (
              <li key={lesson.slug}>
                <Link
                  to={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                  className="block px-6 py-4 hover:bg-indigo-50 dark:hover:bg-gray-800 transition duration-200"
                >
                  <span className="text-lg font-medium text-indigo-800 dark:text-indigo-200">
                    {index + 1}. {lesson.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Call to Action */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            to="/#register"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            📝 Register for this Course
          </Link>
          <Link
            to="/courses"
            className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
