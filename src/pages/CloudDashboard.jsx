// src/pages/CloudDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useIAM } from "../contexts/IAMContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * 🪶 C3 Cloud Console Dashboard
 * - IAM protected area (redirects if unauthenticated)
 * - AWS-style layout with dark shady header
 */

export default function CloudDashboard() {
  const { iamUser, logoutIAM, registerIAMUser } = useIAM();
  const navigate = useNavigate();

  const [instances, setInstances] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loadingInstances, setLoadingInstances] = useState(false);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [error, setError] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteRole, setInviteRole] = useState("developer");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!iamUser) navigate("/cloud/login");
  }, [iamUser, navigate]);

  const api = {
    listInstances: "/api/cloud/instances",
    getUsage: "/api/cloud/usage",
  };

  useEffect(() => {
    if (iamUser) {
      fetchInstances();
      fetchUsage();
    }
  }, [iamUser]);

  async function fetchInstances() {
    setLoadingInstances(true);
    try {
      const res = await fetch(api.listInstances);
      const data = await res.json();
      setInstances(data.instances || []);
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
      const res = await fetch(api.getUsage);
      const data = await res.json();
      setUsage(data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsage(false);
    }
  }

  function handleCreateWorkspace() {
    navigate("/cloud");
  }

  function handleSignOut() {
    logoutIAM();
    navigate("/cloud/login");
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-950 to-black text-slate-100">
      {/* ===== Header ===== */}
      <header className="backdrop-blur-md bg-slate-900/90 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="C3" className="h-8 w-8 rounded" />
            <div>
              <div className="text-sm font-semibold tracking-wide">C3 Cloud Console</div>
              <div className="text-xs text-slate-400">by Cybercode EduLabs</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:block text-slate-300">
              {iamUser?.email}
            </span>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* ===== Main Body ===== */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-white/10 backdrop-blur-lg border border-slate-800">
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Welcome, {iamUser?.email}</h2>
                  <p className="text-sm text-slate-300 mt-1">
                    Manage your C3 workspaces, monitor usage, and collaborate securely.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button onClick={handleCreateWorkspace}>Create Workspace</Button>
                    <Button variant="secondary" onClick={() => navigate("/cloud/deploy")}>
                      Deploy from Repo
                    </Button>
                    <Button variant="ghost" onClick={() => navigate("/cloud")}>
                      Explore Plans
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Role</div>
                  <div className="text-sm font-medium">{iamUser?.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ===== Instances + Usage Side by Side ===== */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left – Instances */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="text-lg font-semibold mb-3">Your Workspaces</h3>
            {loadingInstances ? (
              <Card className="p-6 bg-white/10 text-center">Loading instances…</Card>
            ) : instances.length === 0 ? (
              <Card className="p-6 bg-white/10 text-center">
                <p className="text-slate-300">No active workspaces yet.</p>
                <div className="mt-4">
                  <Button onClick={handleCreateWorkspace}>Create Workspace</Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {instances.map((ins) => (
                  <Card key={ins.id} className="p-4 bg-white/10 border border-slate-800">
                    <CardContent>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{ins.name || ins.id}</div>
                          <div className="text-xs text-slate-400">
                            {ins.plan || "Student"} • {ins.status}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" asChild>
                            <a href={ins.url || "#"} target="_blank" rel="noreferrer">
                              Open
                            </a>
                          </Button>
                          <Button size="sm" variant="ghost">
                            Logs
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right – Usage + Invite */}
          <aside className="w-full lg:w-96 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-4 bg-white/10 border border-slate-800">
                <CardContent>
                  <h4 className="text-sm font-medium text-slate-200">Usage & Quotas</h4>
                  {loadingUsage ? (
                    <div className="mt-3 text-slate-400 text-sm">Loading…</div>
                  ) : usage ? (
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>CPU (vCPU)</span>
                        <span>{usage.cpuUsed}/{usage.cpuQuota}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage (GB)</span>
                        <span>{usage.storageUsed}/{usage.storageQuota}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Users</span>
                        <span>{usage.activeUsers || 0}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-slate-400 text-sm">
                      No usage data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* ===== Admin Invite IAM Users ===== */}
            {iamUser?.role === "admin" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <Card className="p-4 bg-white/10 border border-slate-800">
                  <CardContent>
                    <h4 className="text-sm font-medium text-slate-200">
                      Admin — Invite IAM User
                    </h4>
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
                      {inviteMessage && (
                        <div className="text-xs text-slate-300">{inviteMessage}</div>
                      )}
                      <div className="flex gap-2">
                        <Button type="submit" disabled={inviteLoading}>
                          {inviteLoading ? "Inviting…" : "Invite User"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setInviteEmail("");
                            setInvitePassword("");
                            setInviteRole("developer");
                            setInviteMessage("");
                          }}
                        >
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
    </div>
  );
}
