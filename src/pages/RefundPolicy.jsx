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
          <h2>Free Content</h2>
          <p>
            Free lessons, demos, and trial modules are provided for exploration
            and learning. These materials are not eligible for refunds.
          </p>

          <h2>Paid Courses & Subscriptions</h2>
          <p>
            For one-time course purchases, learners may request a refund within{" "}
            <strong>7 days</strong> of purchase, provided that less than{" "}
            <strong>20%</strong> of the course content has been accessed or
            completed.
          </p>

          <h2>Subscriptions</h2>
          <p>
            Subscription plans are billed on a recurring basis. Refunds for
            active subscriptions are only provided under exceptional
            circumstances, such as duplicate payments or verified technical
            issues preventing access to content.
          </p>

          <h2>How to Request</h2>
          <p>
            To initiate a refund or cancellation request, please email your
            order details and reason for the request to{" "}
            <a
              href="mailto:support@cybercodeedulabs.com"
              className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
            >
              support@cybercodeedulabs.com
            </a>
            . Our support team will review your case and respond within{" "}
            <strong>5 business days</strong>.
          </p>

          <h2>Important Notes</h2>
          <ul>
            <li>
              Refunds are processed to the original payment method only.
            </li>
            <li>
              Refund eligibility may vary based on payment gateway policies.
            </li>
            <li>
              Cybercode EduLabs reserves the right to decline refund requests
              that do not meet the outlined criteria.
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
