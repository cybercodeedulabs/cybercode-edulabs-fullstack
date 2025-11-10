// src/App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";

import ScrollToTop from "./components/ScrollToTop";
import VoiceWelcome from "./components/VoiceWelcome";
import CookieBanner from "./components/CookieBanner";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CourseCategoryTabs from "./components/CourseCategoryTabs";
import FeatureItem from "./components/FeatureItem";
import RegistrationCTA from "./components/RegistrationCTA";
import CourseDetail from "./components/CourseDetail";
import Courses from "./pages/Courses";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LessonDetail from "./components/LessonDetail";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";

// ✅ Legal & Cloud pages
import CybercodeCloudModule from "./pages/CybercodeCloud";
import CloudDashboard from "./pages/CloudDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import RefundPolicy from "./pages/RefundPolicy";
import LegalIndex from "./pages/LegalIndex";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Payment from "./pages/Payment";

// ✅ IAM Auth Pages
import SignInIAM from "./pages/SignInIAM";
import RegisterIAM from "./pages/RegisterIAM";

// ✅ Global contexts
import { useUser } from "./contexts/UserContext";
import { useIAM } from "./contexts/IAMContext";

// ✅ Cloud Placeholder Pages
const CloudPlaceholder = ({ title, description }) => (
  <div className="cloud-console p-12 text-center">
    <h1 className="text-4xl font-bold mb-4 text-sky-600">{title}</h1>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

// Wrapper components for simplicity
const CloudFeatures = () => (
  <CloudPlaceholder
    title="C3 Cloud Features"
    description="Explore scalable dev labs, sandboxed IDEs, and AI-managed infrastructure."
  />
);
const CloudMobile = () => (
  <CloudPlaceholder
    title="C3 Cloud Mobile"
    description="Manage environments and monitor workloads directly from your phone."
  />
);
const CloudFaqs = () => (
  <CloudPlaceholder
    title="C3 Cloud FAQs"
    description="Find answers to common questions about Cybercode’s C3 Cloud."
  />
);
const CloudPricing = () => (
  <CloudPlaceholder
    title="C3 Cloud Pricing"
    description="Compare Student, Edu+, and Startup tiers for your C3 Cloud plan."
  />
);
const CloudContact = () => (
  <CloudPlaceholder
    title="Contact C3 Cloud"
    description="Reach our C3 Cloud team for enterprise or academic onboarding."
  />
);
const CloudSupport = () => (
  <CloudPlaceholder
    title="C3 Cloud Support"
    description="Need help? Submit a ticket or visit your IAM console support section."
  />
);

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useUser();
  const { iamUser, loading } = useIAM();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // ✅ Protected IAM route for Cloud Console
  function ProtectedIAMRoute({ children }) {
    if (loading) return null;
    if (!iamUser) return <Navigate to="/cloud/login" replace />;
    return children;
  }

  // ✅ Homepage Component
  const HomePage = () => (
    <>
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/images/hero-banner.png')" }}
        ></div>
        <div className="relative z-10 px-6 py-32 max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Your Career with Real-Time Learning
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Learn high-demand tech skills from industry experts and earn
            certifications through real-world projects.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-base font-medium shadow transition"
                >
                  👋 Welcome, {user.name?.split(" ")[0]} — Go to Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-lg text-base font-medium shadow transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-base font-medium shadow transition"
                >
                  🚀 Explore Courses
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-white text-gray-800 hover:bg-gray-100 rounded-lg text-base font-medium shadow transition"
                >
                  📝 Register Now
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <section id="courses" className="py-16 bg-white dark:bg-gray-950">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Courses by Category
        </h2>
        <CourseCategoryTabs />
      </section>

      <section className="bg-gray-100 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Why Choose Cybercode EduLabs?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureItem
              icon="projects"
              title="Real-Time Projects"
              description="Work on industry-grade projects to gain practical experience."
            />
            <FeatureItem
              icon="exposure"
              title="Corporate Exposure"
              description="Collaborate with corporate teams and improve job-readiness."
            />
            <FeatureItem
              icon="training"
              title="Job-Focused Training"
              description="Courses tailored to in-demand job skills and career paths."
            />
            <FeatureItem
              icon="certificate"
              title="Experience Certificate"
              description="Get certified and boost your resume with real experience."
            />
          </div>
        </div>
      </section>

      <div id="register">
        <RegistrationCTA />
      </div>
    </>
  );

  // ✅ Main Render
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 flex flex-col">
        <VoiceWelcome />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-grow">
          <ScrollToTop />
          <Routes>
            {/* 🔹 Main site */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseSlug" element={<CourseDetail />} />
            <Route
              path="/courses/:courseSlug/lessons/:lessonSlug"
              element={<LessonDetail />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* 🔹 Cloud (Public + IAM Protected) */}
            <Route path="/cloud" element={<CybercodeCloudModule />} />
            <Route path="/cloud/login" element={<SignInIAM />} />
            <Route path="/cloud/register" element={<RegisterIAM />} />
            <Route
              path="/cloud/dashboard"
              element={
                <ProtectedIAMRoute>
                  <CloudDashboard />
                </ProtectedIAMRoute>
              }
            />
            <Route
  path="/cloud/deploy"
  element={
    <ProtectedIAMRoute>
      <CloudDeploy />
    </ProtectedIAMRoute>
  }
/>


            {/* 🔹 C3 Cloud subpages */}
            <Route path="/cloud/features" element={<CloudFeatures />} />
            <Route path="/cloud/mobile" element={<CloudMobile />} />
            <Route path="/cloud/faqs" element={<CloudFaqs />} />
            <Route path="/cloud/pricing" element={<CloudPricing />} />
            <Route path="/cloud/contact" element={<CloudContact />} />
            <Route path="/cloud/support" element={<CloudSupport />} />

            {/* 🔹 Legal & Support */}
            <Route path="/legal" element={<LegalIndex />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/cookie" element={<CookiePolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
            <Route path="/payment" element={<Payment />} />

            {/* 🔹 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <CookieBanner />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
