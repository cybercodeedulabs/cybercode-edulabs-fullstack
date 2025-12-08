// src/pages/StudentProjectDetail.jsx
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function StudentProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getProjectById, deleteProject, user, token } = useUser();

  const project = getProjectById(id);

  // If project not found
  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white dark:bg-gray-900 border rounded-2xl shadow p-10 text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The project you're looking for doesn't exist or is not available.
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

  const isLocal = String(project.id).startsWith("local-");
  const deletable = !isLocal && Boolean(user?.uid) && Boolean(token);

  const handleDelete = async () => {
    if (!deletable) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    const result = await deleteProject(project.id);
    if (result?.success) {
      navigate("/student-projects");
    } else {
      alert(result.message || "Failed to delete project.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 border rounded-2xl shadow p-10"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {project.title || "Untitled Project"}
          </h1>

          {deletable && (
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {project.description || "No description provided."}
        </p>

        {/* TECH STACK */}
        {Array.isArray(project?.techStack) && project.techStack.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-indigo-500 mb-2">
              Tech Stack
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              {project.techStack.join(", ")}
            </div>
          </>
        )}

        {/* RAW JSON */}
        {project.rawJson && (
          <>
            <h3 className="text-lg font-semibold text-indigo-500 mb-2">
              Raw JSON (Generated Content)
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto border dark:border-gray-700">
{JSON.stringify(project.rawJson, null, 2)}
            </pre>
          </>
        )}

        {/* METADATA */}
        <div className="mt-8 text-xs text-gray-500">
          <p>ID: {project.id}</p>
          {project.created_at && <p>Created: {new Date(project.created_at).toLocaleString()}</p>}
          {project.timestamp && <p>Timestamp: {project.timestamp}</p>}
          {isLocal && <p className="italic mt-1">* Local-only project</p>}
        </div>

        {/* BACK BUTTON */}
        <div className="mt-8">
          <Link
            to="/student-projects"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          >
            Back to Projects
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
