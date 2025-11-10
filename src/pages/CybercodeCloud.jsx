// src/pages/CybercodeCloud.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

// =============================
// LANDING SECTION
// =============================
function CloudLanding() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-200/60 to-white opacity-95"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12"
      >
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            C3 Cloud
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            C3 Cloud — Cybercode EduLabs’ managed education cloud. Launch secure
            dev workspaces, host student labs, and run projects in isolated,
            cost-effective environments built for learning and experimentation.
          </p>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
            <Button
              onClick={() => navigate("/cloud/login")}
              className="px-6 py-3 text-sm"
            >
              🚀 Launch Console
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/cloud/pricing")}
              className="px-6 py-3 text-sm"
            >
              💰 Explore Pricing
            </Button>
          </div>
        </div>

        {/* Right Illustration */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="lg:w-1/2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl cursor-pointer hover:shadow-sky-200/40 dark:hover:shadow-sky-800/40 transition"
          onClick={() => navigate("/cloud/login")}
        >
          <h4 className="text-lg font-semibold text-sky-700 dark:text-sky-300 text-center">
            One-click Labs
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Open IDEs, deploy containers, and host projects with a single click.
          </p>
          <div className="mt-6 flex justify-center">
            <img
              src="/images/cloud-startup.png"
              alt="C3 Cloud Illustration"
              className="w-72 h-auto object-contain drop-shadow-lg"
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Tier Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 -mt-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Student Tier",
              desc: "1 vCPU • 512MB RAM • 5GB storage • Free forever",
              plan: "student",
            },
            {
              name: "Edu+ Tier",
              desc: "2 vCPU • 2GB RAM • 25GB storage • 1-year validity",
              plan: "edu",
            },
            {
              name: "Startup Tier",
              desc: "4 vCPU • 8GB RAM • 100GB SSD • Scalable workspace",
              plan: "startup",
              badge: "NEW",
            },
          ].map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate("/cloud/deploy", { state: { plan: tier.plan } })}
              className="cursor-pointer"
            >
              <Card className="relative border border-slate-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-200">
                <CardContent className="p-5">
                  {tier.badge && (
                    <span className="absolute top-3 right-4 text-xs font-semibold text-sky-700 dark:text-sky-300">
                      {tier.badge}
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-gray-500">{tier.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================
// USAGE SECTION (overview only)
// =============================
function CloudUsage() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    // static placeholder (mockCloudAPI handles real data)
    setUsage({ cpuUsed: 3, cpuQuota: 8, storageUsed: 20, storageQuota: 100 });
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 pb-20">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-sky-300 mb-6">
        Usage & Quota
      </h3>
      {!usage ? (
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Loading usage data…
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg">
            <CardContent>
              <p className="text-sm text-gray-500">CPU (vCPU)</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {usage.cpuUsed} / {usage.cpuQuota}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg">
            <CardContent>
              <p className="text-sm text-gray-500">Storage (GB)</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {usage.storageUsed} / {usage.storageQuota}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}

// =============================
// TOP NAV (public only)
// =============================
function C3TopNav() {
  const navigate = useNavigate();

  return (
    <header className="relative z-50">
      {/* Top dark strip */}
      <div className="bg-slate-900 text-slate-100 text-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="C3 logo"
                className="h-6 w-6 rounded"
              />
              <strong className="ml-1">C3 Cloud</strong>
            </span>
            <span className="hidden sm:inline">India</span>
            <span className="hidden md:inline">• Education • Secure Labs</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              className="hover:underline"
              onClick={() => navigate("/contact")}
            >
              Contact us
            </button>
            <button
              className="hover:underline"
              onClick={() => navigate("/support")}
            >
              Support
            </button>
            <Button
              onClick={() => navigate("/cloud/login")}
              className="px-3 py-1 text-sm"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>

      {/* White nav container with tabs */}
      <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-b-2xl -mt-4">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/images/logo.png"
                alt="C3 logo"
                className="h-10 w-10 rounded"
              />
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  C3 Cloud
                </div>
                <div className="text-xs text-gray-500">Console</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <nav className="flex gap-6 items-center">
                {["overview", "features", "mobile", "faq"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => navigate(`/cloud/${tab}`)}
                    className="pb-2 border-b-4 border-transparent hover:border-slate-900 text-sm transition-all"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// =============================
// MAIN EXPORT
// =============================
export default function CybercodeCloudModule() {
  const location = useLocation();
  const [current, setCurrent] = useState("landing");

  useEffect(() => {
    if (location.pathname.includes("/cloud")) setCurrent("landing");
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950">
      <C3TopNav />
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CloudLanding />
      </motion.div>
      <CloudUsage />
    </div>
  );
}
