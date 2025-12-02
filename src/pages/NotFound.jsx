import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Replaced lucide-react with Iconify
import { Icon } from "@iconify/react";

export default function NotFound() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-center">
      {/* Background illustration */}
      <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-5">
        <img
          src="/images/hero-banner.png"
          alt="Cybercode Background"
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-[8rem] md:text-[10rem] font-extrabold text-indigo-700 dark:text-indigo-400 leading-none drop-shadow-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>

        <motion.p
          className="text-gray-600 dark:text-gray-400 mt-4 mb-8 text-base md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          It might have been moved, renamed, or never existed in the first place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-semibold shadow-lg transition-all"
          >
            <Icon icon="mdi:home-outline" width={20} height={20} />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative glow */}
      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-indigo-200/30 dark:from-indigo-900/20 blur-3xl pointer-events-none"></div>
    </section>
  );
}
