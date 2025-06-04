import { useState } from "react";
import { Link } from "react-router-dom";

const courseCategories = {
  "Programming & Development": [
    {
      title: "Golang",
      slug: "golang",
      description: "Master modern backend development using Go programming.",
    },
    {
      title: "Python Programming (Job-Focused)",
      slug: "python-job-focused",
      description: "Job-oriented Python course with projects and career prep.",
    },
    {
      title: "Python Programming (Absolute Beginners)",
      slug: "python-absolute-beginners",
      description: "Kickstart your coding journey with beginner-friendly Python.",
    },
    {
      title: "Full-Stack Web Dev",
      slug: "full-stack-web-dev",
      description: "Learn front-end, back-end, and databases in one course.",
    },
    {
      title: "Version Control with Git & GitHub",
      slug: "version-control-git-github",
      description: "Master Git for teamwork, history tracking, and open-source.",
    },
    {
      title: "Microservices with Go and Kubernetes",
      slug: "microservices-go-kubernetes",
      description: "Build scalable apps using Go, Docker, and Kubernetes.",
    },
  ],
  "Cloud & DevOps": [
    {
      title: "AWS Certified Training",
      slug: "aws-certified-training",
      description: "Get certified in AWS with hands-on labs and practice tests.",
    },
    {
      title: "DevOps (Docker & Kubernetes)",
      slug: "devops-docker-kubernetes",
      description: "Streamline software delivery with Docker and K8s.",
    },
    {
      title: "Private Cloud with OpenStack",
      slug: "private-cloud-openstack",
      description: "Deploy and manage OpenStack for private cloud solutions.",
    },
    {
      title: "Terraform & Infrastructure as Code (IaC)",
      slug: "terraform-iac",
      description: "Automate infrastructure with Terraform best practices.",
    },
    {
      title: "Cloud Security & DevSecOps",
      slug: "cloud-security-devsecops",
      description: "Secure cloud infrastructure with DevSecOps strategies.",
    },
  ],
  "Data Science & AI": [
    {
      title: "Python for Data Science & AI",
      slug: "python-data-science-ai",
      description: "Analyze data and build AI apps using Python tools.",
    },
    {
      title: "Machine Learning with AWS",
      slug: "ml-with-aws",
      description: "Train and deploy ML models using AWS services.",
    },
  ],
  "Networking & Security": [
    {
      title: "Cybersecurity Essentials for All",
      slug: "cybersecurity-essentials",
      description: "Stay safe online and learn cybersecurity basics.",
    },
    {
      title: "Introduction to Networking (CCNA)",
      slug: "networking-ccna",
      description: "Learn CCNA-level networking and protocols.",
    },
    {
      title: "Linux Essentials for SysAdmins",
      slug: "linux-essentials",
      description: "Essential Linux skills for system administrators.",
    },
    {
    title: "Basics of Cloud Computing (AWS or AZURE)",
    slug: "basics-cloudcom",
    category: "Networking & Security",
    description: "Understand the fundamentals of cloud platforms with guided labs on AWS and Azure.",
  },
  ],
  "Hands-on Labs & Practice": [
    {
      title: "Home Lab Setup for Cloud Practice",
      slug: "home-lab-setup-cloud-practice",
      description: "Build your own cloud lab environment at home.",
    },
    {
      title: "Real-Time Projects",
      slug: "real-time-projects",
      description: "Get real-world project experience for your resume.",
    },
  ],
};

function CourseCard({ title, slug, description }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all p-6">
      <Link
        to={`/courses/${slug}`}
        className="text-indigo-600 dark:text-indigo-300 text-lg font-semibold hover:underline"
      >
        {title}
      </Link>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default function CourseCategoryTabs() {
  const categories = Object.keys(courseCategories);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition border ${
              activeCategory === category
                ? "bg-indigo-600 text-white border-indigo-600 shadow"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courseCategories[activeCategory].map((course) => (
          <CourseCard
            key={course.slug}
            title={course.title}
            slug={course.slug}
            description={course.description}
          />
        ))}
      </div>
    </div>
  );
}
