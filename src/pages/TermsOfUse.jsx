import React from "react";
import { motion } from "framer-motion";

export default function TermsOfUse() {
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
          Terms of Use
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
          <h2>Acceptance</h2>
          <p>
            By using <strong>Cybercode EduLabs</strong>, you agree to these
            terms. If you do not agree, please discontinue use of the service.
          </p>

          <h2>Service Description</h2>
          <p>
            We provide educational content, project mentorship, and access to a
            hosted developer environment, subject to applicable subscription
            plans and usage policies.
          </p>

          <h2>User Accounts</h2>
          <p>
            Accounts are created via Google Sign-In. You are responsible for
            maintaining the confidentiality of your credentials and for all
            activities that occur under your account.
          </p>

          <h2>Payments & Subscriptions</h2>
          <p>
            Paid features and subscriptions are processed securely through our
            payment partner. Refunds are governed by our{" "}
            <a
              href="/refund-policy"
              className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
            >
              Refund Policy
            </a>
            .
          </p>

          <h2>Termination</h2>
          <p>
            We may suspend or terminate accounts for violations of these Terms
            of Service, non-payment, or activities deemed harmful to the
            platform or other users.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Cybercode EduLabs shall not
            be liable for indirect, incidental, or consequential damages,
            including but not limited to loss of profits, data, or goodwill.
          </p>

          <h2>Contact</h2>
          <p>
            For any questions or concerns, please contact us at{" "}
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
