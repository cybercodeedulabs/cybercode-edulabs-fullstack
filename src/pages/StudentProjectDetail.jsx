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
  // Helpers to render S2 blueprint if available
  // -----------------------------------------------------
  const isS2Blueprint = (raw) => {
    if (!raw || typeof raw !== "object") return false;
    // S2 expects fields like step_by_step_guide or tasks or system_design or tech_stack
    return (
      raw.step_by_step_guide ||
      raw.step_by_step ||
      raw.steps_to_build ||
      raw.system_design ||
      raw.tech_stack ||
      raw.techStack ||
      raw.tasks
    );
  };

  const raw = project.rawJson && typeof project.rawJson === "object" ? project.rawJson : null;

  // safe getters
  const arr = (v) => (Array.isArray(v) ? v : typeof v === "string" && v.trim() ? v.split(/\r?\n|,/) .map(s=>s.trim()).filter(Boolean) : []);

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

        {/* If S2 blueprint available: render friendly sections */}
        {raw && isS2Blueprint(raw) ? (
          <>
            {/* Problem Statement */}
            {(raw.problem_statement || raw.problemStatement) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Problem Statement</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{raw.problem_statement || raw.problemStatement}</p>
              </div>
            )}

            {/* Why it matters */}
            {(raw.why_it_matters || raw.whyItMatters) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Why This Project Matters</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{raw.why_it_matters || raw.whyItMatters}</p>
              </div>
            )}

            {/* Goals */}
            {arr(raw.goals).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Goals</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {arr(raw.goals).map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            )}

            {/* Prerequisites */}
            {arr(raw.prerequisites).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Prerequisites</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {arr(raw.prerequisites).map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}

            {/* System Design */}
            {raw.system_design && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">System Design</h3>
                {raw.system_design.architecture_overview && (
                  <div className="mb-3">
                    <h4 className="font-medium">Architecture Overview</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{raw.system_design.architecture_overview}</p>
                  </div>
                )}
                {Array.isArray(raw.system_design.components) && raw.system_design.components.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium">Components</h4>
                    <ul className="list-disc pl-6 text-sm text-gray-700 dark:text-gray-300">
                      {raw.system_design.components.map((c, idx) => <li key={idx}>{typeof c === "string" ? c : JSON.stringify(c)}</li>)}
                    </ul>
                  </div>
                )}
                {raw.system_design.data_flow && (
                  <div>
                    <h4 className="font-medium">Data Flow</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{raw.system_design.data_flow}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tech Stack */}
            {arr(raw.tech_stack || raw.techStack || raw.tech).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {arr(raw.tech_stack || raw.techStack || raw.tech).map((t, i) => (
                    <span key={i} className="px-3 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-step Guide */}
            {arr(raw.step_by_step_guide || raw.step_by_step || raw.steps_to_build || raw.step_by_step).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Step-by-step Guide</h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  {arr(raw.step_by_step_guide || raw.step_by_step || raw.steps_to_build || raw.step_by_step).map((s, i) => (
                    <li key={i} className="text-sm">{s}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Tasks */}
            {arr(raw.tasks).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Tasks / Milestones</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {arr(raw.tasks).map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}

            {/* Testing Plan */}
            {arr(raw.testing_plan || raw.testingPlan || raw.tests).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Testing Plan</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {arr(raw.testing_plan || raw.testingPlan || raw.tests).map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}

            {/* Deployment */}
            {raw.deployment || raw.deployment_guide ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Deployment</h3>
                {Array.isArray(raw.deployment?.steps) && raw.deployment.steps.length > 0 && (
                  <div className="mb-2">
                    <h4 className="font-medium">Steps</h4>
                    <ol className="list-decimal pl-6 text-sm text-gray-700 dark:text-gray-300">
                      {raw.deployment.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </div>
                )}
                {Array.isArray(raw.deployment?.commands) && raw.deployment.commands.length > 0 && (
                  <div>
                    <h4 className="font-medium">Commands</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto border dark:border-gray-700">
{raw.deployment.commands.join("\n")}
                    </pre>
                  </div>
                )}
              </div>
            ) : null}

            {/* Security & Optimizations */}
            {arr(raw.security_best_practices).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Security Best Practices</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {arr(raw.security_best_practices).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {arr(raw.optimizations).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Optimizations</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {arr(raw.optimizations).map((o, i) => <li key={i}>{o}</li>)}
                </ul>
              </div>
            )}

            {/* Bonus Enhancements */}
            {arr(raw.bonus_features || raw.bonus_enhancements).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Bonus Features</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {arr(raw.bonus_features || raw.bonus_enhancements).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            )}

            {/* Sample Code */}
            {raw.sample_code && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Sample Code</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto border dark:border-gray-700">
{raw.sample_code}
                </pre>
              </div>
            )}

            {/* Interview Questions */}
            {arr(raw.interview_questions).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Interview / Review Questions</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {arr(raw.interview_questions).map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}
          </>
        ) : (
          // Fallback: show raw JSON for unexpected shapes for debugging, but keep UX friendly label
          project.rawJson ? (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                Generated Data (raw)
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
          ) : null
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
