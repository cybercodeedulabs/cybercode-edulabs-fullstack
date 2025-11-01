import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectItem } from "../components/ui/select";

const api = {
  createInstance: "/api/cloud/instances", // POST
  listInstances: "/api/cloud/instances", // GET
  getUsage: "/api/cloud/usage", // GET
};

// =============================
// LANDING SECTION
// =============================
function CloudLanding({ onLaunch }) {
  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-10 items-center"
      >
        {/* Left content */}
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">
            Cybercode Cloud
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            India’s first education-focused cloud workspace for students, startups, and
            innovators. Launch isolated dev environments, deploy projects, and
            collaborate securely — all hosted in India and billed in INR.
          </p>

          <div className="mt-6 flex gap-3 flex-wrap">
            <Button onClick={onLaunch}>🚀 Launch Cloud Console</Button>
            <Button
              variant="secondary"
              onClick={() => window.open("/pricing", "_self")}
            >
              💰 Explore Pricing
            </Button>
          </div>

          {/* Plan Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  Student Tier
                </h3>
                <p className="text-sm text-gray-500">
                  1 vCPU • 512MB RAM • 5GB storage • Free forever
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  Edu+ Tier
                </h3>
                <p className="text-sm text-gray-500">
                  2 vCPU • 2GB RAM • 25GB storage • 1-year validity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  Startup Tier
                </h3>
                <p className="text-sm text-gray-500">
                  4 vCPU • 8GB RAM • 100GB storage • Business-ready cloud sandbox
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="w-full lg:w-1/2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg text-center"
          >
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              One-click labs
            </h4>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Open IDEs, deploy containers, and host projects instantly on subdomains.
            </p>
            <div className="mt-5 flex justify-center">
              <img
                src="/images/cloud.png"
                alt="Cybercode Cloud Illustration"
                className="w-56 h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
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
    <section className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          My Cloud Console
        </h2>
        <Button onClick={onCreate}>Create New Workspace</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading && (
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded">
            Loading...
          </div>
        )}
        {!loading && instances.length === 0 && (
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded">
            No active instances. Create one to get started.
          </div>
        )}

        {instances.map((ins) => (
          <Card key={ins.id}>
            <CardContent>
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
                  <Button asChild>
                    <a href={ins.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </Button>
                  <Button variant="secondary">Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// =============================
// DEPLOY SECTION
// =============================
function CloudDeploy({ onSuccess }) {
  const [gitUrl, setGitUrl] = useState("");
  const [plan, setPlan] = useState("student");
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
      if (!res.ok) throw new Error("create failed");
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
    <section className="px-6 py-8 max-w-3xl mx-auto">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            Create a Cloud Workspace
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Git Repository (optional)</label>
              <Input
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                placeholder="https://github.com/your/repo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Plan</label>
              <Select value={plan} onChange={(e) => setPlan(e.target.value)}>
                <SelectItem value="student" label="Student (free)" />
                <SelectItem value="edu" label="Edu+" />
                <SelectItem value="startup" label="Startup" />
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Workspace"}
              </Button>
              <Button variant="secondary" type="button" onClick={() => setGitUrl("")}>
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
      .catch((e) => console.error(e));
  }, []);

  return (
    <section className="px-6 py-8 max-w-4xl mx-auto">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Usage & Quota
          </h3>
          {!usage && <p className="text-sm text-gray-500">Loading...</p>}
          {usage && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">CPU (vCPU)</p>
                <p className="font-semibold">
                  {usage.cpuUsed} / {usage.cpuQuota}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Storage</p>
                <p className="font-semibold">
                  {usage.storageUsed} / {usage.storageQuota} GB
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// =============================
// MAIN MODULE EXPORT
// =============================
export default function CybercodeCloudModule() {
  const [view, setView] = useState("landing");
  const [lastCreated, setLastCreated] = useState(null);

  function handleLaunch() {
    setView("console");
  }

  function handleCreateClick() {
    setView("deploy");
  }

  function onCreated(instance) {
    setLastCreated(instance);
    setView("console");
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setView("landing")}>
              Overview
            </Button>
            <Button variant="secondary" onClick={() => setView("console")}>
              My Console
            </Button>
            <Button variant="secondary" onClick={() => setView("deploy")}>
              Deploy
            </Button>
          </div>
        </div>
      </header>

      {view === "landing" && <CloudLanding onLaunch={handleLaunch} />}
      {view === "console" && <CloudConsole onCreate={handleCreateClick} />}
      {view === "deploy" && <CloudDeploy onSuccess={onCreated} />}

      <div className="max-w-6xl mx-auto px-6 py-6">
        <CloudUsage />
      </div>
    </div>
  );
}
