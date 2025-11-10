// src/pages/CloudDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useIAM } from "../contexts/IAMContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Try to import mock API (you mentioned you created it).
// If it's not available at runtime, we'll fall back to localStorage simulation.
let mockAPI = null;
try {
  // eslint-disable-next-line import/no-unresolved, global-require
  mockAPI = require("../api/mockCloudAPI").mockAPI;
} catch (e) {
  mockAPI = null;
}

/**
 * ⚙️ C3 Cloud Console Dashboard — enhanced with one-click instance creation
 *
 * - Uses mockAPI if available (src/api/mockCloudAPI.js)
 * - Otherwise simulates instances and persists them in localStorage
 * - Keeps existing UI + styling consistent with CybercodeCloud.jsx
 */

export default function CloudDashboard() {
  const { iamUser, logoutIAM, registerIAMUser } = useIAM();
  const navigate = useNavigate();

  const [instances, setInstances] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loadingInstances, setLoadingInstances] = useState(false);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [error, setError] = useState("");

  // Launch form state
  const [launching, setLaunching] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [launchPlan, setLaunchPlan] = useState("student");
  const [launchImage, setLaunchImage] = useState("ubuntu-22.04");
  const [launchCount, setLaunchCount] = useState(1);
  const [launchCPU, setLaunchCPU] = useState(1);
  const [launchRAM, setLaunchRAM] = useState(1); // GB
  const [launchDisk, setLaunchDisk] = useState(5); // GB
  const [provisionLogs, setProvisionLogs] = useState([]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteRole, setInviteRole] = useState("developer");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");

  // 🔐 Redirect unauthenticated IAM users
  useEffect(() => {
    if (!iamUser) navigate("/cloud/login");
  }, [iamUser, navigate]);

  // ---------- persistence helpers (localStorage fallback) ----------
  const LS_KEY_INST = "c3_instances_v1";
  const LS_KEY_USAGE = "c3_usage_v1";

  function readLocalInstances() {
    try {
      const raw = localStorage.getItem(LS_KEY_INST);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  function writeLocalInstances(arr) {
    try {
      localStorage.setItem(LS_KEY_INST, JSON.stringify(arr));
    } catch {
      /* ignore */
    }
  }
  function readLocalUsage() {
    try {
      const raw = localStorage.getItem(LS_KEY_USAGE);
      return raw
        ? JSON.parse(raw)
        : { cpuUsed: 0, cpuQuota: 8, storageUsed: 0, storageQuota: 100, activeUsers: 1 };
    } catch {
      return { cpuUsed: 0, cpuQuota: 8, storageUsed: 0, storageQuota: 100, activeUsers: 1 };
    }
  }
  function writeLocalUsage(u) {
    try {
      localStorage.setItem(LS_KEY_USAGE, JSON.stringify(u));
    } catch {
      /* ignore */
    }
  }

  // ---------- fetch / init ----------
  useEffect(() => {
    fetchInstances();
    fetchUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchInstances() {
    setLoadingInstances(true);
    try {
      if (mockAPI && typeof mockAPI.listInstances === "function") {
        const data = await mockAPI.listInstances();
        setInstances(data.instances || []);
      } else {
        // fallback to local storage
        const local = readLocalInstances();
        setInstances(local);
      }
    } catch (err) {
      console.error(err);
      setError("Could not load instances.");
    } finally {
      setLoadingInstances(false);
    }
  }

  async function fetchUsage() {
    setLoadingUsage(true);
    try {
      if (mockAPI && typeof mockAPI.getUsage === "function") {
        const u = await mockAPI.getUsage();
        setUsage(u || null);
      } else {
        // fallback to local storage
        const local = readLocalUsage();
        setUsage(local);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsage(false);
    }
  }

  // ---------- instance creation (one-click) ----------
  // config: { plan, image, count, cpu, ram, disk }
  async function createInstances(config) {
    // high level wrapper: tries mockAPI.createInstances, otherwise simulates
    if (mockAPI && typeof mockAPI.createInstances === "function") {
      return mockAPI.createInstances(config);
    }

    // Local simulation: create objects, persist to localStorage, update usage
    const existing = readLocalInstances();
    const existingUsage = readLocalUsage();

    const created = [];
    for (let i = 0; i < config.count; i += 1) {
      const id = `inst-${Date.now()}-${Math.floor(Math.random() * 9000 + i)}`;
      const name = `${config.image.replace(/[^a-z0-9]/gi, "-")}-${id.slice(-4)}`;
      const ins = {
        id,
        name,
        image: config.image,
        plan: config.plan,
        cpu: config.cpu,
        ram: config.ram,
        disk: config.disk,
        status: "running",
        url: "#",
        createdAt: new Date().toISOString(),
      };
      created.push(ins);

      existingUsage.cpuUsed += config.cpu;
      existingUsage.storageUsed += config.disk;
    }

    const nextInstances = existing.concat(created);
    writeLocalInstances(nextInstances);

    // clamp usage
    if (existingUsage.cpuUsed > existingUsage.cpuQuota) existingUsage.cpuUsed = existingUsage.cpuQuota;
    if (existingUsage.storageUsed > existingUsage.storageQuota) existingUsage.storageUsed = existingUsage.storageQuota;
    writeLocalUsage(existingUsage);

    return { instances: created, usage: existingUsage };
  }

  // Handle UI submit for launching
  async function handleLaunchSubmit(e) {
    e.preventDefault();
    setProvisionLogs([]);
    setProvisioning(true);

    const cfg = {
      plan: launchPlan,
      image: launchImage,
      count: Number(launchCount) || 1,
      cpu: Number(launchCPU) || 1,
      ram: Number(launchRAM) || 1,
      disk: Number(launchDisk) || 5,
    };

    // small progress simulation (for demo)
    try {
      setProvisionLogs((l) => [...l, `Requesting ${cfg.count} instance(s)...`]);

      // If using mockAPI that simulates async provisioning with logs, it may provide progress.
      if (mockAPI && typeof mockAPI.createInstances === "function") {
        // mockAPI may itself be async and return objects
        const resp = await mockAPI.createInstances(cfg, (progress) => {
          // if mockAPI supports progress callback, push logs
          if (progress) setProvisionLogs((s) => [...s, progress]);
        });
        // merge newly created instances into UI
        const newInstances = resp.instances || [];
        setInstances((prev) => [...newInstances, ...prev]);
        if (resp.usage) setUsage(resp.usage);
      } else {
        // local simulation - add a few timed log entries
        setProvisionLogs((l) => [...l, "Allocating resources on local simulator..."]);
        await new Promise((res) => setTimeout(res, 900));
        setProvisionLogs((l) => [...l, "Configuring networking and storage..."]);
        await new Promise((res) => setTimeout(res, 900));
        setProvisionLogs((l) => [...l, "Booting instances..."]);
        await new Promise((res) => setTimeout(res, 900));

        const resp = await createInstances(cfg);
        setInstances((prev) => [...resp.instances, ...prev]);
        setUsage(resp.usage || readLocalUsage());
      }

      setProvisionLogs((l) => [...l, "✅ Provisioning complete."]);
    } catch (err) {
      console.error("Launch failed", err);
      setProvisionLogs((l) => [...l, `❌ Error: ${err.message || err}`]);
    } finally {
      setProvisioning(false);
      // keep launch form visible, but you may prefer to hide it: setLaunching(false)
    }
  }

  // ---------- instance actions ----------
  async function handleTerminate(id) {
    // For now, simulate termination (update localStorage or call mockAPI terminate)
    try {
      if (mockAPI && typeof mockAPI.terminateInstance === "function") {
        await mockAPI.terminateInstance(id);
        await fetchInstances();
        await fetchUsage();
        return;
      }
      // local simulation
      const curr = readLocalInstances().filter((i) => i.id !== id);
      writeLocalInstances(curr);
      setInstances(curr);

      // recalc usage (simple recalc from instances)
      const u = { cpuUsed: 0, cpuQuota: 8, storageUsed: 0, storageQuota: 100, activeUsers: 1 };
      const all = curr;
      all.forEach((it) => {
        u.cpuUsed += Number(it.cpu || 0);
        u.storageUsed += Number(it.disk || 0);
      });
      writeLocalUsage(u);
      setUsage(u);
    } catch (err) {
      console.error(err);
      setError("Failed to terminate instance.");
    }
  }

  // ---------- invite handler (keeps your existing IAM flow) ----------
  async function handleInviteSubmit(e) {
    e.preventDefault();
    setInviteMessage("");
    setInviteLoading(true);
    try {
      const created = await registerIAMUser({
        email: inviteEmail.trim().toLowerCase(),
        password: invitePassword,
        role: inviteRole,
      });
      setInviteMessage(`✅ User created: ${created.email} (${created.role})`);
      setInviteEmail("");
      setInvitePassword("");
      setInviteRole("developer");
    } catch (err) {
      setInviteMessage(`❌ ${err.message || "Failed to create user"}`);
    } finally {
      setInviteLoading(false);
    }
  }

  function handleSignOut() {
    logoutIAM();
    navigate("/cloud/login");
  }

  // ---------- small helpers ----------
  const canLaunch = () => {
    // Ensure resources available (simple check)
    if (!usage) return true;
    const projectedCPU = usage.cpuUsed + launchCPU * launchCount;
    const projectedStorage = usage.storageUsed + launchDisk * launchCount;
    return projectedCPU <= (usage.cpuQuota || 9999) && projectedStorage <= (usage.storageQuota || 9999);
  };

  // ---------- render ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      {/* ===== Header ===== */}
      <header className="backdrop-blur-lg bg-slate-900/90 border-b border-slate-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="C3 Cloud" className="h-9 w-9 rounded" />
            <div>
              <div className="text-sm font-semibold tracking-wide text-cyan-400">
                C3 Cloud Console
              </div>
              <div className="text-xs text-slate-400">by Cybercode EduLabs</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:block text-slate-300">{iamUser?.email}</span>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* ===== Main Body ===== */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome + Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="p-6 bg-white/10 backdrop-blur-lg border border-slate-800">
            <CardContent>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-cyan-400">
                    Welcome, {iamUser?.email?.split("@")[0] || "User"}
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    Manage your C3 workspaces, monitor usage, and create sandboxed labs with one click.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Role</div>
                  <div className="text-sm font-medium text-cyan-300">{iamUser?.role || "user"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ===== Launch Panel + Instances ===== */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: Launch panel + Instances list */}
          <div className="flex-1 space-y-6">
            {/* Launch Panel */}
            <Card className="p-4 bg-white/10 border border-slate-800">
              <CardContent>
                <h3 className="text-lg font-semibold text-cyan-300 mb-3">🚀 One-Click Launch</h3>

                <form onSubmit={handleLaunchSubmit} className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300">Package</label>
                    <select
                      value={launchPlan}
                      onChange={(e) => setLaunchPlan(e.target.value)}
                      className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                    >
                      <option value="student">Student (free)</option>
                      <option value="edu">Edu+</option>
                      <option value="startup">Startup</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Image</label>
                    <select
                      value={launchImage}
                      onChange={(e) => setLaunchImage(e.target.value)}
                      className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                    >
                      <option value="ubuntu-22.04">Ubuntu 22.04</option>
                      <option value="debian-12">Debian 12</option>
                      <option value="python-lab">Python Lab (env)</option>
                      <option value="golang-lab">Golang Lab (env)</option>
                      <option value="docker-container">Container (Docker)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Instances</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={launchCount}
                      onChange={(e) => setLaunchCount(Math.max(1, Number(e.target.value)))}
                      className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">CPU (vCPU)</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={launchCPU}
                      onChange={(e) => setLaunchCPU(Math.max(1, Number(e.target.value)))}
                      className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">RAM (GB)</label>
                    <input
                      type="number"
                      min="1"
                      max="32"
                      value={launchRAM}
                      onChange={(e) => setLaunchRAM(Math.max(1, Number(e.target.value)))}
                      className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Disk (GB)</label>
                    <input
                      type="number"
                      min="1"
                      max="1024"
                      value={launchDisk}
                      onChange={(e) => setLaunchDisk(Math.max(1, Number(e.target.value)))}
                      className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3 mt-2">
                    <Button type="submit" disabled={provisioning || !canLaunch()}>
                      {provisioning ? "Provisioning…" : "Create Cloud"}
                    </Button>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        // reset to defaults
                        setLaunchPlan("student");
                        setLaunchImage("ubuntu-22.04");
                        setLaunchCount(1);
                        setLaunchCPU(1);
                        setLaunchRAM(1);
                        setLaunchDisk(5);
                      }}
                    >
                      Reset
                    </Button>

                    {!canLaunch() && (
                      <div className="text-xs text-amber-300 ml-2">
                        Exceeds quota — adjust resources or upgrade plan.
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Instances list */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyan-300">Your Workspaces</h3>
              {loadingInstances ? (
                <Card className="p-6 bg-white/10 text-center text-slate-300">Loading instances…</Card>
              ) : instances.length === 0 ? (
                <Card className="p-6 bg-white/10 text-center text-slate-300">
                  <p>No active workspaces yet.</p>
                  <div className="mt-4">
                    <Button onClick={() => setLaunching(true)}>Create Workspace</Button>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {instances.map((ins) => (
                    <Card key={ins.id} className="p-4 bg-white/10 border border-slate-800">
                      <CardContent>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-slate-100">{ins.name || ins.id}</div>
                            <div className="text-xs text-slate-400">
                              {ins.image} • {ins.plan || "Student"} • {ins.status}
                            </div>
                            <div className="text-xs text-slate-400 mt-2">
                              {ins.cpu} vCPU • {ins.ram} GB RAM • {ins.disk} GB
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" asChild>
                              <a href={ins.url || "#"} target="_blank" rel="noreferrer">Open</a>
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleTerminate(ins.id)}>
                              Terminate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column: Usage + Admin Invite */}
          <aside className="w-full lg:w-96 space-y-6">
            {/* Usage */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="p-4 bg-white/10 border border-slate-800">
                <CardContent>
                  <h4 className="text-sm font-medium text-slate-200">Usage & Quotas</h4>
                  {loadingUsage ? (
                    <div className="mt-3 text-slate-400 text-sm">Loading…</div>
                  ) : usage ? (
                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <div className="text-xs text-slate-400">CPU (vCPU)</div>
                        <div className="text-sm font-medium">{usage.cpuUsed}/{usage.cpuQuota}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Storage (GB)</div>
                        <div className="text-sm font-medium">{usage.storageUsed}/{usage.storageQuota}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-xs text-slate-400">Active Users</div>
                        <div className="text-sm font-medium">{usage.activeUsers || 0}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-slate-400 text-sm">No usage data available</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* IAM Admin Invite */}
            {iamUser?.role === "admin" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <Card className="p-4 bg-white/10 border border-slate-800">
                  <CardContent>
                    <h4 className="text-sm font-medium text-slate-200">Admin — Invite IAM User</h4>
                    <form onSubmit={handleInviteSubmit} className="mt-3 space-y-3">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        placeholder="Email"
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                      />
                      <input
                        type="password"
                        value={invitePassword}
                        onChange={(e) => setInvitePassword(e.target.value)}
                        required
                        placeholder="Temporary password"
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                      >
                        <option value="admin">Admin</option>
                        <option value="developer">Developer</option>
                        <option value="viewer">Viewer</option>
                      </select>

                      {inviteMessage && <div className="text-xs text-slate-300">{inviteMessage}</div>}

                      <div className="flex gap-2 mt-2">
                        <Button type="submit" disabled={inviteLoading}>
                          {inviteLoading ? "Inviting…" : "Invite User"}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => {
                          setInviteEmail(""); setInvitePassword(""); setInviteRole("developer"); setInviteMessage("");
                        }}>
                          Reset
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </aside>
        </div>
      </main>

      {/* Provisioning overlay/modal (simple in-page overlay) */}
      {provisioning && (
        <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative pointer-events-auto w-full max-w-xl mx-4">
            <Card className="p-4">
              <CardContent>
                <div>
                  <h4 className="text-lg font-semibold">Provisioning Instances</h4>
                  <p className="text-sm text-slate-500 mt-2">Your instances are being provisioned — this may take a few seconds.</p>
                  <div className="mt-3 bg-slate-900 p-3 rounded text-xs text-slate-200 h-36 overflow-auto">
                    {provisionLogs.length === 0 ? (
                      <div>Starting...</div>
                    ) : (
                      provisionLogs.map((l, idx) => <div key={idx} className="mb-1">{l}</div>)
                    )}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button onClick={() => { setProvisioning(false); }}>Close</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
