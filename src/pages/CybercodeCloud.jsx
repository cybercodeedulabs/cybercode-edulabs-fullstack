// src/pages/CybercodeCloud.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectItem } from "../components/ui/select";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const api = {
  createInstance: "/api/cloud/instances",
  listInstances: "/api/cloud/instances",
  getUsage: "/api/cloud/usage",
};

// =============================
// LANDING SECTION
// =============================
function CloudLanding({ onLaunch, onSelectPlan }) {
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
            <Button onClick={onLaunch} className="px-6 py-3 text-sm">
              🚀 Launch Console
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open("/pricing", "_self")}
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
          onClick={onLaunch}
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
              onClick={() => onSelectPlan(tier.plan)}
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
// CONSOLE SECTION
// =============================
function CloudConsole({ onCreate }) {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstances();
  }, []);

  async function fetchInstances() {
    setLoading(true);
    try {
      const res = await fetch(api.listInstances);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setInstances(data.instances || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-sky-300">
          My C3 Console
        </h2>
        <Button onClick={onCreate} className="hover:shadow-md transition">
          + New Workspace
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Loading instances…
        </p>
      ) : instances.length === 0 ? (
        <Card className="p-6 text-center text-gray-500 dark:text-gray-400 shadow-inner">
          No active instances. Create one to get started.
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {instances.map((ins) => (
            <motion.div key={ins.id} whileHover={{ scale: 1.02 }}>
              <Card className="hover:shadow-xl transition">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {ins.name || ins.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {ins.plan || "Student"} • {ins.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="hover:scale-105">
                        <a href={ins.url} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="hover:scale-105"
                      >
                        Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

// =============================
// DEPLOY SECTION
// =============================
function CloudDeploy({ onSuccess, preselectedPlan }) {
  const [gitUrl, setGitUrl] = useState("");
  const [plan, setPlan] = useState(preselectedPlan || "student");
  const [creating, setCreating] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(api.createInstance, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gitUrl, plan }),
      });
      if (!res.ok) throw new Error("Create failed");
      const data = await res.json();
      onSuccess && onSuccess(data.instance);
    } catch (err) {
      console.error(err);
      alert("Failed to create workspace. Check console.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <Card className="shadow-2xl bg-white/90 dark:bg-gray-900/70 backdrop-blur-sm hover:shadow-sky-200/40 dark:hover:shadow-sky-800/40 transition">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-sky-300">
            Create a Cloud Workspace
          </h3>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Git Repository (optional)
              </label>
              <Input
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                placeholder="https://github.com/your/repo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Plan</label>
              <Select value={plan} onChange={(e) => setPlan(e.target.value)}>
                <SelectItem value="student" label="Student (free)" />
                <SelectItem value="edu" label="Edu+" />
                <SelectItem value="startup" label="Startup" />
              </Select>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={creating}>
                {creating ? "Creating…" : "Create Workspace"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setGitUrl("")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

// =============================
// USAGE SECTION
// =============================
function CloudUsage() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    fetch(api.getUsage)
      .then((r) => r.json())
      .then((d) => setUsage(d))
      .catch(console.error);
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
// TOP NAV
// =============================
function C3TopNav({ onNav }) {
  const navigate = useNavigate();

  return (
    <header className="relative z-50">
      {/* Top dark strip */}
      <div className="bg-slate-900 text-slate-100 text-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <img src="/images/logo.png" alt="C3 logo" className="h-6 w-6 rounded" />
              <strong className="ml-1">C3 Cloud</strong>
            </span>
            <span className="hidden sm:inline">India</span>
            <span className="hidden md:inline">• Education • Secure Labs</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="hover:underline" onClick={() => navigate("/contact")}>
              Contact us
            </button>
            <button className="hover:underline" onClick={() => navigate("/support")}>
              Support
            </button>
            <Button onClick={() => navigate("/c3/login")} className="px-3 py-1 text-sm">
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
              <img src="/images/logo.png" alt="C3 logo" className="h-10 w-10 rounded" />
              <div>
                <div className="text-lg font-semibold text-slate-900">C3 Cloud</div>
                <div className="text-xs text-gray-500">Console</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <nav className="flex gap-6 items-center">
                {["overview", "features", "mobile", "faqs"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => onNav(tab)}
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
  const [view, setView] = useState("landing");
  const [lastCreated, setLastCreated] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("student");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sync route with view
    if (location.pathname === "/c3/console") setView("console");
    else if (location.pathname === "/c3/deploy") setView("deploy");
    else setView("landing");
  }, [location.pathname]);

  const handleLaunch = () => navigate("/c3/console");
  const handleCreateClick = () => navigate("/c3/deploy");
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    navigate("/c3/deploy");
  };
  const onCreated = (instance) => {
    setLastCreated(instance);
    navigate("/c3/console");
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950">
      <C3TopNav
        onNav={(tab) => {
          if (tab === "overview") navigate("/c3");
          if (tab === "features") navigate("/features");
          if (tab === "mobile") navigate("/mobile");
          if (tab === "faqs") navigate("/faqs");
        }}
      />

      <motion.div
        key={view}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {view === "landing" && (
          <CloudLanding onLaunch={handleLaunch} onSelectPlan={handleSelectPlan} />
        )}
        {view === "console" && <CloudConsole onCreate={handleCreateClick} />}
        {view === "deploy" && (
          <CloudDeploy onSuccess={onCreated} preselectedPlan={selectedPlan} />
        )}
      </motion.div>

      <CloudUsage />
    </div>
  );
}
