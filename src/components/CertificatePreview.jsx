import React, { useState, useEffect } from "react";
import { Lock, Award, CheckCircle, Linkedin, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificatePreview({
  certificate,
  isEnrolled,
  isCompleted,
  progressPercent = 0, // new dynamic progress %
}) {
  if (!certificate) return null;

  const locked = !isEnrolled || !isCompleted;
  const [unlockedAnimation, setUnlockedAnimation] = useState(false);

  useEffect(() => {
    if (!locked) {
      setUnlockedAnimation(true);
      setTimeout(() => setUnlockedAnimation(false), 2000);
    }
  }, [locked]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 my-14 border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto">

      {/* ===============================
          Header
      =============================== */}
      <h3 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 flex items-center gap-3">
        🎓 Certificate Preview
      </h3>

      {/* ===============================
          Progress Section
      =============================== */}
      {locked && (
        <div className="mb-8 p-5 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-3">🎯 Your Progress Towards Certificate</h4>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {progressPercent}% completed — finish all lessons to unlock certificate.
          </p>

          {/* Steps Box */}
          <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>✔ Complete all lessons</li>
            <li>✔ Finish required labs or projects</li>
            <li>✔ Become a premium learner (if required)</li>
          </ul>
        </div>
      )}

      {/* ===============================
          Certificate Display
      =============================== */}

      <div className="flex flex-col md:flex-row items-center gap-8">

        {/* Left: Preview Image */}
        <div className="relative">

          <img
            src={certificate.image}
            alt="Certificate Preview"
            className={`w-[400px] rounded-lg shadow-lg transition-all duration-500 border
              ${locked ? "blur-sm opacity-60 brightness-75" : "opacity-100"}
            `}
          />

          {/* Soft Glow for Locked */}
          {locked && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-600/10 pointer-events-none blur-md"></div>
          )}

          {/* Lock Icon */}
          {locked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Lock className="text-white w-10 h-10 drop-shadow-lg mb-1" />
              <p className="text-white text-sm font-medium drop-shadow">Certificate Locked</p>
            </div>
          )}

          {/* Unlock Medal Animation */}
          <AnimatePresence>
            {!locked && unlockedAnimation && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-6 -right-6"
              >
                <Award className="w-16 h-16 text-yellow-400 drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Description + Actions */}
        <div className="flex-1">

          {locked ? (
            <>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Complete the course and upgrade to premium to unlock your verifiable certificate.
              </p>

              <a
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
              >
                <Lock size={18} />
                Become Premium to Unlock
              </a>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Certificate Unlocked!</span>
              </div>

              {/* View Certificate */}
              <a
                href={certificate.previewUrl}
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition mb-3"
              >
                <Sparkles size={18} />
                View Certificate
              </a>

              {/* Add to LinkedIn */}
              <a
                href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
              >
                <Linkedin size={18} />
                Add to LinkedIn
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
