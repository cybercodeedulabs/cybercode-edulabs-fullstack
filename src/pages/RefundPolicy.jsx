import React from "react";
import { motion } from "framer-motion";

export default function RefundPolicy() {
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
          Refund & Cancellation Policy
        </motion.h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* Intro */}
        <motion.p
          className="text-base text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Please review our refund and cancellation terms carefully before making any purchase on{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Cybercode EduLabs
          </span>.
        </motion.p>

        {/* Main Content */}
        <motion.div
          className="prose dark:prose-invert prose-indigo max-w-none leading-relaxed space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2>Free Content</h2>
          <p>
            Free lessons, demos, and trial modules are offered to help learners explore our
            teaching style and platform. These materials are provided without charge and are
            not eligible for refunds.
          </p>

          <h2>Paid Courses & Programs</h2>
          <p>
            Learners who purchase a course may request a refund within{" "}
            <strong>7 days</strong> of purchase, provided that less than{" "}
            <strong>20%</strong> of the course content has been accessed or completed.
          </p>

          <h2>Subscriptions</h2>
          <p>
            Subscription-based plans renew automatically at the chosen interval. Refunds for
            ongoing subscriptions are only granted under verified conditions — such as duplicate
            payments or confirmed technical issues preventing course access.
          </p>

          <h2>How to Request a Refund</h2>
          <p>
            To initiate a refund or cancellation, please email your order details and reason for
            the request to{" "}
            <a
              href="mailto:support@cybercodeedulabs.com"
              className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
            >
              support@cybercodeedulabs.com
            </a>
            . Our team will review your request and respond within{" "}
            <strong>5 business days</strong>.
          </p>

          <h2>Important Notes</h2>
          <ul>
            <li>Refunds are issued to the original payment method only.</li>
            <li>Processing times may vary based on the payment gateway.</li>
            <li>
              <strong>Cybercode EduLabs</strong> reserves the right to decline requests that do
              not meet the criteria mentioned in this policy.
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
