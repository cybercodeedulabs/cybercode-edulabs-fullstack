// src/pages/Projects.jsx
import { Link } from "react-router-dom";

const mockProjects = [
  {
    id: 1,
    title: "AI Chatbot for Customer Support",
    description:
      "Developed using Python, FastAPI, and OpenAI for a retail client to automate responses, reduce support costs, and improve satisfaction.",
    image: "/images/project-ai-chatbot.png",
  },
  {
    id: 2,
    title: "DevOps CI/CD Pipeline with Jenkins",
    description:
      "Built a production-grade CI/CD pipeline using Docker, Jenkins, and Kubernetes to automate deployments for enterprise environments.",
    image: "/images/project-devops-pipeline.png",
  },
  {
    id: 3,
    title: "AWS Cloud Lab Infrastructure",
    description:
      "Created a Terraform-powered AWS lab for learners to practice infrastructure-as-code and multi-tier cloud deployments safely.",
    image: "/images/project-aws-lab.png",
  },
  {
    id: 4,
    title: "Machine Learning Model Deployment",
    description:
      "Deployed real-time ML inference APIs using AWS Lambda and API Gateway, optimizing compute cost and scalability for analytics workloads.",
    image: "/images/project-ml-deploy.png",
  },
  {
    id: 5,
    title: "IoT Edge Monitoring Dashboard",
    description:
      "Designed an IoT monitoring interface integrating Raspberry Pi and AWS IoT Core for real-time environmental data visualization.",
    image: "/images/project-iot-dashboard.png",
  },
  {
    id: 6,
    title: "Secure DevSecOps Pipeline",
    description:
      "Implemented vulnerability scanning, SAST, and IaC checks into CI/CD pipelines ensuring security compliance from code to deploy.",
    image: "/images/project-devsecops.png",
  },
];

export default function Projects() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
          Real-Time Projects Showcase
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Explore the innovative, cloud-native, and AI-driven projects delivered by our
          learners and partner teams at <span className="font-semibold">Cybercode EduLabs</span>.
        </p>
      </div>

      {/* Project Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <div
            key={project.id}
            className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300"
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
            <div className="p-6 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* CTA */}
              <div className="pt-3">
                <Link
                  to="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
                >
                  View Details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center mt-16">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          🚀 More live & collaborative projects launching soon under{" "}
          <span className="font-semibold">Cybercode EduLabs Real-Time Labs</span>.
        </p>
      </div>
    </section>
  );
}
