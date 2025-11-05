// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
import CybercodeCloud from "./pages/CybercodeCloud";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import RefundPolicy from "./pages/RefundPolicy";
import LegalIndex from "./pages/LegalIndex";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";


function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // ✅ Home Page Component
  const HomePage = () => (
    <>
      {/* Hero Section */}
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
            Learn high-demand tech skills from industry experts and earn certifications through real-world projects.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
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
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 rounded-lg text-base font-medium shadow transition gap-2"
            >
              <img src="/images/google.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Course Categories */}
      <section id="courses" className="py-16 bg-white dark:bg-gray-950">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Courses by Category
        </h2>
        <CourseCategoryTabs />
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Why Choose Cybercode EduLabs?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureItem icon="projects" title="Real-Time Projects" description="Work on industry-grade projects to gain practical experience." />
            <FeatureItem icon="exposure" title="Corporate Exposure" description="Collaborate with corporate teams and improve job-readiness." />
            <FeatureItem icon="training" title="Job-Focused Training" description="Courses tailored to in-demand job skills and career paths." />
            <FeatureItem icon="certificate" title="Experience Certificate" description="Get certified and boost your resume with real experience." />
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <div id="register">
        <RegistrationCTA />
      </div>
    </>
  );

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 flex flex-col">
        <VoiceWelcome />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-grow">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseSlug" element={<CourseDetail />} />
            <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cloud" element={<CybercodeCloud />} />
            <Route path="/legal" element={<LegalIndex />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/cookie" element={<CookiePolicy />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/support" element={<Support />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* ✅ Cookie Banner placed globally */}
        <CookieBanner />

        <Footer />
      </div>
    </Router>
  );
}

export default App;
