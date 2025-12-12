// src/App.jsx New frontend
import React, { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { motion } from "framer-motion";

import { ThemeProvider } from "./contexts/ThemeContext";
import { IAMProvider } from "./contexts/IAMContext";   // ⭐ ADDED
import AuthSuccess from "./pages/AuthSuccess";

// Components
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
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Testimonials from "./components/Testimonials";

// Pages
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
import RoadmapPage from "./pages/RoadmapPage";
import CybercodeCloud from "./pages/CybercodeCloud";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import RefundPolicy from "./pages/RefundPolicy";
import LegalIndex from "./pages/LegalIndex";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Payment from "./pages/Payment";
import Podcast from "./pages/Podcast";
import Community from "./pages/Community";
import StudentProjects from "./pages/StudentProjects";
import StudentProjectDetail from "./pages/StudentProjectDetail";
import PodcastEpisode from "./pages/PodcastEpisode";
import CertificatePage from "./pages/CertificatePage";
import CloudDashboard from "./pages/CloudDashboard";
import CloudLogin from "./pages/CloudLogin";
import CloudRegister from "./pages/CloudRegister";
import CloudProtectedRoute from "./components/CloudProtectedRoute";
// Context
import { useUser } from "./contexts/UserContext";

/* SAFE LINK */
function SafeLink({ to, children, ...rest }) {
  if (!to) return <span {...rest}>{children}</span>;
  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
}

/* HEADER / FOOTER WRAPPER */
const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  const hideHeader =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/experiment");

  return (
    <>
      {!hideHeader && <Header />}
      {children}
      <Footer />
    </>
  );
};

