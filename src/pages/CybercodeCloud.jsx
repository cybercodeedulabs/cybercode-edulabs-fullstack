// src/pages/CybercodeCloud.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectItem } from "../components/ui/select";
import CloudWaitlist from "../components/CloudWaitlist";


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
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12"
      >
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
            Cybercode Cloud
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            India’s first education-focused cloud workspace for students, startups, and
            innovators. Launch isolated dev environments, deploy projects, and collaborate securely — all hosted in India and billed in INR.
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
          className="lg:w-1/2 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl"
          onClick={onLaunch}
        >
          <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 text-center">
            One-click Labs
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Open IDEs, deploy containers, and host projects instantly on subdomains.
          </p>
          <div className="mt-6 flex justify-center">
            <img
              src="/images/cloud-startup.png"
              alt="Cybercode Cloud Illustration"
              className="w-72 h-auto object-contain drop-shadow-lg"
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Tier Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
              <Card className="relative border border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition">
                <CardContent className="p-5">
                  {tier.badge && (
                    <span className="absolute top-3 right-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
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
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          My Cloud Console
        </h2>
        <Button onClick={onCreate}>+ New Workspace</Button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading instances…</p>
      ) : instances.length === 0 ? (
        <Card className="p-6 text-center text-gray-500 dark:text-gray-400">
          No active instances. Create one to get started.
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {instances.map((ins) => (
            <motion.div key={ins.id} whileHover={{ scale: 1.02 }}>
              <Card>
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
                      <Button asChild size="sm">
                        <a href={ins.url} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      </Button>
                      <Button variant="secondary" size="sm">
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
      <Card className="shadow-lg bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
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
      <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
        Usage & Quota
      </h3>
      {!usage ? (
        <p className="text-gray-500 dark:text-gray-400">Loading usage data…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
            <CardContent>
              <p className="text-sm text-gray-500">CPU (vCPU)</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {usage.cpuUsed} / {usage.cpuQuota}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
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
// MAIN EXPORT
// =============================
export default function CybercodeCloudModule() {
  const [view, setView] = useState("landing");
  const [lastCreated, setLastCreated] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("student");

  const handleLaunch = () => setView("console");
  const handleCreateClick = () => setView("deploy");
  const onCreated = (instance) => {
    setLastCreated(instance);
    setView("console");
  };
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setView("deploy");
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950">
      <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Cybercode EduLabs Logo"
              className="w-10 h-10 rounded"
            />
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">
                Cybercode Cloud
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                India • Education • Secure Cloud Labs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setView("landing")}>
              Overview
            </Button>
            <Button variant="secondary" onClick={() => setView("console")}>
              Console
            </Button>
            <Button variant="secondary" onClick={() => setView("deploy")}>
              Deploy
            </Button>
          </div>
        </div>
      </header>

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
