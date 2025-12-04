// src/pages/StudentProjects.jsx
import React from "react";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function StudentProjects() {
  const { generatedProjects = [] } = useUser();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8">
        Student Project Showcase
      </h1>

      {/* AI PROJECTS */}
      <h2 className="text-xl font-semibold text-indigo-500 mb-4">
        🔥 AI-Generated Projects (from Dashboard)
      </h2>

      {!generatedProjects.length && (
        <p className="text-gray-500 mb-10">
          No AI-generated projects yet. Create one from your Dashboard →
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {Array.isArray(generatedProjects) &&
          generatedProjects.length > 0 &&
          generatedProjects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-5"
            >
              <h3 className="font-bold text-lg text-indigo-600">{p.title}</h3>

              <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">
                {p.description}
              </p>

              {p.techStack?.length ? (
                <div className="mt-3 text-xs text-gray-500">
                  Tech: {p.techStack.join(", ")}
                </div>
              ) : null}

              <div className="mt-4">
                <Link
                  to={`/student-projects/${p.id}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link
          to="/dashboard#projects"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Create a New AI Project →
        </Link>
      </div>
    </section>
  );
}
