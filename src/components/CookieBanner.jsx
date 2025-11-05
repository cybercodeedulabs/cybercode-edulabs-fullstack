import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if consent already given
    const consent = localStorage.getItem("cybercode_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000); // delay for smoother appearance
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cybercode_cookie_consent", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 inset-x-0 z-50 flex justify-center px-4 pb-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="max-w-3xl w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
              We use cookies to enhance your experience, analyze site traffic,
              and serve relevant content. By continuing to use Cybercode EduLabs,
              you agree to our{" "}
              <Link
                to="/privacy"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Privacy Policy
              </Link>.
            </p>

            <button
              onClick={handleAccept}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CookieBanner;
