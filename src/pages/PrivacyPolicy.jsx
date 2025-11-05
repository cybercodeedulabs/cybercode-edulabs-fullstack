// src/pages/PrivacyPolicy.jsx
import React from "react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-20 sm:py-24 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Privacy Policy
        </motion.h1>

        {/* Animated Divider */}
        <motion.div
          className="w-24 h-1 bg-indigo-500 mx-auto mb-10 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-12">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* Content */}
        <motion.div
          className="prose dark:prose-invert prose-indigo max-w-none leading-relaxed text-justify"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2>Introduction</h2>
          <p>
            <strong>Cybercode EduLabs</strong> ("we", "our", "us") respects your
            privacy. This policy explains what personal data we collect, why we
            collect it, and how you can manage it.
          </p>

          <h2>Data We Collect</h2>
          <ul>
            <li>Account information: name, email (via Google Sign-In).</li>
            <li>Usage data: pages visited, features used, timestamps.</li>
            <li>Payment & billing details: stored securely by our payment processor.</li>
          </ul>

          <h2>How We Use Data</h2>
          <p>
            We use data to provide the service, manage subscriptions, enhance
            the learning experience, and improve the platform. We never sell
            personal data to third parties.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We use trusted third-party services including Firebase, Netlify, and
            a payment processor (e.g., Razorpay or Stripe). Each of these
            services maintains its own privacy policy and complies with
            international security standards.
          </p>

          <h2>Security</h2>
          <p>
            We use advanced security measures to protect your data in transit
            and at rest. Environment variables and secure cloud secret managers
            (Netlify, Vercel, or Render) are used for storing production
            credentials.
          </p>

          <h2>Your Rights</h2>
          <p>
            You can request export or deletion of your personal data by emailing{" "}
            <a
              href="mailto:support@cybercodeedulabs.com"
              className="text-indigo-600 dark:text-indigo-400 underline hover:brightness-110 underline-offset-2"
            >
              support@cybercodeedulabs.com
            </a>
            .
          </p>

          <h2>Contact</h2>
          <p>
            For any privacy-related questions or requests, reach out to us at{" "}
            <a
              href="mailto:support@cybercodeedulabs.com"
              className="text-indigo-600 dark:text-indigo-400 underline hover:brightness-110 underline-offset-2"
            >
              support@cybercodeedulabs.com
            </a>
            .
          </p>
        </motion.div>

        {/* Bottom Gradient Divider */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      </div>
    </section>
  );
}
