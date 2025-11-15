// src/pages/CourseDetail.jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import courseData from "../data/courseData";
import lessonsData from "../data/lessonsData";
import { useUser } from "../contexts/UserContext";
import CertificatePreview from "../components/CertificatePreview";


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

      {/* Toast */}
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

      {/* ==============================
              COURSE OVERVIEW SECTION
         ============================== */}
      <div className="max-w-4xl mx-auto px-4 pb-10">

        {/* 1. Course Highlights */}
        <section className="mb-10 grid sm:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">📌 Course Highlights</h3>
            <ul className="text-sm space-y-1">
              <li><strong>Duration:</strong> {course.duration || "Self-paced"}</li>
              <li><strong>Level:</strong> {course.level || "Beginner Friendly"}</li>
              <li><strong>Mode:</strong> {course.mode || "Self-paced + Labs"}</li>
              <li><strong>Language:</strong> {course.language || "English"}</li>
              <li><strong>Last Updated:</strong> {course.lastUpdated || "2025"}</li>
            </ul>
          </div>

          {/* 2. This Course Includes */}
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">🎁 This Course Includes</h3>
            <ul className="text-sm space-y-1">
              {(course.includes || []).map((x, i) => (
                <li key={i}>• {x}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Skills You Will Learn */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
            🧠 Skills You Will Learn
          </h3>
          <div className="flex flex-wrap gap-3">
            {(course.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* 4. Projects Included */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
            🛠️ Projects Included
          </h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            {(course.projects || []).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        {/* 5. Tools & Technologies */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
            🔧 Tools & Technologies Covered
          </h3>
          <div className="flex flex-wrap gap-3">
            {(course.tools || []).map((t, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* 6. Why This Course */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
            ⭐ Why This Course?
          </h3>
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
            {course.why ||
              "This course is built with real-world use cases, hands-on scenarios, industry workflows, job preparation, and practical knowledge that directly maps to production environments."}
          </p>
        </section>

        {/* 7. FAQ */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
            ❓ Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {(course.faqs || []).map((f, i) => (
              <details key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                <summary className="font-semibold cursor-pointer">{f.q}</summary>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
      <CertificatePreview
       certificate={{
  image: "/images/certificate-default.png",
  previewUrl: `/certificate/${courseSlug}`,
  ...(course.certificate || {})
}}

       isEnrolled={isEnrolled}
       isCompleted={progressData.completedLessons.length === lessons.length && lessons.length > 0}
      />


      {/* ==============================
              LESSONS SECTION (untouched)
         ============================== */}
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
                      {index + 1}. {lesson.title}{" "}
                      {completed ? "✅" : isNext ? "🟡" : "🔒"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* CTA */}
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
