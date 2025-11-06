import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const courseCategories = {
  "Programming & Development": [
    { title: "Golang", slug: "golang", description: "Master modern backend development using Go programming." },
    { title: "Python Programming (Job-Focused)", slug: "python-job-focused", description: "Job-oriented Python course with projects and career prep." },
    { title: "Python Programming (Absolute Beginners)", slug: "python-absolute-beginners", description: "Kickstart your coding journey with beginner-friendly Python." },
    { title: "Full-Stack Web Dev", slug: "full-stack-web-dev", description: "Learn front-end, back-end, and databases in one course." },
    { title: "Version Control with Git & GitHub", slug: "version-control-git-github", description: "Master Git for teamwork, history tracking, and open-source." },
    { title: "Microservices with Go and Kubernetes", slug: "microservices-go-kubernetes", description: "Build scalable apps using Go, Docker, and Kubernetes." },
  ],
  "Cloud & DevOps": [
    { title: "AWS Certified Training", slug: "aws-certified-training", description: "Get certified in AWS with hands-on labs and practice tests." },
    { title: "DevOps (Docker & Kubernetes)", slug: "devops-docker-kubernetes", description: "Streamline software delivery with Docker and K8s." },
    { title: "Private Cloud with OpenStack", slug: "private-cloud-openstack", description: "Deploy and manage OpenStack for private cloud solutions." },
    { title: "Terraform & Infrastructure as Code (IaC)", slug: "terraform-iac", description: "Automate infrastructure with Terraform best practices." },
    { title: "Cloud Security & DevSecOps", slug: "cloud-security-devsecops", description: "Secure cloud infrastructure with DevSecOps strategies." },
  ],
  "Data Science & AI": [
    { title: "Python for Data Science & AI", slug: "python-data-science-ai", description: "Analyze data and build AI apps using Python tools." },
    { title: "Machine Learning with AWS", slug: "ml-with-aws", description: "Train and deploy ML models using AWS services." },
  ],
  "Networking & Security": [
    { title: "Cybersecurity Essentials for All", slug: "cybersecurity-essentials", description: "Stay safe online and learn cybersecurity basics." },
    { title: "Introduction to Networking (CCNA)", slug: "networking-ccna", description: "Learn CCNA-level networking and protocols." },
    { title: "Linux Essentials for SysAdmins", slug: "linux-essentials", description: "Essential Linux skills for system administrators." },
    { title: "Basics of Cloud Computing (AWS or AZURE)", slug: "basics-cloudcom", description: "Understand fundamentals of cloud platforms with guided labs." },
  ],
  "Hands-on Labs & Practice": [
    { title: "Home Lab Setup for Cloud Practice", slug: "home-lab-setup-cloud-practice", description: "Build your own cloud lab environment at home." },
    { title: "Real-Time Projects", slug: "real-time-projects", description: "Get real-world project experience for your resume." },
  ],
};

function CourseCard({ title, slug, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between h-full"
    >
      <Link
        to={`/courses/${slug}`}
        className="text-indigo-600 dark:text-indigo-400 text-lg font-semibold hover:underline"
      >
        {title}
      </Link>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}

export default function CourseCategoryTabs() {
  const categories = Object.keys(courseCategories);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const tabRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const activeTab = tabRefs.current[categories.indexOf(activeCategory)];
    const container = containerRef.current;
    if (activeTab && container) {
      const { offsetWidth, offsetLeft } = activeTab;
      const scrollLeft = container.scrollLeft;
      setUnderlineStyle({
        width: offsetWidth,
        left: offsetLeft - scrollLeft,
      });
    }
  }, [activeCategory, categories]);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Tabs */}
      <div
        ref={containerRef}
        className="relative flex flex-nowrap justify-center items-center gap-3 mb-10 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto no-scrollbar"
      >
        {categories.map((category, idx) => (
          <button
            key={category}
            ref={(el) => (tabRefs.current[idx] = el)}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-md whitespace-nowrap ${
              activeCategory === category
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            {category}
          </button>
        ))}

        {/* Fixed underline alignment */}
        <motion.span
          className="absolute bottom-[-2px] h-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-full"
          animate={{ width: underlineStyle.width, x: underlineStyle.left }}
          transition={{ duration: 0.35 }}
        />
      </div>

      {/* Animated Course Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {courseCategories[activeCategory].map((course) => (
            <CourseCard key={course.slug} {...course} />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
