import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// UI components: Float UI / shadcn/ui style conventions assumed available
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectItem } from "../components/ui/select";

// Cybercode Cloud UI module
// Single-file React component that exports default CloudModule component.
// Designed to slot into your existing Vite + React + Tailwind setup.

// Usage notes (place in your route table):
// import CybercodeCloud from '@/components/CybercodeCloud_UI.jsx';
// <Route path="/cloud" element={<CybercodeCloud />} />

const api = {
  createInstance: "/api/cloud/instances", // POST
  listInstances: "/api/cloud/instances", // GET
  getUsage: "/api/cloud/usage", // GET
};

function CloudLanding({ onLaunch }) {
  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-8 items-center"
      >
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-extrabold">Cybercode Cloud</h1>
          <p className="mt-4 text-neutral-600">
            India-first, education-focused cloud workspaces for students, startups, and community labs.
            Launch sandboxed dev environments, deploy projects, and showcase work — all billed in INR.
          </p>

          <div className="mt-6 flex gap-3">
            <Button onClick={() => onLaunch()}>Launch Cloud Console</Button>
            <Button variant="ghost">Explore Pricing</Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Card>
              <CardContent>
                <h3 className="font-semibold">Student Tier</h3>
                <p className="text-sm text-neutral-500">1 vCPU • 512MB • 5GB storage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="font-semibold">Edu+ Tier</h3>
                <p className="text-sm text-neutral-500">2 vCPU • 2GB • 25GB storage • 1 year</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-md">
            <h4 className="text-lg font-medium">One-click labs</h4>
            <p className="mt-2 text-sm text-neutral-500">Open IDEs, deploy containers, host projects on subdomains.</p>
            <div className="mt-4">
              <img src="/assets/cloud-illustration.svg" alt="cloud" className="w-full h-48 object-contain" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

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
    <section className="px-6 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">My Cloud Console</h2>
        <Button onClick={() => onCreate()}>Create New Workspace</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading && <div className="p-6 bg-white shadow rounded">Loading...</div>}
        {!loading && instances.length === 0 && (
          <div className="p-6 bg-white shadow rounded">No active instances. Create one to get started.</div>
        )}

        {instances.map((ins) => (
          <Card key={ins.id}>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{ins.name || ins.id}</h3>
                  <p className="text-sm text-neutral-500">{ins.plan || "Student"} • {ins.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild>
                    <a href={ins.url} target="_blank" rel="noreferrer">Open</a>
                  </Button>
                  <Button variant="ghost">Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

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
          <h3 className="text-lg font-semibold mb-2">Create a Cloud Workspace</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Git Repository (optional)</label>
              <Input value={gitUrl} onChange={(e) => setGitUrl(e.target.value)} placeholder="https://github.com/your/repo" />
            </div>

            <div>
              <label className="block text-sm font-medium">Plan</label>
              <Select value={plan} onValueChange={(v) => setPlan(v)}>
                <SelectItem value="student">Student (free)</SelectItem>
                <SelectItem value="edu">Edu+</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create Workspace"}</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

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
          <h3 className="text-lg font-semibold">Usage & Quota</h3>
          {!usage && <p className="text-sm text-neutral-500">Loading...</p>}
          {usage && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">CPU (vCPU)</p>
                <p className="font-semibold">{usage.cpuUsed} / {usage.cpuQuota}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Storage</p>
                <p className="font-semibold">{usage.storageUsed} / {usage.storageQuota} GB</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

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
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo192.png" alt="logo" className="w-10 h-10 rounded" />
            <div>
              <h4 className="font-bold">Cybercode Cloud</h4>
              <p className="text-xs text-neutral-500">India • Education • Affordable</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setView("landing")}>Overview</Button>
            <Button variant="ghost" onClick={() => setView("console")}>My Console</Button>
            <Button variant="ghost" onClick={() => setView("deploy")}>Deploy</Button>
          </div>
        </div>
      </div>

      {view === "landing" && <CloudLanding onLaunch={handleLaunch} />}
      {view === "console" && <CloudConsole onCreate={handleCreateClick} />}
      {view === "deploy" && <CloudDeploy onSuccess={onCreated} />}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <CloudUsage />
      </div>
    </div>
  );
}
