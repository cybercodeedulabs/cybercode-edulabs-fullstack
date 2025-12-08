// src/pages/StudentProjects.jsx
import React, { useMemo, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

export default function StudentProjects() {
  const {
    generatedProjects = [],
    hydrated,
    deleteProject,
    user,
    token,
  } = useUser();

  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Filters / Sort / Search state
  const [difficultyFilter, setDifficultyFilter] = useState("all"); // all | Beginner | Intermediate | Advanced
  const [techFilter, setTechFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | az
  const [q, setQ] = useState("");

  // wait until UserContext has finished hydrating
  if (!hydrated) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
        <div className="text-center text-gray-500">Loading projects…</div>
      </section>
    );
  }

  // Normalize and assume new structure (Option A)
  const normalizedProjects = useMemo(() => {
    return (generatedProjects || []).map((p) => ({
      id: p.id,
      title: p.title || "Untitled Project",
      description: p.description || "No description provided.",
      tech_stack: Array.isArray(p.tech_stack)
        ? p.tech_stack
        : Array.isArray(p.techStack)
        ? p.techStack
        : [],
      difficulty: p.difficulty || "Beginner",
      timestamp: p.timestamp || (p.created_at ? new Date(p.created_at).getTime() : null),
      created_at: p.created_at || null,
      rawJson: p.rawJson ?? p.raw_json ?? p.raw ?? null,
    }));
  }, [generatedProjects]);

  // all available tech tags (for filter list)
  const allTechTags = useMemo(() => {
    const s = new Set();
    for (const p of normalizedProjects) {
      (p.tech_stack || []).forEach((t) => s.add(t));
    }
    return Array.from(s).sort();
  }, [normalizedProjects]);

  // Apply filters / search / sort
  const filtered = useMemo(() => {
    let arr = normalizedProjects.slice();

    if (difficultyFilter !== "all") {
      arr = arr.filter((p) => (p.difficulty || "").toLowerCase() === difficultyFilter.toLowerCase());
    }

    if (techFilter !== "all") {
      arr = arr.filter((p) => (p.tech_stack || []).includes(techFilter));
    }

    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      arr = arr.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(term) ||
          (p.description || "").toLowerCase().includes(term)
      );
    }

    if (sortBy === "newest") {
      arr.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } else if (sortBy === "oldest") {
      arr.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    } else if (sortBy === "az") {
      arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return arr;
  }, [normalizedProjects, difficultyFilter, techFilter, sortBy, q]);

  const hasProjects = filtered.length > 0;

  // Open confirm modal
  const openDeleteConfirm = (project) => {
    setToDelete(project);
    setConfirmOpen(true);
  };

  // Perform delete
  const performDelete = async () => {
    if (!toDelete) return;
    const id = toDelete.id;
    setDeletingId(id);

    // call context deleteProject
    const result = await deleteProject(id);

    setDeletingId(null);
    setConfirmOpen(false);
    setToDelete(null);

    if (!result?.success) {
      alert(result?.message || "Failed to delete project.");
    }
  };

  // Delete Modal component (portal)
  const DeleteModal = ({ open, project, onClose, onConfirm, loading }) => {
    if (!open || !project) return null;
    return createPortal(
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-[92%] max-w-md shadow-xl border dark:border-gray-700"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
          >
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Delete project
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to permanently delete <strong>{project.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white border text-sm hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-600">Student Project Showcase</h1>
          <p className="text-sm text-gray-600 mt-1">AI-generated & student projects — showcase your work.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or description…"
            className="px-4 py-2 rounded-lg border w-full md:w-64 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
          />

          <Link
            to="/dashboard#projects"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700"
            title="Create a new AI project"
          >
            New Project
          </Link>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-sm text-gray-600">Difficulty:</div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-1 rounded-lg border bg-white dark:bg-gray-900 text-sm"
          >
            <option value="all">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className="text-sm text-gray-600">Tech:</div>
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="px-3 py-1 rounded-lg border bg-white dark:bg-gray-900 text-sm"
          >
            <option value="all">All</option>
            {allTechTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Sort:</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 rounded-lg border bg-white dark:bg-gray-900 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
          </select>
        </div>
      </div>

      {/* Projects grid */}
      {!hasProjects ? (
        <div className="text-center text-gray-500 py-14">
          No AI-generated projects yet. Create one from your Dashboard →
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filtered.map((p) => {
            const isLocal = String(p.id || "").startsWith("local-");
            const deletable = !isLocal && Boolean(user?.uid) && Boolean(token);
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, boxShadow: "0 8px 30px rgba(13, 38, 59, 0.12)" }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-lg text-indigo-600">{p.title}</h3>

                    <div className="text-xs">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${
                          p.difficulty === "Advanced"
                            ? "bg-red-50 text-red-700"
                            : p.difficulty === "Intermediate"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 line-clamp-4">
                    {p.description}
                  </p>

                  {Array.isArray(p.tech_stack) && p.tech_stack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tech_stack.map((t) => (
                        <div key={t} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200">
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link to={`/student-projects/${p.id}`} className="text-sm text-indigo-600 hover:underline">
                    View Details →
                  </Link>

                  {deletable ? (
                    <button
                      onClick={() => openDeleteConfirm(p)}
                      disabled={deletingId === p.id}
                      className={`text-xs px-3 py-1 rounded-lg border ${
                        deletingId === p.id
                          ? "border-gray-400 text-gray-400"
                          : "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      }`}
                    >
                      {deletingId === p.id ? "Deleting..." : "Delete"}
                    </button>
                  ) : (
                    isLocal && (
                      <div className="text-[11px] italic text-gray-500">Local-only</div>
                    )
                  )}
                </div>

                <div className="mt-3 text-[11px] text-gray-500">
                  {p.timestamp ? new Date(p.timestamp).toLocaleDateString() : p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      <div className="text-center">
        <Link to="/dashboard#projects" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
          Create a New AI Project →
        </Link>
      </div>

      <DeleteModal
        open={confirmOpen}
        project={toDelete}
        onClose={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
        onConfirm={performDelete}
        loading={Boolean(deletingId)}
      />
    </section>
  );
}
