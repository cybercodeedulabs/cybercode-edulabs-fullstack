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

// ---------- Small decorative components ----------
function NeonHeroBackground() {
  // simple animated gradient + subtle grid using CSS
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black opacity-95"></div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(56,189,248,0.03) 0%, rgba(124,58,237,0.03) 50%, rgba(99,102,241,0.02) 100%)] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/images/hero-grid.png')] bg-repeat opacity-5 animate-[gridPan_60s_linear_infinite]" />
      <style>{`
        @keyframes gridPan {
          from { background-position: 0 0; }
          to { background-position: 1000px 0; }
        }
      `}</style>
    </div>
  );
}

// ---------- Hero Cube component ----------
function C3Cube({ size = 220 }) {
  return (
    <motion.div
      initial={{ scale: 0.96, rotateY: -8 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-auto lg:mx-0"
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full">
        <img
          src="/images/c3-logo.png"
          alt="C3 Cube"
          className="w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(14,165,233,0.12)]"
          loading="lazy"
        />
        {/* subtle glow */}
        <div className="absolute inset-0 rounded-xl pointer-events-none"
             style={{
               boxShadow: "0 30px 80px rgba(14,165,233,0.08), 0 8px 30px rgba(99,102,241,0.04)"
             }} />
      </div>
    </motion.div>
  );
}

// =============================
// LANDING SECTION (NEW DESIGN)
// =============================
function CloudLanding({ onLaunch, onSelectPlan }) {
  return (
    <section className="relative overflow-hidden">
      <NeonHeroBackground />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 flex flex-col lg:flex-row items-center gap-12"
      >
        {/* Left: copy */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 p-1 rounded-xl shadow-lg">
              <img src="/images/c3-logo.png" alt="C3" className="w-12 h-12 rounded" />
            </div>
            <div className="text-sm text-slate-300">
              <div className="font-semibold text-slate-100">C3 Cloud</div>
              <div className="text-xs">Cybercode EduLabs — India • Education • Secure Cloud</div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-tight text-white">
            C3 Cloud — India’s education-first cloud
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Launch isolated developer & learning environments instantly. Secure workspaces, pre-built labs,
            Git auto-deploy and collab features — optimized for students, colleges and startups.
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
            <a
              href="#waitlist"
              className="inline-flex items-center text-sm text-slate-300 underline ml-2"
            >
              Join Beta Waitlist
            </a>
          </div>

          {/* trust badges */}
          <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-xs text-slate-400">
            <div>🇮🇳 India-first hosting</div>
            <div>•</div>
            <div>🔐 Role-based IAM</div>
            <div>•</div>
            <div>⚡ One-click Labs</div>
          </div>
        </div>

        {/* Right: cube + mini features */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="lg:w-1/2"
        >
          <div className="bg-gradient-to-b from-white/6 to-white/3 dark:bg-slate-900/30 rounded-3xl p-6 backdrop-blur-md shadow-xl">
            <C3Cube size={260} />
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className="font-semibold text-white">One-click Labs</div>
                <div className="text-xs mt-1">Instant dev environments for courses</div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className="font-semibold text-white">Git Auto-Deploy</div>
                <div className="text-xs mt-1">Deploy classrooms from a repo</div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className="font-semibold text-white">Safe Sandboxes</div>
                <div className="text-xs mt-1">Isolated network and quotas</div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className="font-semibold text-white">Student Pricing</div>
                <div className="text-xs mt-1">Affordable, predictable</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tiers / Pricing (redesigned) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Student",
              price: "Free",
              desc: "1 vCPU • 512MB RAM • 5GB storage • For learners",
              plan: "student",
              cta: "Get Started",
            },
            {
              name: "Edu+",
              price: "₹499 / mo",
              desc: "2 vCPU • 2GB RAM • 25GB storage • For courses & colleges",
              plan: "edu",
              cta: "Start Free Trial",
            },
            {
              name: "Startup",
              price: "Contact Sales",
              desc: "4 vCPU • 8GB RAM • 100GB SSD • Scalable workspaces",
              plan: "startup",
              cta: "Contact Sales",
              badge: "POPULAR",
            },
          ].map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ translateY: -6 }}
              className="cursor-pointer"
              onClick={() => onSelectPlan(tier.plan)}
            >
              <Card className={`relative border border-slate-800 bg-white/4 hover:shadow-2xl transition`}>
                <CardContent className="p-6">
                  {tier.badge && (
                    <span className="absolute top-3 right-4 text-xs font-semibold text-amber-300">
                      {tier.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                      <p className="text-sm text-slate-300 mt-1">{tier.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-300">{tier.price}</div>
                      <div className="text-xs text-slate-400 mt-1">{tier.cta}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button size="sm" onClick={() => onSelectPlan(tier.plan)}>
                      {tier.plan === "student" ? "Try Free" : "Choose"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.open("/pricing", "_self")}>
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Waitlist Section */}
        <div id="waitlist" className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Join the Cybercode Cloud Beta 🚀</h2>
          <p className="text-center text-slate-300 mb-6 max-w-2xl mx-auto">
            Be among the first to experience India’s education cloud. Developers, students and startups get priority access.
          </p>
          <div className="max-w-2xl mx-auto px-4">
            <Card className="p-6 bg-white/5 border border-slate-800">
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

// =============================
// CONSOLE SECTION (kept from previous file, minor styling adjustments)
// =============================
function CloudConsole({ onCreate }) {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <h2 className="text-2xl font-bold text-white">My Cloud Console</h2>
        <Button onClick={onCreate}>+ New Workspace</Button>
      </div>

      {loading ? (
        <p className="text-slate-300">Loading instances…</p>
      ) : instances.length === 0 ? (
        <Card className="p-6 text-center text-slate-300">
          No active instances. Create one to get started.
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {instances.map((ins) => (
            <motion.div key={ins.id} whileHover={{ scale: 1.02 }}>
              <Card className="bg-white/4 border border-slate-800">
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

// =============================
// DEPLOY SECTION (kept intact)
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
      <Card className="shadow-lg bg-white/6 backdrop-blur-sm border border-slate-800">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4 text-white">Create a Cloud Workspace</h3>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Git Repository (optional)</label>
              <Input
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                placeholder="https://github.com/your/repo"
              />
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
// USAGE SECTION (kept intact)
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
      <h3 className="text-2xl font-bold text-white mb-6">Usage & Quota</h3>
      {!usage ? (
        <p className="text-slate-300">Loading usage data…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="bg-white/4 border border-slate-800">
            <CardContent>
              <p className="text-sm text-slate-300">CPU (vCPU)</p>
              <p className="text-xl font-bold text-white">
                {usage.cpuUsed} / {usage.cpuQuota}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/4 border border-slate-800">
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

// =============================
// MAIN EXPORT (keeps views & routing as before)
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
    <div className="min-h-screen bg-neutral-900">
      <header className="bg-white/5 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/c3-logo.png" alt="Cybercode Cloud" className="w-10 h-10 rounded" />
            <div>
              <h4 className="font-bold text-white">Cybercode Cloud</h4>
              <p className="text-xs text-slate-400">India • Education • Secure Cloud Labs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setView("landing")}>Overview</Button>
            <Button variant="secondary" onClick={() => setView("console")}>Console</Button>
            <Button variant="secondary" onClick={() => setView("deploy")}>Deploy</Button>
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
          <CloudLanding
            onLaunch={handleLaunch}
            onSelectPlan={handleSelectPlan}
          />
        )}
        {view === "console" && <CloudConsole onCreate={handleCreateClick} />}
        {view === "deploy" && (
          <CloudDeploy
            onSuccess={onCreated}
            preselectedPlan={selectedPlan}
          />
        )}
      </motion.div>

      <CloudUsage />
    </div>
  );
}
