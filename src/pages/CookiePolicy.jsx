import React from "react";
import { motion } from "framer-motion";

export default function CookiePolicy() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Cookie Policy
        </motion.h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-12">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* Main Content */}
        <motion.div
          className="prose dark:prose-invert prose-indigo max-w-none leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p>
            At <strong>Cybercode EduLabs</strong>, we use cookies and similar
            technologies to enhance your browsing experience, analyze traffic,
            and deliver personalized content. This policy explains what cookies
            are, how we use them, and how you can control them.
          </p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They allow websites to recognize your browser and remember
            preferences, such as login status or selected theme.
          </p>

          <h2>How We Use Cookies</h2>
          <ul>
            <li>To remember your dark/light mode and personalization settings.</li>
            <li>To enhance site performance and loading speed.</li>
            <li>To track anonymous analytics and user engagement.</li>
            <li>To maintain secure user sessions and authentication.</li>
          </ul>

          <h2>Types of Cookies We Use</h2>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Required for core functionality such as
              authentication and navigation.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how users interact
              with our platform.
            </li>
            <li>
              <strong>Preference Cookies:</strong> Save settings like language, layout, and
              theme preferences.
            </li>
          </ul>

          <h2>Managing Cookies</h2>
          <p>
            You can manage, disable, or delete cookies through your browser’s
            settings. Note that restricting cookies may limit the functionality
            of certain features on our site.
          </p>

          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies may be placed by trusted third parties such as Google
            Analytics or our payment gateway to enhance analytics and security
            functions.
          </p>

          <h2>Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy periodically to reflect new
            technologies, legal requirements, or service updates. Please revisit
            this page regularly for the latest information.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about this Cookie Policy, contact us at{" "}
            <a
              href="mailto:support@cybercodeedulabs.com"
              className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
            >
              support@cybercodeedulabs.com
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
