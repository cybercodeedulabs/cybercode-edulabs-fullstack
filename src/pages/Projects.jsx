// src/pages/Projects.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-gray-800 dark:text-gray-200">

      {/* ===========================
          HEADER
      ============================ */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
          Real-Time Projects Showcase
        </h1>

        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Explore <span className="font-semibold">Cybercode EduLabs</span>
          ’ official projects and discover student creations across AI, Cloud,
          DevOps, Security, and Full-Stack Engineering.
        </p>
      </div>

      {/* ===========================
          OFFICIAL PROJECT GRID
      ============================ */}
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
            {/* Image */}
            <div className="overflow-hidden rounded-t-2xl">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Card Content */}
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

      {/* ===========================
          STUDENT PROJECTS SHOWCASE
      ============================ */}
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

      {/* ===========================
          CTA TO DASHBOARD PROJECTS
      ============================ */}
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

      {/* ===========================
          FOOTER NOTE
      ============================ */}
      <div className="text-center mt-16">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          🚀 More live, production-ready projects launching soon under  
          <span className="font-semibold"> Cybercode Real-Time Labs</span>.
        </p>
      </div>
    </section>
  );
}
