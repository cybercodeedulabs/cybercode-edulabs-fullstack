import React from "react";
import { Lock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function CertificatePreview({
  certificate,
  isEnrolled,
  isCompleted,
  courseSlug,
}) {
  if (!certificate) return null;

  const locked = !isEnrolled || !isCompleted;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 my-10 border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
        🎓 Certificate Preview
      </h3>

      <div className="relative flex flex-col md:flex-row items-center gap-6">
        
        {/* Certificate Image */}
        <div className="relative w-full md:w-1/2">
          <img
            src={
              certificate.image || "/images/certificate-default.png"
            }
            alt="Certificate Preview"
            className={`w-full rounded-lg shadow-lg border transition ${
              locked ? "blur-sm opacity-60" : "blur-0 opacity-100"
            }`}
          />

          {/* Lock Overlay */}
          {locked && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
              <Lock size={38} className="text-white mb-2" />
              <p className="text-white text-sm">Certificate Locked</p>
            </div>
          )}
        </div>

        {/* Text + CTA */}
        <div className="flex-1">
          {locked ? (
            <>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Complete the course and upgrade to premium to unlock your verifiable certificate.
              </p>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
              >
                <Lock size={18} />
                Become Premium to Unlock
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Congratulations! Your certificate is ready.
              </p>

              <Link
                to={`/certificate/${courseSlug}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
              >
                <ExternalLink size={18} />
                View Certificate
              </Link>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
