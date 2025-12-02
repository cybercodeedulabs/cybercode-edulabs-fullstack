import React from "react";
import { motion } from "framer-motion";

// 🔄 Replaced lucide-react with Iconify
import { Icon } from "@iconify/react";

export default function FAQ() {
  const faqs = [
    {
      question: "What makes Cybercode EduLabs unique?",
      answer:
        "Cybercode EduLabs bridges education and industry by combining real-world projects, corporate partnerships, and AI-powered mentorship. Our platform ensures learners gain hands-on experience that translates directly into job readiness.",
    },
    {
      question: "How do I enroll in a course?",
      answer:
        "Simply visit the Courses section, explore available programs, and click “Register Now.” You can sign in with Google and access your personalized learning dashboard instantly.",
    },
    {
      question: "Do I receive a certificate after course completion?",
      answer:
        "Yes. Every successfully completed course includes a verified Experience Certificate issued by Cybercode EduLabs to showcase your skills and project involvement.",
    },
    {
      question: "Are the projects real-world or simulated?",
      answer:
        "We emphasize real-world corporate and startup projects. Students gain exposure to live client environments, ensuring both technical and professional growth.",
    },
    {
      question: "Can I learn at my own pace?",
      answer:
        "Yes, all programs are self-paced. You can access materials anytime, with progress synced to your dashboard for seamless learning continuity.",
    },
    {
      question: "Do you provide mentorship support?",
      answer:
        "Yes, expert mentors and industry practitioners guide learners through structured feedback sessions, project reviews, and mock interviews.",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Frequently Asked Questions
        </motion.h1>

        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl leading-relaxed">
          Get quick answers about Cybercode EduLabs — our courses, projects, and learning experience.
        </p>

        {/* FAQ List */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-3">

                {/* Updated Icon */}
                <Icon
                  icon="mdi:chevron-down"
                  className="text-indigo-500 mt-1 shrink-0"
                  width="22"
                  height="22"
                />

                <div>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Note */}
        <motion.div
          className="mt-16 text-center text-gray-600 dark:text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="flex items-center justify-center gap-2">
            Still have questions? Reach us at{" "}
            <a
              href="mailto:support@cybercodeedulabs.com"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              <Icon icon="mdi:email-outline" width="16" height="16" />
              support@cybercodeedulabs.com
            </a>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
