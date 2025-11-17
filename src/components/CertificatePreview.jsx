import React, { useState, useEffect } from "react";
import { Lock, Award, CheckCircle, Linkedin, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// NEW
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function CertificatePreview({
  certificate,
  isEnrolled,
  isCompleted,
  progressPercent = 0,
}) {
  if (!certificate) return null;

  const { user } = useUser();
  const navigate = useNavigate();

  // ------------------------------
  // Certificate Lock Logic
  // ------------------------------
  const locked =
    !isEnrolled ||
    !isCompleted ||
    !user?.isPremium || // premium required
    !certificate?.studentName ||
    !certificate?.courseName ||
    !certificate?.completionDate ||
    !certificate?.certificateId;

  const [unlockedAnimation, setUnlockedAnimation] = useState(false);

  useEffect(() => {
    if (!locked) {
      setUnlockedAnimation(true);
      setTimeout(() => setUnlockedAnimation(false), 2000);
    }
  }, [locked]);

  // ------------------------------
  // Smart Redirect for Premium
  // ------------------------------
  const handlePremiumClick = () => {
    if (!user) {
      navigate("/register");
      return;
    }

    navigate("/payment?type=certification");
  };

  // ------------------------------
  // Certificate Viewer Redirect
  // ------------------------------
  const handleViewCertificate = () => {
    navigate(certificate.previewUrl);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 my-14 border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto">
      {/* Header */}
      <h3 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 flex items-center gap-3">
        🎓 Certificate Preview
      </h3>

      {/* Progress Bar */}
      {locked && (
        <div className="mb-8 p-5 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-3">🎯 Your Progress</h4>

          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {progressPercent}% completed — finish the course to unlock.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>✔ Complete all lessons</li>
            <li>✔ Finish required labs</li>
            <li>✔ Upgrade to Premium</li>
          </ul>
        </div>
      )}

      {/* Certificate Section */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Certificate Image */}
        <div className="relative">
          <img
            src={certificate.image}
            alt="Certificate Preview"
            className={`w-[400px] rounded-lg shadow-lg transition-all duration-500 border
              ${locked ? "blur-sm opacity-60 brightness-75" : "opacity-100"}
            `}
          />

          {locked && (
            <>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-600/10 blur-md"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Lock className="text-white w-10 h-10 drop-shadow-lg mb-1" />
                <p className="text-white text-sm font-medium drop-shadow">
                  Certificate Locked
                </p>
              </div>
            </>
          )}

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

        {/* ACTIONS */}
        <div className="flex-1">
          {locked ? (
            <>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Complete the course and upgrade to premium to unlock your
                verifiable certificate.
              </p>

              <button
                onClick={handlePremiumClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
              >
                <Lock size={18} />
                Become Premium to Unlock
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">
                  Certificate Unlocked!
                </span>
              </div>

              <button
                onClick={handleViewCertificate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition mb-3"
              >
                <Sparkles size={18} />
                View Certificate
              </button>

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
