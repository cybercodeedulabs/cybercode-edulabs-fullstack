// src/pages/StudentProjects.jsx
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function StudentProjects() {
  const {
    generatedProjects = [],
    hydrated,
    deleteProject,
    user,
    token,
  } = useUser();

  const [deletingId, setDeletingId] = useState(null);

  // wait until UserContext has finished hydrating
  if (!hydrated) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
        <div className="text-center text-gray-500">Loading projects…</div>
      </section>
    );
  }

  const hasProjects =
    Array.isArray(generatedProjects) && generatedProjects.length > 0;

  // Handle project deletion
  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setDeletingId(id);

    const result = await deleteProject(id);

    setDeletingId(null);

    if (!result?.success) {
      alert(result.message || "Failed to delete project.");
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8">
        Student Project Showcase
      </h1>

      {/* AI PROJECTS */}
      <h2 className="text-xl font-semibold text-indigo-500 mb-4">
        🔥 AI-Generated Projects (from Dashboard)
      </h2>

      {!hasProjects && (
        <p className="text-gray-500 mb-10">
          No AI-generated projects yet. Create one from your Dashboard →
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {hasProjects &&
          generatedProjects.map((p) => {
            const techIsArray = Array.isArray(p?.techStack);
            const isLocal = String(p.id || "").startsWith("local-");
            const deletable =
              !isLocal && Boolean(user?.uid) && Boolean(token);

            return (
              <motion.div
                key={p.id || JSON.stringify(p).slice(0, 40)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg text-indigo-600">
                    {p?.title || "Untitled Project"}
                  </h3>

                  <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">
                    {p?.description || "No description provided."}
                  </p>

                  {techIsArray && p.techStack.length > 0 ? (
                    <div className="mt-3 text-xs text-gray-500">
                      Tech: {p.techStack.join(", ")}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    to={`/student-projects/${p.id}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View Details →
                  </Link>

                  {deletable ? (
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className={`text-xs px-3 py-1 rounded-lg border ${
                        deletingId === p.id
                          ? "border-gray-400 text-gray-400"
                          : "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      }`}
                    >
                      {deletingId === p.id ? "Deleting..." : "Delete"}
                    </button>
                  ) : null}
                </div>

                {isLocal && (
                  <p className="mt-2 text-[10px] text-gray-500 text-right italic">
                    * Local-only project (saved offline)
                  </p>
                )}
              </motion.div>
            );
          })}
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