/* HOME PAGE */
function HomePage() {
  const ctx = useUser() || { user: null, logout: () => { } };
  const { user, logout } = ctx;

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover opacity-30"
          style={{ backgroundImage: "url('/images/hero-banner.png')" }}
        ></div>

        <div className="relative px-6 py-32 text-center max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Learn. Build. Deploy.
            <br />
            <span className="text-indigo-400">All in One Tech Ecosystem.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Cybercode EduLabs trains India’s next-gen engineers, while
            Cybercode Cloud enables real innovation.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {user ? (
              <>
                <SafeLink
                  to="/dashboard"
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-lg"
                >
                  👋 Welcome {user.name?.split(" ")[0] ?? "User"} — Dashboard
                </SafeLink>
                <button
                  onClick={logout}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white text-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <SafeLink
                  to="/courses"
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-lg"
                >
                  Explore Courses
                </SafeLink>
                <SafeLink
                  to="/demo"
                  className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-200 rounded-lg text-lg"
                >
                  Free Demo Class
                </SafeLink>
                <SafeLink
                  to="/register"
                  className="px-8 py-3 bg-gray-100 text-gray-900 border hover:bg-gray-200 rounded-lg text-lg flex items-center gap-2"
                >
                  <img src="/images/google.svg" className="w-5 h-5" />
                  Sign in with Google
                </SafeLink>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* CLOUD */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold dark:text-white">
              ☁️ Introducing Cybercode Cloud
            </h2>
            <p className="text-lg dark:text-gray-300 leading-relaxed mt-4">
              India’s first indigenous developer-first cloud platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <SafeLink
                to="/cloud"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Explore Cloud Platform
              </SafeLink>
              <SafeLink
                to="/cloud"
                className="px-6 py-3 bg-white dark:bg-gray-800 border dark:border-gray-600 shadow rounded-lg"
              >
                Join Waitlist
              </SafeLink>
            </div>
          </div>

          <img
            src="/images/cloud-illustration.png"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* COURSES */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <h2 className="text-3xl font-bold text-center dark:text-white mb-12">
          Explore Courses by Category
        </h2>
        <CourseCategoryTabs />
      </section>

      {/* FEATURES */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold dark:text-white mb-14">
            The Cybercode Advantage
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureItem
              icon="ai"
              title="AI-Powered Smart Learning"
              description="AI-driven assistance for real-world scenarios."
            />
            <FeatureItem
              icon="cloud"
              title="Hands-On Cloud Labs"
              description="Practice on real cloud infrastructure."
            />
            <FeatureItem
              icon="projects"
              title="Real-Time Project Experience"
              description="Workflows matching production DevOps."
            />
            <FeatureItem
              icon="training"
              title="Career-Focused Training Path"
              description="Designed around real job roles."
            />
          </div>
        </div>
      </section>

      <Testimonials />
      <div id="register">
        <RegistrationCTA />
      </div>
    </>
  );
}

/* -------------------------------------------------
   APP INNER ROUTES
--------------------------------------------------- */
function AppInner() {
  const location = useLocation();
  const [showAI, setShowAI] = useState(false);

  const aiAllowed = [
    "/dashboard",
    "/courses",
    "/courses/",
    "/projects",
    "/student-projects",
    "/labs",
  ];

  useEffect(() => {
    const path = location.pathname || "/";
    const allowed = aiAllowed.some((p) => path.startsWith(p));

    if (allowed) {
      const t = setTimeout(() => setShowAI(true), 300);
      return () => clearTimeout(t);
    } else {
      setShowAI(false);
    }
  }, [location.pathname]);

  return (
    <>
      <LayoutWrapper>
        <main className="flex-grow">
          <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<HomePage />} />
              <Route path="/demo" element={<DemoClass />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/podcast" element={<Podcast />} />
              <Route path="/podcast/:id" element={<PodcastEpisode />} />
              <Route path="/community" element={<Community />} />
              <Route path="/student-projects" element={<StudentProjects />} />
              <Route
                path="/student-projects/:id"
                element={<StudentProjectDetail />}
              />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth-success" element={<AuthSuccess />} />
              <Route path="/cloud/login" element={<CloudLogin />} />
              <Route path="/cloud/register" element={<CloudRegister />} />

              {/* CLOUD */}
              <Route path="/cloud" element={<CybercodeCloud />} />

              <Route
                path="/cloud/dashboard"
                element={
                  <CloudProtectedRoute>
                    <CloudDashboard />
                  </CloudProtectedRoute>
                }
              />

              <Route path="/admin/waitlist" element={<AdminWaitlist />} />
              <Route path="/legal" element={<LegalIndex />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/cookie" element={<CookiePolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              <Route path="/payment" element={<Payment />} />

              {/* COURSES */}
              <Route path="/courses/:courseSlug" element={<CourseDetail />} />

              {/* PROTECTED LESSONS */}
              <Route
                path="/courses/:courseSlug/lessons/:lessonSlug"
                element={
                  <ProtectedRoute>
                    <LessonDetail />
                  </ProtectedRoute>
                }
              />

              {/* CERTIFICATES */}
              <Route
                path="/certificate/:courseSlug"
                element={
                  <ProtectedRoute>
                    <CertificatePage />
                  </ProtectedRoute>
                }
              />

              {/* LABS */}
              <Route
                path="/labs"
                element={
                  <ProtectedRoute>
                    <Labs />
                  </ProtectedRoute>
                }
              />

              {/* ENROLL */}
              <Route path="/enroll/:courseSlug" element={<Enroll />} />

              {/* DASHBOARD */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="roadmap" element={<RoadmapPage />} />
              </Route>

              {/* GOAL SETUP */}
              <Route
                path="/set-goals"
                element={
                  <ProtectedRoute>
                    <GoalSetupWizard />
                  </ProtectedRoute>
                }
              />

              {/* FALLBACK */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <CookieBanner />
      </LayoutWrapper>

      {showAI && <AIAssistant />}
    </>
  );
}

/* -------------------------------------------------
   APP ROOT WITH IAM PROVIDER
--------------------------------------------------- */
function App() {
  return (
    <IAMProvider>               {/* ⭐ FIXED — IAM WRAPS WHOLE APP */}
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <VoiceWelcome />
          <AppInner />
        </Router>
      </ThemeProvider>
    </IAMProvider>
  );
}

export default App;
