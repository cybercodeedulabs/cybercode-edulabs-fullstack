// src/components/simulations/full-stack/ClientServerFlow.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Laptop, Server, Database, ArrowRight, ArrowLeft } from "lucide-react";

export default function ClientServerFlow() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: "Step 1: User Action (Frontend)",
      description:
        "A user interacts with the web app — for example, clicking a 'Login' button on the React frontend. The browser prepares a request to send to the server.",
    },
    {
      title: "Step 2: Request to Backend",
      description:
        "The frontend sends an HTTP request (like POST /login) to the backend server (Express.js). This is where API endpoints come into play.",
    },
    {
      title: "Step 3: Backend Logic & Database Query",
      description:
        "The backend receives the request, processes the logic (like checking user credentials), and queries the database for stored data.",
    },
    {
      title: "Step 4: Database Responds",
      description:
        "The database returns data to the backend — such as user details, authentication status, or product information.",
    },
    {
      title: "Step 5: Response Back to Frontend",
      description:
        "The backend sends the response (in JSON) back to the frontend. React uses this data to update the UI dynamically — completing the full request-response cycle!",
    },
  ];

  const handleNext = () => setStage((prev) => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setStage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="p-6 mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-indigo-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
        🌐 Client–Server Flow Visualizer
      </h2>

      <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed max-w-3xl">
        This simulation visually represents how a web request flows from your browser (frontend)
        through the backend server, into the database, and returns as a response.
      </p>

      {/* Visual Map */}
      <div className="relative flex justify-center items-center gap-4 sm:gap-12 mb-10">
        {/* Frontend */}
        <motion.div
          className={`p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border ${
            stage === 0 ? "border-indigo-500" : "border-gray-300 dark:border-gray-600"
          }`}
          animate={{ scale: stage === 0 ? 1.1 : 1 }}
        >
          <Laptop size={48} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <p className="text-center font-semibold text-indigo-700 dark:text-indigo-300">
            Frontend (React)
          </p>
        </motion.div>

        <ArrowRight className="hidden sm:block text-indigo-500 dark:text-indigo-400" size={36} />

        {/* Backend */}
        <motion.div
          className={`p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border ${
            stage === 2 ? "border-indigo-500" : "border-gray-300 dark:border-gray-600"
          }`}
          animate={{ scale: stage === 2 ? 1.1 : 1 }}
        >
          <Server size={48} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <p className="text-center font-semibold text-indigo-700 dark:text-indigo-300">
            Backend (Express)
          </p>
        </motion.div>

        <ArrowRight className="hidden sm:block text-indigo-500 dark:text-indigo-400" size={36} />

        {/* Database */}
        <motion.div
          className={`p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border ${
            stage === 3 ? "border-indigo-500" : "border-gray-300 dark:border-gray-600"
          }`}
          animate={{ scale: stage === 3 ? 1.1 : 1 }}
        >
          <Database size={48} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <p className="text-center font-semibold text-indigo-700 dark:text-indigo-300">
            Database (MongoDB)
          </p>
        </motion.div>
      </div>

      {/* Stage Details */}
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
          {steps[stage].title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm max-w-3xl mx-auto leading-relaxed">
          {steps[stage].description}
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={stage === 0}
          className={`px-5 py-2 rounded-lg text-white font-medium transition ${
            stage === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={stage === steps.length - 1}
          className={`px-5 py-2 rounded-lg text-white font-medium transition ${
            stage === steps.length - 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Next →
        </button>
      </div>

      {/* Connection Arrows (animated for request/response) */}
      {stage >= 1 && stage <= 4 && (
        <motion.div
          className="mt-10 text-center text-indigo-600 dark:text-indigo-300 font-mono text-sm"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {stage < 4 ? "⬆️ Request traveling to server..." : "⬇️ Response sent back to client!"}
        </motion.div>
      )}
    </div>
  );
}
