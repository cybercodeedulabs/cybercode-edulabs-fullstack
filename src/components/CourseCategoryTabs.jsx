// src/components/ui/CourseCategoryTabs.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import lessonsData from "../data/lessonsData";

const defaultCourseCategories = {
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


// COURSE CARD
function CourseCard({ title, slug, description, isEnrolled, onEnroll }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between h-full"
    >
      <div>
        <Link
          to={`/courses/${slug}`}
          className="text-indigo-600 dark:text-indigo-400 text-lg font-semibold hover:underline"
        >
          {title}
        </Link>

        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {isEnrolled ? (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
            Enrolled ✓
          </span>
        ) : (
          <button
            onClick={() => onEnroll(slug)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm shadow"
          >
            Enroll
          </button>
        )}

        <Link
          to={`/courses/${slug}`}
          className="text-xs text-gray-600 dark:text-gray-300 underline hover:text-indigo-600"
        >
          View details →
        </Link>
      </div>
    </motion.div>
  );
}


// MAIN COMPONENT
export default function CourseCategoryTabs() {
  const courseCategories = useMemo(() => defaultCourseCategories, []);
  const categories = useMemo(() => Object.keys(courseCategories), [courseCategories]);

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });

  const tabsContainerRef = useRef(null);
  const tabRefs = useRef([]);

  const { user, enrolledCourses = [], enrollInCourse } = useUser();
  const navigate = useNavigate();

  // FIXED EFFECT
  useEffect(() => {
    const idx = categories.indexOf(activeCategory);
    const activeTab = tabRefs.current[idx];

    if (activeTab && tabsContainerRef.current) {
      const containerRect = tabsContainerRef.current.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      setUnderlineStyle({
        width: tabRect.width,
        left: tabRect.left - containerRect.left,
      });
    }
  }, [activeCategory, categories.length]); // <— SAFE DEPENDENCIES

  const handleEnroll = (slug) => {
    if (!user) return navigate("/register");

    enrollInCourse(slug);

    const courseLessons = lessonsData?.[slug] || [];
    const firstLessonSlug = courseLessons[0]?.slug;

    if (firstLessonSlug) navigate(`/courses/${slug}/lessons/${firstLessonSlug}`);
    else navigate(`/courses/${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* CATEGORY TABS */}
      <div
        ref={tabsContainerRef}
        className="relative flex flex-wrap justify-center gap-3 mb-10 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar"
      >
        {categories.map((category, idx) => (
          <button
            key={category}
            ref={(el) => (tabRefs.current[idx] = el)}
            onClick={() => setActiveCategory(category)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-md ${
              activeCategory === category
                ? "text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-900"
                : "text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            {category}
          </button>
        ))}

        <span
          className="absolute bottom-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${underlineStyle.width}px`,
            left: `${underlineStyle.left}px`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.4 }}
        >
          {courseCategories[activeCategory].map((course) => (
            <CourseCard
              key={course.slug}
              {...course}
              isEnrolled={enrolledCourses.includes(course.slug)}
              onEnroll={handleEnroll}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
