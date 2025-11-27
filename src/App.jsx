// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";

import AIAssistant from "./components/AIAssistant";

import ScrollToTop from "./components/ScrollToTop";
import VoiceWelcome from "./components/VoiceWelcome";
import CookieBanner from "./components/CookieBanner";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CourseCategoryTabs from "./components/CourseCategoryTabs";
import FeatureItem from "./components/FeatureItem";
import RegistrationCTA from "./components/RegistrationCTA";

import CourseDetail from "./components/CourseDetail";
import LessonDetail from "./components/LessonDetail";

import Courses from "./pages/Courses";
import Register from "./pages/Register";
import DemoClass from "./pages/DemoClass";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Labs from "./pages/Labs";
import Enroll from "./pages/Enroll";
import AdminWaitlist from "./pages/AdminWaitlist";
import Pricing from "./pages/Pricing";
import EditProfile from "./pages/EditProfile";

import GoalSetupWizard from "./pages/GoalSetupWizard";
import RoadmapPage from "./pages/RoadmapPage"; // NEW

// Legal & Cloud pages
import CybercodeCloud from "./pages/CybercodeCloud";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import RefundPolicy from "./pages/RefundPolicy";
import LegalIndex from "./pages/LegalIndex";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Payment from "./pages/Payment";

import { useUser } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Podcast from "./pages/Podcast";
import Community from "./pages/Community";
import StudentProjects from "./pages/StudentProjects";
import PodcastEpisode from "./pages/PodcastEpisode";
import Testimonials from "./components/Testimonials";
import CertificatePage from "./pages/CertificatePage";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const HomePage = () => {
    const { user, logout } = useUser();

    return (
      <>
        {/* HERO SECTION (unchanged) */}
        <section className="relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/images/hero-banner.png')" }}></div>
          <div className="relative z-10 px-6 py-32 max-w-7xl mx-auto text-center">
            <motion.h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              Learn. Build. Deploy.<br />
              <span className="text-indigo-400">All in One Tech Ecosystem.</span>
            </motion.h1>

            <motion.p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              Cybercode EduLabs trains India’s next-gen engineers, while Cybercode Cloud delivers India’s first developer-focused cloud platform — built for real innovation.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.6 }}>
              {user ? (
                <>
                  <Link to="/dashboard" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white shadow-lg text-lg">👋 Welcome {user.name?.split(" ")[0]} — Dashboard</Link>
                  <button onClick={logout} className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white shadow-lg text-lg">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/courses" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white shadow-lg text-lg">Explore Courses</Link>
                  <Link to="/demo" className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-200 rounded-lg shadow text-lg">Free Demo Class</Link>
                  <Link to="/register" className="px-8 py-3 bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 rounded-lg text-lg flex items-center gap-2">
                    <img src="/images/google.svg" className="w-5 h-5" />
                    Sign in with Google
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* Remaining home content unchanged */}
        <section className="py-16 bg-gray-100 dark:bg-gray-900 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">☁️ Introducing Cybercode Cloud</h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">India’s first indigenous cloud platform built for developers, startups, and enterprises. Fast, scalable, secure — and designed to empower you.</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/cloud" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow">Explore Cloud Platform</Link>
                <Link to="/cloud" className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow">Join Waitlist</Link>
              </div>
            </div>

            <img src="/images/cloud-illustration.png" alt="Cloud Platform" className="rounded-lg shadow-lg" />
          </div>
        </section>

        <section id="courses" className="py-20 bg-white dark:bg-gray-950">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Explore Courses by Category</h2>
          <CourseCategoryTabs />
        </section>

        <section className="bg-gray-100 dark:bg-gray-900 py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-14 tracking-tight">The Cybercode Advantage</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureItem icon="ai" title="AI-Powered Smart Learning" description="AI-driven learning support that assists you through concepts, workflows, and real production scenarios." />
              <FeatureItem icon="cloud" title="Hands-On Cloud Labs" description="Practice on real cloud infrastructure powered by Cybercode Cloud — VMs, containers, networks and more." />
              <FeatureItem icon="projects" title="Real-Time Project Experience" description="Industry-grade workflows that match real DevOps, cloud, and developer environments." />
              <FeatureItem icon="training" title="Career-Focused Training Path" description="Every course is structured for actual job roles, interviews, and real production tasks." />
            </div>
          </div>
        </section>

        <Testimonials />
        <div id="register"><RegistrationCTA /></div>
      </>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 flex flex-col">
        <VoiceWelcome />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-grow">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/demo" element={<DemoClass />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/podcast/:id" element={<PodcastEpisode />} />
            <Route path="/community" element={<Community />} />
            <Route path="/student-projects" element={<StudentProjects />} />
            <Route path="/edit-profile" element={<EditProfile />} />

            <Route path="/courses/:courseSlug" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<ProtectedRoute><LessonDetail /></ProtectedRoute>} />
            <Route path="/certificate/:courseSlug" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
            <Route path="/pricing" element={<Pricing />} />

            <Route path="/register" element={<Register />} />
            <Route path="/labs" element={<ProtectedRoute><Labs /></ProtectedRoute>} />
            <Route path="/enroll/:courseSlug" element={<ProtectedRoute><Enroll /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} /> {/* NEW */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cloud" element={<CybercodeCloud />} />
            <Route path="/admin/waitlist" element={<AdminWaitlist />} />
            <Route path="/legal" element={<LegalIndex />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/cookie" element={<CookiePolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
            <Route path="/payment" element={<Payment />} />

            <Route path="/set-goals" element={<ProtectedRoute><GoalSetupWizard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <CookieBanner />
        <Footer />
        <AIAssistant /> {/* floating assistant available site-wide */}
      </div>
    </Router>
  );
}

export default App;
