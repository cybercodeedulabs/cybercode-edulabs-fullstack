// ============================================================================
// src/pages/CybercodeCloud.jsx
// Premium Enterprise Hero Layout + Interactive Demo Zone + Console/Deploy/Usage
// ============================================================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// UI Components
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectItem } from "../components/ui/select";

// Cloud Waitlist
import CloudWaitlist from "../components/CloudWaitlist";

// C3 Cloud Interactive Demo Zone
import C3DemoZone from "../components/simulations/c3/C3CloudDemoZone";

/* ===========================================================================
   Nebula Background (subtle for enterprise look)
   =========================================================================== */
function NebulaBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/c3-nebula-bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
    </div>
  );
}

/* ===========================================================================
   Rotating Premium Cube
   =========================================================================== */
function C3Cube({ size = 240 }) {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        rotateY: [-6, 6, -6],
        rotateX: [2, -2, 2],
        y: [0, -4, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="mx-auto lg:mx-0"
      style={{ width: size, height: size }}
    >
      <img
        src="/images/c3-cube-premium.png"
        alt="C3 Cube"
        className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(56,189,248,0.35)]"
      />
    </motion.div>
  );
}

/* ===========================================================================
   PREMIUM HERO LAYOUT — Option C (Enterprise look)
   =========================================================================== */
function CloudLanding({ onLaunch, onSelectPlan }) {
  return (
    <section className="relative overflow-hidden">
      <NebulaBackground />

      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          relative z-10 max-w-7xl mx-auto 
          px-6 pt-32 pb-16
          flex flex-col lg:flex-row 
          items-center gap-20
        "
      >
        {/* LEFT — TEXT */}
        <div className="flex-1 text-left">
          {/* Brand Row */}
          <div className="inline-flex items-center gap-3 mb-6">
            <img
              src="/images/c3-cube-premium.png"
              className="w-12 h-12"
              alt="C3 Icon"
            />
            <div className="text-sm text-slate-300">
              <div className="font-semibold text-white text-base tracking-wide">
                C3 Cloud
              </div>
              <div className="text-xs opacity-80">
                Cybercode EduLabs • India • Secure Cloud
              </div>
            </div>
          </div>

          {/* HERO TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="
              text-[42px] sm:text-5xl lg:text-6xl 
              font-extrabold leading-tight 
              tracking-tight mb-6
            "
          >
            <span className="text-white">C3 Cloud</span>{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              — India’s Education-First Developer Cloud
            </span>
          </motion.h1>

          {/* DESCRIPTION */}
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-slate-300/90">
            Deploy learning labs, launch isolated environments, run student
            workspaces, enable Git auto-deploy, secure sandboxes & role-based
            IAM — built for universities, training institutes and modern
            startups.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              onClick={onLaunch}
              className="px-7 py-3 text-sm font-medium tracking-wide"
            >
              🚀 Launch Console
            </Button>

            <Button
              variant="secondary"
              onClick={() => window.open("/pricing", "_self")}
              className="px-7 py-3 text-sm font-medium tracking-wide"
            >
              💰 Explore Pricing
            </Button>
          </div>

          {/* TRUST POINTS */}
          <div className="mt-10 flex items-center gap-8 text-sm text-slate-400 flex-wrap">
            <div>🇮🇳 India-first Cloud</div>
            <div>🔐 Secure IAM</div>
            <div>⚡ One-click Labs</div>
          </div>
        </div>

        {/* RIGHT — CUBE + FEATURES */}
        <div className="lg:w-1/2">
          <div
            className="
            bg-white/5 border border-white/10 
            rounded-3xl p-8 backdrop-blur-lg 
            shadow-2xl
          "
          >
            <C3Cube size={260} />

            {/* Feature Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              {[
                ["One-click Labs", "Dev envs for every course"],
                ["Git Auto-Deploy", "Deploy repos instantly"],
                ["Safe Sandboxes", "Isolated per student"],
                ["Affordable Plans", "Designed for education"],
              ].map(([title, desc]) => (
                <div
                  key={title}
                  className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl"
                >
                  <div className="text-white font-semibold">{title}</div>
                  <div className="text-xs mt-1 text-slate-400">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* DEMO ZONE — Explore C3 Cloud in 60 seconds */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10">
        <C3DemoZone />
      </div>

      {/* WAITLIST SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div id="waitlist" className="mt-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Cybercode Cloud Beta 🚀
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8">
            Be among the first to access India’s developer cloud. Early users
            get priority onboarding & dedicated support.
          </p>

          <div className="max-w-2xl mx-auto">
            <Card className="p-6 bg-white/5 border border-slate-800 backdrop-blur-md">
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
  CONSOLE
  =========================================================================== */
function CloudConsole({ onCreate }) {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstances();
  }, []);

  async function fetchInstances() {
    setLoading(true);
    try {
      const res = await fetch("/api/cloud/instances").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setInstances(data.instances || []);
      } else {
        setInstances([]);
      }
    } catch {
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
            <motion.div key={ins.id} whileHover={{ scale: 1.02 }}>
              <Card className="bg-white/5 border border-slate-800 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">
                        {ins.name || ins.id}
                      </h3>
                      <p className="text-sm text-slate-300">
                        {ins.plan || "Student"} • {ins.status}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <a
                          href={ins.url || "#"}
                          target="_blank"
                          rel="noreferrer"
                        >
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

/* ===========================================================================
   DEPLOY
   =========================================================================== */
function CloudDeploy({ onSuccess, preselectedPlan }) {
  const [gitUrl, setGitUrl] = useState("");
  const [plan, setPlan] = useState(preselectedPlan || "student");
  const [creating, setCreating] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);

    setTimeout(() => {
      onSuccess &&
        onSuccess({
          id: "mock-" + Date.now(),
          name: "C3 Workspace",
          plan,
          url: "#",
        });
        
      setCreating(false);
    }, 900);
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <Card className="shadow-lg bg-white/5 backdrop-blur-sm border border-slate-800">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4 text-white">
            Create a Cloud Workspace
          </h3>

          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">
                Git Repository (optional)
              </label>
              <Input
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                placeholder="https://github.com/your/repo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">
                Plan
              </label>
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

/* ===========================================================================
   USAGE
   =========================================================================== */
function CloudUsage() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
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
              <p className="text-xl font-bold text-white">
                {usage.cpuUsed} / {usage.cpuQuota}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-slate-800 backdrop-blur-sm">
            <CardContent>
              <p className="text-sm text-slate-300">Storage (GB)</p>
              <p className="text-xl font-bold text-white">
                {usage.storageUsed} / {usage.storageQuota}
              </p>
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

  return (
    <div className="min-h-screen bg-neutral-900">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {view === "landing" && (
          <CloudLanding
            onLaunch={() => setView("console")}
            onSelectPlan={(p) => {
              setSelectedPlan(p);
              setView("deploy");
            }}
          />
        )}

        {view === "console" && (
          <CloudConsole onCreate={() => setView("deploy")} />
        )}

        {view === "deploy" && (
          <CloudDeploy
            onSuccess={() => setView("console")}
            preselectedPlan={selectedPlan}
          />
        )}
      </motion.div>

      {/* Usage section always visible at bottom */}
      <CloudUsage />
    </div>
  );
}
