import React from "react";
import { motion } from "framer-motion";
import { Mail, Clock, HelpCircle } from "lucide-react";

export default function Support() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Support
        </motion.h1>

        <motion.p
          className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Need help? Our support team is here to assist you with course access,
          account issues, and platform guidance. You can reach us anytime using
          the options below.
        </motion.p>

        {/* Support Options */}
        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
            <Mail className="text-indigo-500 w-8 h-8 mb-4" />
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Email Support
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Write to us for any queries or technical issues.
            </p>
            <a
              href="mailto:cybercodeedulabs@gmail.com"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              cybercodeedulabs@gmail.com
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
            <HelpCircle className="text-indigo-500 w-8 h-8 mb-4" />
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Visit FAQ
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Find quick answers to common questions about our platform.
            </p>
            <a
              href="/faq"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Go to FAQ
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
            <Clock className="text-indigo-500 w-8 h-8 mb-4" />
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Working Hours
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Monday – Friday <br /> 10:00 AM – 6:00 PM (IST)
            </p>
          </div>
        </motion.div>

        {/* Optional Contact Form */}
        <motion.div
          className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Send us a message
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Fill in the form below, and we’ll respond within 24–48 hours.
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Describe your issue or question..."
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all"
            >
              Submit Request
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
