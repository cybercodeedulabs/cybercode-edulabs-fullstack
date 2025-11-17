// src/pages/CertificatePage.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import courseData from "../data/courseData";
import lessonsData from "../data/lessonsData";
import { ArrowLeft } from "lucide-react";

export default function CertificatePage() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { user, courseProgress } = useUser();

  // ------------------------------
  // Load Course Data
  // ------------------------------
  const course = courseData.find((c) => c.slug === courseSlug);
  const lessons = lessonsData[courseSlug] || [];

  // ------------------------------
  // Redirect if invalid course
  // ------------------------------
  if (!course) {
    return (
      <div className="p-10 text-center text-red-600">
        <h1 className="text-3xl font-bold">Course Not Found</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ------------------------------
  // Not Logged In?
  // ------------------------------
  useEffect(() => {
    if (!user) navigate("/register");
  }, [user, navigate]);

  if (!user) return null;

  // ------------------------------
  // Check Progress / Completion
  // ------------------------------
  const progress = courseProgress[courseSlug] || {
    completedLessons: [],
    currentLessonIndex: 0,
  };

  const isCompleted =
    progress.completedLessons.length === lessons.length &&
    lessons.length > 0;

  // ------------------------------
  // Strict Premium Requirement
  // ------------------------------
  const isPremium = user?.isPremium === true;

  useEffect(() => {
    if (!isPremium || !isCompleted) {
      navigate(`/courses/${courseSlug}`);
    }
  }, [isPremium, isCompleted, navigate, courseSlug]);

  if (!isPremium || !isCompleted) return null;

  // ------------------------------
  // Dynamic Certificate Metadata
  // ------------------------------
  const certificateId =
    progress.certificateId ||
    `CERT-${courseSlug.toUpperCase()}-${user.uid.slice(-6)}`;

  const completionDate =
    progress.completionDate ||
    new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
        🎓 Your Certificate — {course.title}
      </h1>

      {/* Certificate Box */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-8 rounded-xl shadow-lg">
        <img
          src="/images/certificate-default.png"
          alt="Certificate"
          className="rounded-lg shadow-lg mx-auto mb-6"
        />

        <div className="mt-6 text-gray-700 dark:text-gray-300 space-y-2 text-lg">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Course:</strong> {course.title}
          </p>
          <p>
            <strong>Completion Date:</strong> {completionDate}
          </p>
          <p>
            <strong>Certificate ID:</strong> {certificateId}
          </p>
        </div>

        {/* Download Button */}
        <div className="mt-10 text-center">
          <button
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
            onClick={() => window.print()}
          >
            Download / Print Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
