import { Link } from "react-router-dom";

const mockProjects = [
  {
    id: 1,
    title: "AI Chatbot for Customer Support",
    description: "Built using Python, FastAPI, and OpenAI for a retail client to handle support queries.",
    image: "/images/project-ai-chatbot.png",
  },
  {
    id: 2,
    title: "DevOps CI/CD Pipeline with Jenkins",
    description: "Implemented CI/CD with Docker, Jenkins, and Kubernetes for a finance client.",
    image: "/images/project-devops-pipeline.png",
  },
  {
    id: 3,
    title: "Cloud Lab for AWS Hands-On",
    description: "Deployed cloud infrastructure on AWS for a student learning lab using Terraform.",
    image: "/images/project-aws-lab.png",
  },
];

export default function Projects() {
  return (
    <div className="px-4 py-16 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 text-center mb-10">
        Real-Time Projects Showcase
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg overflow-hidden transition"
          >
            <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
  <img
    src={project.image}
    alt={project.title}
    className="w-full h-full object-contain"
  />
</div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                {project.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                {project.description}
              </p>
              <div className="mt-4">
                <Link
                  to="#"
                  className="text-sm text-indigo-500 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
