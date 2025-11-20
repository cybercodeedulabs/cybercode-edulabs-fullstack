// src/pages/CybercodeCloud.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// UI Components
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectItem } from "../components/ui/select";

// Cloud Waitlist
import CloudWaitlist from "../components/CloudWaitlist";

/* ===========================================================================
   Nebula Background (lightweight, static image, low opacity for performance)
   =========================================================================== */
function NebulaBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/c3-nebula-bg.png')",
        // Slight opacity & blur handled by wrapper element so it stays subtle
      }}
    >
      {/* subtle overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
    </div>
  );
}

/* ===========================================================================
   Rotating Premium Cube (GPU-friendly - uses CSS transform backed by GPU)
   - Uses a single PNG image (transparent) to avoid heavy WebGL work
   =========================================================================== */
function C3Cube({ size = 260 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateY: [-8, 8, -8],   // safe wobble
        rotateX: [0, 4, 0],     // slight tilt
        y: [0, -6, 0],          // soft float
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="mx-auto lg:mx-0"
      style={{ width: size, height: size }}
    >
      <img
        src="/images/c3-logo-premium.png"
        alt="C3 Rotating Cube"
        className="w-full h-full object-contain drop-shadow-[0_25px_60px_rgba(56,189,248,0.35)]"
      />
    </motion.div>
  );
}

/* ===========================================================================
   CLOUD LANDING — PREMIUM HERO (integrates nebula, gradient heading, cube)
   =========================================================================== */
function CloudLanding({ onLaunch, onSelectPlan }) {
  return (
    <section className="relative overflow-hidden">
      <NebulaBackground />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 flex flex-col lg:flex-row items-center gap-12"
      >
        {/* LEFT — TEXT */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 mb-4">
            <img
              src="/images/c3-cube-premium.png"
              className="w-12 h-12"
              alt="C3 Icon"
            />
            <div className="text-sm text-slate-300">
              <div className="font-semibold text-white">C3 Cloud</div>
              <div className="text-xs">Cybercode EduLabs • India • Secure Cloud</div>
            </div>
          </div>

          {/* HERO TITLE (Gradient) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-extrabold leading-tight"
          >
            <span className="text-white">C3 Cloud</span>{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              — India’s Education-First Developer Cloud
            </span>
          </motion.h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Deploy learning labs, launch isolated environments, run student
            workspaces, Git auto-deploy, sandboxes & role-based IAM — crafted for
            students, colleges and startups.
          </p>

          {/* BUTTONS */}
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

            <a
              href="#waitlist"
              className="inline-flex items-center text-sm text-slate-300 underline ml-2"
            >
              Join Beta Waitlist
            </a>
          </div>

          {/* TRUST MARKERS */}
          <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-xs text-slate-400">
            <div>🇮🇳 India-first Cloud</div>
            <div>•</div>
            <div>🔐 Secure IAM</div>
            <div>•</div>
            <div>⚡ One-click Labs</div>
          </div>
        </div>

        {/* RIGHT — ROTATING CUBE + FEATURES */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="lg:w-1/2"
        >
          <div className="bg-white/4 py-8 px-6 rounded-3xl backdrop-blur-md border border-white/10 shadow-xl">
            <C3Cube size={260} />

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                <div className="font-semibold text-white">One-click Labs</div>
                <div className="text-xs mt-1">Dev envs for every course</div>
              </div>
              <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                <div className="font-semibold text-white">Git Auto-Deploy</div>
                <div className="text-xs mt-1">Deploy repos instantly</div>
              </div>
              <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                <div className="font-semibold text-white">Safe Sandboxes</div>
                <div className="text-xs mt-1">Isolated per student</div>
              </div>
              <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                <div className="font-semibold text-white">Affordable Plans</div>
                <div className="text-xs mt-1">Designed for education</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* WAITLIST */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div id="waitlist" className="mt-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Join the Cybercode Cloud Beta 🚀
          </h2>
          <p className="text-center text-slate-300 mb-6 max-w-xl mx-auto">
            Be among the first to try India’s education cloud. Early users get
            priority access.
          </p>

          <div className="max-w-2xl mx-auto px-4">
            <Card className="p-6 bg-white/5 border border-slate-800 backdrop-blur-sm">
              <CardContent>
                <CloudWaitlist />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   CloudConsole (keeps local mock/fetch approach)
   =========================================================================== */
function CloudConsole({ onCreate }) {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetchInstances can be wired to your mockAPI or real API
    fetchInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchInstances() {
    // If you have an API, replace this mock logic with fetch('/api/cloud/instances')
    setLoading(true);
    try {
      // try a fetch — if fails, fallback to empty
      const res = await fetch("/api/cloud/instances").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setInstances(data.instances || []);
      } else {
        // fallback: no instances or local simulation
        setInstances([]);
      }
    } catch (err) {
      console.error("fetchInstances error", err);
      setInstances([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">My Cloud Console</h2>
        <Button onClick={onCreate}>+ New Workspace</Button>
      </div>

      {loading ? (
        <p className="text-slate-300 animate-pulse">Loading instances…</p>
      ) : instances.length === 0 ? (
        <Card className="p-6 text-center text-slate-300 bg-white/5 border border-slate-800">
          No active workspaces yet.
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {instances.map((ins) => (
            <motion.div key={ins.id} whileHover={{ scale: 1.02 }} className="cursor-pointer">
              <Card className="bg-white/5 border border-slate-800 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{ins.name || ins.id}</h3>
                      <p className="text-sm text-slate-300">{ins.plan || "Student"} • {ins.status}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <a href={ins.url || "#"} target="_blank" rel="noreferrer">Open</a>
                      </Button>
                      <Button variant="secondary" size="sm">Logs</Button>
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

/* ===========================================================================
   CloudDeploy - mock create (keeps behavior you used earlier)
   =========================================================================== */
function CloudDeploy({ onSuccess, preselectedPlan }) {
  const [gitUrl, setGitUrl] = useState("");
  const [plan, setPlan] = useState(preselectedPlan || "student");
  const [creating, setCreating] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);

    // ⭐ MOCK success process — no API calls
    setTimeout(() => {
      onSuccess &&
        onSuccess({
          id: "mock-" + Date.now(),
          name: "C3 Workspace",
          plan,
          url: "#",
        });

      setCreating(false);
    }, 900); // smooth fake processing
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <Card className="shadow-lg bg-white/5 backdrop-blur-sm border border-slate-800">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4 text-white">Create a Cloud Workspace</h3>

          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Git Repository (optional)</label>
              <Input value={gitUrl} onChange={(e) => setGitUrl(e.target.value)} placeholder="https://github.com/your/repo" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Plan</label>
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
              <Button variant="secondary" type="button" onClick={() => setGitUrl("")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

/* ===========================================================================
   CloudUsage (static demo values if no API)
   =========================================================================== */
function CloudUsage() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    // fallback demo usage — replace with real API call if available
    setUsage({
      cpuUsed: 0,
      cpuQuota: 2,
      storageUsed: 0,
      storageQuota: 10,
    });
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 pb-20 pt-4">
      <h3 className="text-2xl font-bold text-white mb-8">Usage & Quota</h3>

      {!usage ? (
        <p className="text-slate-300">Loading usage…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="bg-white/5 border border-slate-800 backdrop-blur-sm">
            <CardContent>
              <p className="text-sm text-slate-300">CPU (vCPU)</p>
              <p className="text-xl font-bold text-white">{usage.cpuUsed} / {usage.cpuQuota}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-slate-800 backdrop-blur-sm">
            <CardContent>
              <p className="text-sm text-slate-300">Storage (GB)</p>
              <p className="text-xl font-bold text-white">{usage.storageUsed} / {usage.storageQuota}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}

/* ===========================================================================
   MAIN EXPORT
   =========================================================================== */
export default function CybercodeCloudModule() {
  const [view, setView] = useState("landing");
  const [selectedPlan, setSelectedPlan] = useState("student");

  // Actions
  const handleLaunch = () => setView("console");
  const handleCreateClick = () => setView("deploy");
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setView("deploy");
  };
  const onCreated = () => setView("console");

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Global <Header /> should render above this (no local header here) */}

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
