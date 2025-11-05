import React from "react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </motion.h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-12">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* Content */}
        <motion.div
          className="prose dark:prose-invert prose-indigo max-w-none leading-relaxed"
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
            <li>Payment & billing details: stored by our payment processor.</li>
          </ul>

          <h2>How We Use Data</h2>
          <p>
            We use data to provide the service, manage subscriptions, and
            improve the platform. We never sell personal data to third parties.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We use Firebase, Netlify, and a payment processor (e.g., Razorpay or
            Stripe) — each has its own privacy policies.
          </p>

          <h2>Security</h2>
          <p>
            We use standard measures to protect data in transit and at rest.
            For production secrets we use environment variables (Netlify /
            Vercel / Render secrets manager).
          </p>

          <h2>Your Rights</h2>
          <p>
            You can request export or deletion of your personal data by emailing{" "}
            <a
              href="mailto:support@cybercodeedulabs.com"
              className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
            >
              support@cybercodeedulabs.com
            </a>
            .
          </p>

          <h2>Contact</h2>
          <p>
            For privacy-related questions, email us at{" "}
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
