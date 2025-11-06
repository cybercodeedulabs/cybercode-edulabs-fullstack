// src/pages/Register.jsx
import { motion } from "framer-motion";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useUser } from "../contexts/UserContext";

export default function Register() {
  const { user } = useUser();

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-24 px-6">
      <div className="max-w-xl mx-auto text-center space-y-8">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Register with Cybercode EduLabs
        </motion.h1>

        {/* Divider */}
        <motion.div
          className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        {/* Description */}
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Sign up using your Google account to access your dashboard and exclusive project opportunities.
        </motion.p>

        {/* Google Sign-In */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {user ? (
            <p className="text-lg font-medium text-green-600 dark:text-green-400">
              ✅ Welcome, {user.displayName}!
            </p>
          ) : (
            <GoogleLoginButton />
          )}
        </motion.div>

        {/* Footer */}
        {!user && (
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            By registering, you agree to our{" "}
            <a
              href="/terms"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Privacy Policy
            </a>.
          </motion.p>
        )}
      </div>
    </section>
  );
}
