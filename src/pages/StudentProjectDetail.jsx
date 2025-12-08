// src/pages/StudentProjectDetail.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function StudentProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getProjectById, deleteProject, user, token } = useUser();
  const project = getProjectById(id);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // -----------------------------------------------------
  // If project not found
  // -----------------------------------------------------
  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white dark:bg-gray-900 border rounded-2xl shadow p-10 text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">Project Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The project you're looking for doesn't exist or may have been removed.
          </p>

          <Link
            to="/student-projects"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          >
            Back to Student Projects
          </Link>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // Normalize project shape (important)
  // -----------------------------------------------------
  const techStack = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : Array.isArray(project.techStack)
    ? project.techStack
    : [];

  const tasks = Array.isArray(project.tasks) ? project.tasks : [];

  const difficulty = project.difficulty || "Beginner";

  const isLocal = String(project.id).startsWith("local-");
  const deletable = !isLocal && Boolean(user?.uid) && Boolean(token);

  // -----------------------------------------------------
  // Delete handler
  // -----------------------------------------------------
  const handleDelete = async () => {
    if (!deletable) return;

    setDeleting(true);
    const result = await deleteProject(project.id);

    if (result?.success) {
      navigate("/student-projects");
    } else {
      alert(result.message || "Failed to delete project.");
    }
    setDeleting(false);
    setDeleteModal(false);
  };

  // -----------------------------------------------------
  // Difficulty color classes
  // -----------------------------------------------------
  const difficultyColor = {
    Beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
    Intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    Advanced: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  };

  // -----------------------------------------------------
  // Delete Modal
  // -----------------------------------------------------
  const DeleteModal = () =>
    createPortal(
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[2000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="
                bg-white dark:bg-gray-900 rounded-2xl p-8 w-[90%] max-w-md 
                shadow-xl border dark:border-gray-700
              "
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
            >
              <h2 className="text-xl font-bold text-red-500 mb-2">
                Delete Project?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This action cannot be undone. Your project will be permanently removed.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="px-4 py-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          rounded-2xl shadow border 
          bg-gradient-to-br from-indigo-50 to-purple-50
          dark:from-gray-800 dark:to-gray-900
          p-10
        "
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
              {project.title}
            </h1>

            <span
              className={`mt-3 inline-block px-3 py-1 text-xs font-medium rounded-full shadow ${difficultyColor[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>

          {deletable && (
            <button
              onClick={() => setDeleteModal(true)}
              className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        {techStack.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              Tech Stack
            </h3>

            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        {tasks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              Tasks
            </h3>

            <ul className="space-y-2">
              {tasks.map((t, i) => (
                <li
                  key={i}
                  className="text-sm flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-indigo-500 mt-1">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Raw JSON */}
        {project.rawJson && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              Raw JSON (Generated)
            </h3>

            <pre
              className="
                bg-gray-100 dark:bg-gray-800 
                p-4 rounded-lg text-sm overflow-x-auto border 
                dark:border-gray-700
              "
            >
{JSON.stringify(project.rawJson, null, 2)}
            </pre>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-10 text-xs text-gray-500">
          <p>ID: {project.id}</p>
          {project.created_at && <p>Created: {new Date(project.created_at).toLocaleString()}</p>}
          {project.timestamp && <p>Timestamp: {project.timestamp}</p>}
          {isLocal && <p className="italic mt-1">* Local-only project</p>}
        </div>

        {/* Back */}
        <div className="mt-8">
          <Link
            to="/student-projects"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          >
            Back to Projects
          </Link>
        </div>
      </motion.div>

      <DeleteModal />
    </div>
  );
}
