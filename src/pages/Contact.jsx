import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contact Cybercode EduLabs
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          We’d love to hear from you — whether you’re a student, partner, or hiring company.
          Fill out the form below and our team will get back to you shortly.
        </motion.p>

        {/* Contact Form */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Your message"
                className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              ></textarea>
            </div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Send Message
            </motion.button>
          </form>

          {/* Contact Info */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 space-y-1 text-center">
            <p>
              📧 Email:{" "}
              <a
                href="mailto:cybercodeedulabs@gmail.com"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                support@cybercodeedulabs.com
              </a>
            </p>
            <p>📞 Phone: +91-XXXXXXXXXX</p>
            <p>🌐 Location: Remote / India-based Operations</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
