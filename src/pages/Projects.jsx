// src/pages/Projects.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AIProjectGeneratorModal from "../components/AIProjectGeneratorModal";

// ===============================
//  CYBERCODE OFFICIAL PROJECTS
// ===============================
const officialProjects = [
  {
    id: 1,
    title: "AI Chatbot for Customer Support",
    description:
      "Python + FastAPI chatbot integrated with OpenAI to automate retail customer support.",
    image: "/images/project-ai-chatbot.png",
    category: "AI / Backend",
  },
  {
    id: 2,
    title: "DevOps CI/CD Pipeline with Jenkins",
    description:
      "Production-grade CI/CD automation using Docker, Jenkins, Kubernetes.",
    image: "/images/project-devops-pipeline.png",
    category: "DevOps",
  },
  {
    id: 3,
    title: "AWS Cloud Lab Infrastructure",
    description:
      "Terraform-powered AWS cloud lab for safe infra practice environments.",
    image: "/images/project-aws-lab.png",
    category: "Cloud / Terraform",
  },
  {
    id: 4,
    title: "Machine Learning Model Deployment",
    description:
      "Serverless real-time ML inference deployed using AWS Lambda & API Gateway.",
    image: "/images/project-ml-deploy.png",
    category: "AI / Cloud",
  },
  {
    id: 5,
    title: "IoT Edge Monitoring Dashboard",
    description:
      "IoT dashboard with Raspberry Pi + AWS IoT Core for realtime monitoring.",
    image: "/images/project-iot-dashboard.png",
    category: "IoT",
  },
  {
    id: 6,
    title: "Secure DevSecOps Pipeline",
    description:
      "SAST, IaC scanning, vulnerability detection integrated into CI/CD.",
    image: "/images/project-devsecops.png",
    category: "DevSecOps",
  },
];

// ===============================
//  MAIN PAGE
// ===============================
export default function Projects() {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-gray-800 dark:text-gray-200">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
            Real-Time Projects Showcase
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg leading-relaxed">
            Explore <span className="font-semibold">Cybercode EduLabs</span>’ official projects...
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowGenerator(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Generate Project (AI)
          </button>

          <Link
            to="/student-projects"
            className="px-4 py-2 bg-white border dark:bg-gray-800 dark:border-gray-700 text-indigo-600 rounded-lg shadow-sm"
          >
            Student Projects
          </Link>
        </div>
      </div>

      {/* AI PROJECT GENERATOR INFO PANEL (NEW — OPTION B) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="
          mb-20 p-6 rounded-2xl shadow border
          bg-gradient-to-r from-indigo-50 to-purple-50
          dark:from-gray-800 dark:to-gray-900 
        "
      >
        <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-3">
          ✨ Introducing S2 Smart Project Blueprints
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Cybercode AI now generates <strong>full engineering blueprints</strong> —
          not just titles and tasks. Students get industry-ready end-to-end project
          specifications that they can build, deploy, and showcase.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-800/40 border dark:border-gray-700">
            <h4 className="font-semibold text-indigo-600 dark:text-indigo-300 mb-1">
              📘 Architecture Blueprint
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              System design, workflow diagrams, and module breakdown.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-800/40 border dark:border-gray-700">
            <h4 className="font-semibold text-indigo-600 dark:text-indigo-300 mb-1">
              🧩 Detailed Components
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Each module explained with responsibilities and interactions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-800/40 border dark:border-gray-700">
            <h4 className="font-semibold text-indigo-600 dark:text-indigo-300 mb-1">
              📝 Step-by-Step Implementation
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Beginner-friendly execution plan with technical depth.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-800/40 border dark:border-gray-700">
            <h4 className="font-semibold text-indigo-600 dark:text-indigo-300 mb-1">
              🚀 Deployment Guide
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cloud, Docker, CI/CD, and scalable deployment options.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-800/40 border dark:border-gray-700">
            <h4 className="font-semibold text-indigo-600 dark:text-indigo-300 mb-1">
              🔐 Security & Testing
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Includes test cases, security checks, and validations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-800/40 border dark:border-gray-700">
            <h4 className="font-semibold text-indigo-600 dark:text-indigo-300 mb-1">
              🎯 Milestones & Timeline
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Structured roadmap for students to complete the project.
            </p>
          </div>
        </div>
      </motion.div>

      {/* OFFICIAL PROJECT GRID */}
      <h2 className="text-2xl font-bold text-indigo-500 dark:text-indigo-400 mb-6">
        ⭐ Cybercode Official Projects
      </h2>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mb-20">
        {officialProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
              border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md 
              hover:shadow-xl hover:-translate-y-2 transition duration-300"
          >
            <div className="overflow-hidden rounded-t-2xl">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="p-6 space-y-3 flex flex-col justify-between">
              <div>
                <span className="inline-block text-xs px-2 py-1 rounded bg-indigo-100 
                  dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 mb-2">
                  {project.category}
                </span>

                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="pt-3">
                <Link
                  to="#"
                  className="inline-flex items-center gap-1 text-sm font-medium 
                    text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
                >
                  View Details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* STUDENT PROJECTS SHOWCASE CTA */}
      <div className="mb-20 text-center">
        <h2 className="text-2xl font-bold text-indigo-500 dark:text-indigo-400 mb-4">
          🎓 Student Project Showcase
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6">
          Explore real projects built by learners using the Cybercode training ecosystem.
        </p>

        <Link
          to="/student-projects"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow 
            text-sm font-semibold transition inline-block"
        >
          View Student Projects →
        </Link>
      </div>

      {/* CTA TO DASHBOARD PROJECTS */}
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Want to Build Your Own Projects?
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
          Track your progress, build new projects, and showcase your work directly inside
          your personalized dashboard.
        </p>

        <Link
          to="/dashboard#projects"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md 
            text-sm font-semibold transition"
        >
          Go to My Projects →
        </Link>
      </div>

      {/* FOOTER NOTE */}
      <div className="text-center mt-16">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          🚀 More live, production-ready projects launching soon under
          <span className="font-semibold"> Cybercode Real-Time Labs</span>.
        </p>
      </div>

      {/* SINGLE AI Project Generator Modal */}
      <AIProjectGeneratorModal
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
      />
    </section>
  );
}
