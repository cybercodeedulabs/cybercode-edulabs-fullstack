import React from "react";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Contact Cybercode EduLabs
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          We’d love to hear from you—whether you’re a student, partner, or hiring company.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 md:p-8 space-y-6">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              rows="5"
              placeholder="Your message"
              className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <p>Email: <a href="mailto:cybercodeedulabs@gmail.com" className="text-indigo-600 hover:underline">cybercodeedulabs@gmail.com</a></p>
          <p>Phone: +91-XXXXXXXXXX</p>
          <p>Location: Remote / India-based Operations</p>
        </div>
      </div>
    </div>
  );
}
