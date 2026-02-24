import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useIAM } from "../contexts/IAMContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * CloudDashboard (backend-backed)
 * - Uses API endpoints under /api/cloud/*
 * - Authorization: Bearer token from IAMContext.getToken()
 * - Added:
 *    ✔ Smart Auto polling (only when needed)
 *    ✔ Safe termination UX
 */

export default function CloudDashboard() {
  const { iamUser, logoutIAM, registerIAMUser, getToken } = useIAM();
  const orgPending = iamUser?.organization_status === "pending";
  const navigate = useNavigate();

  // UI state
  const [instances, setInstances] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loadingInstances, setLoadingInstances] = useState(false);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [error, setError] = useState("");

  const pollingRef = useRef(null);
  const [terminatingId, setTerminatingId] = useState(null);

  // Launch form state
  const [provisioning, setProvisioning] = useState(false);
  const [provisionMessage, setProvisionMessage] = useState("");
  const [launchPlan, setLaunchPlan] = useState("student");
  const [launchImage, setLaunchImage] = useState("ubuntu-22.04");
  const [launchCount, setLaunchCount] = useState(1);
  const [launchCPU, setLaunchCPU] = useState(1);
  const [launchRAM, setLaunchRAM] = useState(1);
  const [launchDisk, setLaunchDisk] = useState(2);
  const [provisionLogs, setProvisionLogs] = useState([]);

  // Invite state (admin)
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteRole, setInviteRole] = useState("developer");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");

  useEffect(() => {
    if (!iamUser) navigate("/cloud/login");
  }, [iamUser, navigate]);

  const API_BASE = import.meta.env.VITE_API_URL || "";

  const authHeaders = () => {
    const token = typeof getToken === "function" ? getToken() : null;
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  };

  useEffect(() => {
    if (iamUser) {
      fetchInstances();
      fetchUsage();
    }
    return () => stopPolling();
  }, [iamUser]);

  useEffect(() => {
    const hasPending = instances.some((i) =>
      ["creating", "provisioning", "stopping"].includes(
        (i.status || "").toLowerCase()
      )
    );

    if (hasPending) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [instances]);

  const startPolling = () => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(() => {
      fetchInstances();
      fetchUsage();
    }, 8000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  async function fetchInstances() {
    setLoadingInstances(true);
    try {
      const res = await fetch(`${API_BASE}/api/cloud/instances`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch instances");

      const js = await res.json();
      setInstances(js.instances || []);
    } catch (err) {
      console.error("fetchInstances error:", err);
      setError(err.message || "Could not load instances.");
    } finally {
      setLoadingInstances(false);
    }
  }

  async function fetchUsage() {
    setLoadingUsage(true);
    try {
      const res = await fetch(`${API_BASE}/api/cloud/usage`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch usage");

      const js = await res.json();
      setUsage({
        cpuUsed: js.cpuUsed ?? 0,
        cpuQuota: js.cpuQuota ?? 64,
        storageUsed: js.storageUsed ?? 0,
        storageQuota: js.storageQuota ?? 1024,
        activeUsers: js.activeUsers ?? 0,
      });
    } catch (err) {
      console.error("fetchUsage error:", err);
    } finally {
      setLoadingUsage(false);
    }
  }

  async function createInstancesApi(payload) {
    const res = await fetch(`${API_BASE}/api/cloud/instances`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const js = await res.json().catch(() => ({}));
      throw new Error(js.error || `Create failed (${res.status})`);
    }
    return res.json();
  }

  async function handleLaunchSubmit(e) {
    e.preventDefault();
    if (orgPending) return;

    setProvisionLogs([]);
    setProvisionMessage("Creating instances...");
    setProvisioning(true);
    setError("");

    const cfg = {
      image: launchImage,
      plan: launchPlan,
      count: Number(launchCount) || 1,
      cpu: Number(launchCPU) || 1,
      ram: Number(launchRAM) || 1,
      disk: Number(launchDisk) || 2,
    };

    try {
      const resp = await createInstancesApi(cfg);

      if (resp.instances) {
        setInstances((prev) => [...resp.instances, ...(prev || [])]);
      } else {
        await fetchInstances();
      }

      if (resp.usage) {
        setUsage(resp.usage);
      } else {
        await fetchUsage();
      }

      setProvisionLogs((p) => [...p, "✅ Instances created."]);
    } catch (err) {
      setProvisionLogs((p) => [...p, `❌ ${err.message}`]);
      setError(err.message);
    } finally {
      setProvisioning(false);
      setProvisionMessage("");
    }
  }

  async function createFreeInstance() {
    if (orgPending) return;

    setProvisioning(true);
    setProvisionMessage("Creating free instance...");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/cloud/free-instance`, {
        method: "POST",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Free instance failed");

      await fetchInstances();
      await fetchUsage();

      setProvisionLogs((p) => [...p, "✅ Free instance created."]);
    } catch (err) {
      setError(err.message);
    } finally {
      setProvisioning(false);
      setProvisionMessage("");
    }
  }

  async function handleTerminate(id) {
    if (!id || orgPending) return;

    const confirm = window.confirm(
      "Are you sure you want to terminate this workspace?"
    );
    if (!confirm) return;

    setTerminatingId(id);

    try {
      const res = await fetch(
        `${API_BASE}/api/cloud/instances/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        }
      );

      if (!res.ok) throw new Error("Terminate failed");

      await fetchInstances();
      await fetchUsage();
    } catch (err) {
      setError(err.message);
    } finally {
      setTerminatingId(null);
    }
  }

  async function handleInviteSubmit(e) {
    e.preventDefault();
    if (orgPending) return;

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
      setInviteMessage(`❌ ${err.message}`);
    } finally {
      setInviteLoading(false);
    }
  }

  function handleSignOut() {
    logoutIAM();
    navigate("/cloud/login");
  }

  const canLaunch = () => {
    if (orgPending) return false;
    if (!usage) return true;
    const projectedCPU = usage.cpuUsed + launchCPU * launchCount;
    const projectedStorage = usage.storageUsed + launchDisk * launchCount;
    return (
      projectedCPU <= usage.cpuQuota &&
      projectedStorage <= usage.storageQuota
    );
  };

  const userHasFreeInstance = () => {
    try {
      return instances.some(
        (i) => i.freeTier && i.owner === iamUser?.email
      );
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">

      <header className="backdrop-blur-lg bg-slate-900/90 border-b border-slate-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="C3 Cloud" className="h-9 w-9 rounded" />
            <div>
              <div className="text-sm font-semibold tracking-wide text-cyan-400">C3 Cloud Console</div>
              <div className="text-xs text-slate-400">by Cybercode EduLabs</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:block text-slate-300">{iamUser?.email}</span>
            <Button variant="secondary" onClick={handleSignOut}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {orgPending && (
          <Card className="p-6 bg-yellow-900/20 border border-yellow-600">
            <CardContent>
              <h3 className="text-lg font-semibold text-yellow-300">
                Organization Pending Approval
              </h3>
              <p className="text-sm text-yellow-200 mt-2">
                Your organization "{iamUser?.organization_name}" is under review.
                Cloud access will be enabled once approved.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ===== Free Instance CTA (visible only if user hasn't created it) ===== */}
        {!userHasFreeInstance() && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="p-6 bg-emerald-900/10 border border-emerald-700">
              <CardContent>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-300">🎁 Free Demo Instance</h3>
                    <p className="text-sm text-emerald-200 mt-1">Try C3 with a free demo instance (1 vCPU • 1GB RAM • 2GB Disk). Perfect for quick experiments.</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button onClick={createFreeInstance}>Launch Free Instance</Button>
                    <Button variant="ghost" onClick={() => { alert('Free instance is a lightweight demo. It will create a small VM with minimal resources.'); }}>More info</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                    <select value={launchPlan} onChange={(e) => setLaunchPlan(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm">
                      <option value="student">Student (free)</option>
                      <option value="edu">Edu+</option>
                      <option value="startup">Startup</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Image</label>
                    <select value={launchImage} onChange={(e) => setLaunchImage(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm">
                      <option value="ubuntu-22.04">Ubuntu 22.04</option>
                      <option value="ubuntu-20.04">Ubuntu 20.04</option>
                      <option value="python-lab">Python Lab (env)</option>
                      <option value="golang-lab">Golang Lab (env)</option>
                      <option value="devops-lab">DevOps Lab</option>
                      <option value="docker-lab">Docker Lab</option>
                      <option value="security-lab">Cyber Security Lab</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Instances</label>
                    <input type="number" min="1" max="10" value={launchCount} onChange={(e) => setLaunchCount(Math.max(1, Number(e.target.value)))} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm" />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">CPU (vCPU)</label>
                    <input type="number" min="1" max="8" value={launchCPU} onChange={(e) => setLaunchCPU(Math.max(1, Number(e.target.value)))} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm" />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">RAM (GB)</label>
                    <input type="number" min="1" max="32" value={launchRAM} onChange={(e) => setLaunchRAM(Math.max(1, Number(e.target.value)))} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm" />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Disk (GB)</label>
                    <input type="number" min="1" max="1024" value={launchDisk} onChange={(e) => setLaunchDisk(Math.max(1, Number(e.target.value)))} className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm" />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3 mt-2">
                    <Button type="submit" disabled={provisioning || orgPending || !canLaunch()}>{provisioning ? "Provisioning…" : "Create Cloud"}</Button>
                    <Button variant="ghost" type="button" onClick={() => { setLaunchPlan("student"); setLaunchImage("ubuntu-22.04"); setLaunchCount(1); setLaunchCPU(1); setLaunchRAM(1); setLaunchDisk(2); }}>Reset</Button>

                    {orgPending && (
                      <div className="text-xs text-yellow-400 ml-2">Organization is pending admin approval.</div>                      
                    )}
                    {orgPending && !canLaunch() && (
                      <div className="text-xs text-yellow-400 ml-2">Exceeds quota - adjust resources or upgrade plan.</div>                      
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
                    <Button onClick={() => createFreeInstance()} disabled={orgPending}>Create Free Workspace</Button>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {instances.map((ins) => (
                    <Card key={ins.id} className={`p-4 ${ins.freeTier ? "bg-emerald-900/5 border-emerald-700" : "bg-white/10 border-slate-800"}`}>
                      <CardContent>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-slate-100">{ins.name || ins.id} {ins.freeTier && <span className="ml-2 text-xs text-emerald-300">(Free demo)</span>}</div>
                            <div className="text-xs text-slate-400">{ins.image} • {ins.plan || "Student"} • {ins.status}</div>
                            <div className="text-xs text-slate-400 mt-2">{ins.cpu} vCPU • {ins.ram} GB RAM • {ins.disk} GB</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {/* <Button size="sm" asChild>
                              <a href={`/cloud/terminal?container=${ins.name}`} target="_blank" rel="noreferrer">Open</a>
                            </Button> */}
                            <Button
                              size="sm"
                              onClick={() => {
                                const url = `${window.location.origin}/cloud/terminal?container=${encodeURIComponent(ins.name)}`;
                                window.open(url, "_blank");
                              }}
                            >
                              Open
                            </Button>

                            <Button size="sm" variant="ghost" disabled={terminatingId === ins.id} onClick={() => handleTerminate(ins.id)}>{terminatingId === ins.id ? "Terminating..." : "Terminate"}</Button>
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
            {["admin", "org_admin"].includes(iamUser?.role) && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <Card className="p-4 bg-white/10 border border-slate-800">
                  <CardContent>
                    <h4 className="text-sm font-medium text-slate-200">Admin — Invite IAM User</h4>
                    <form onSubmit={handleInviteSubmit} className="mt-3 space-y-3">
                      <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required placeholder="Email" className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm" />
                      <input type="password" value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} required placeholder="Temporary password" className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm" />
                      <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm">
                        <option value="admin">Admin</option>
                        <option value="developer">Developer</option>
                        <option value="viewer">Viewer</option>
                      </select>

                      {inviteMessage && <div className="text-xs text-slate-300">{inviteMessage}</div>}

                      <div className="flex gap-2 mt-2">
                        <Button type="submit" disabled={inviteLoading}>{inviteLoading ? "Inviting…" : "Invite User"}</Button>
                        <Button type="button" variant="ghost" onClick={() => { setInviteEmail(""); setInvitePassword(""); setInviteRole("developer"); setInviteMessage(""); }}>Reset</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </aside>
        </div>
      </main>

      {/* Provisioning overlay/modal (simple, no fake steps) */}
      {provisioning && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-xl mx-4 pointer-events-auto">
            <Card className="p-4">
              <CardContent>
                <div>
                  <h4 className="text-lg font-semibold">Provisioning Instances</h4>
                  <p className="text-sm text-slate-500 mt-2">{provisionMessage || "Creating instances…"}</p>

                  <div className="mt-3 bg-slate-900 p-3 rounded text-xs text-slate-200 h-36 overflow-auto">
                    {provisionLogs.length === 0 ? (
                      <div>Processing…</div>
                    ) : (
                      provisionLogs.map((l, idx) => <div key={idx} className="mb-1">{l}</div>)
                    )}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button onClick={() => { setProvisioning(false); setProvisionMessage(""); }}>Close</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Global error banner (small) */}
      {error && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-70">
          <div className="bg-rose-700/90 text-white px-4 py-2 rounded shadow">{error}</div>
        </div>
      )}
    </div>
  );
}
