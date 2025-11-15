// src/components/Testimonials.jsx
import React from "react";

const testimonials = [
  {
    message:
      "The simulators and hands-on labs changed everything. This is the most practical training I have ever taken.",
    name: "Vivek Ram",
  },
  {
    message:
      "Cybercode’s teaching style helped me move from beginner to job-ready in months.",
    name: "Prakash Senha",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
          Student Success Stories
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="p-6 rounded-lg shadow bg-gray-50 dark:bg-gray-800"
            >
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                “{t.message}”
              </p>
              <p className="mt-4 font-semibold text-indigo-600 dark:text-indigo-400">
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
