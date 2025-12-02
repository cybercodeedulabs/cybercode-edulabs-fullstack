import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function Support() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
            Support Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Our team is here to help you with your learning experience at
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {" "}Cybercode EduLabs
            </span>
            . Reach out through any of the options below or send us a quick message.
          </p>
        </motion.div>

        {/* Support Options */}
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            {
              icon: (
                <Icon
                  icon="mdi:email-outline"
                  className="text-indigo-500 w-10 h-10 mb-4"
                />
              ),
              title: "Email Support",
              desc: "Get in touch for queries, issues, or platform guidance.",
              linkText: "support@cybercodeedulabs.com",
              link: "mailto:support@cybercodeedulabs.com",
            },
            {
              icon: (
                <Icon
                  icon="mdi:help-circle-outline"
                  className="text-indigo-500 w-10 h-10 mb-4"
                />
              ),
              title: "Visit FAQ",
              desc: "Find quick answers to common technical and learning questions.",
              linkText: "Go to FAQ",
              link: "/faq",
            },
            {
              icon: (
                <Icon
                  icon="mdi:clock-outline"
                  className="text-indigo-500 w-10 h-10 mb-4"
                />
              ),
              title: "Working Hours",
              desc: "Monday – Friday, 10:00 AM – 6:00 PM (IST). Weekend queries will be answered the next business day.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl"
            >
              {item.icon}
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                {item.desc}
              </p>
              {item.link && (
                <a
                  href={item.link}
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  {item.linkText}
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="mt-20 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Send us a message
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Fill in the form below, and our team will respond within 24–48 hours.
          </p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Describe your issue or feedback..."
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition"
              ></textarea>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all shadow-md hover:shadow-lg"
            >
              <Icon icon="mdi:send-outline" width={18} height={18} />
              Submit Request
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
