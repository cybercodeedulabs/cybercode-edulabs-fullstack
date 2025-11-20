// src/components/simulations/c3/C3DemoZone.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const TOP_TABS = [
  { id: "safe", label: "Safe Sandboxes" },
  { id: "git", label: "Git Auto-Deploy" },
  { id: "iam", label: "IAM Roles" },
  { id: "terminal", label: "Live Terminal", disabled: true },
];

const LAB_TABS = [
  { id: "python", label: "Python Lab" },
  { id: "devops", label: "DevOps Lab" },
  { id: "golang", label: "Golang API Lab" },
  { id: "k8s", label: "Kubernetes Cluster" },
];

const LOGS_BY_SCENARIO = {
  safe: `Provisioning "Kubernetes Cluster"...
• Allocating 2 vCPU • 4GB RAM
• Attaching student policy
• Opening secure web IDE

Sandbox ready ✅  (per-student, auto-cleanup in 90 mins)`,
  git: `Deploying from Git repo "c3-sample-app"...
• Cloning main branch
• Building container image
• Running smoke tests
• Rolling out to student sandbox

Git auto-deploy completed ✅`,
  iam: `Configuring IAM roles for "Cloud Security Lab"...
• Creating student role with least-privilege
• Attaching read-only S3 & CloudWatch policies
• Issuing temporary credentials

IAM configuration applied ✅`,
  terminal: `Connecting to live terminal...
• Allocating ephemeral pod
• Mounting home directory
• Streaming logs to browser

This is a demo view — real terminal coming in the next phase.`,
};

export default function C3DemoZone() {
  const [topTab, setTopTab] = useState("safe");
  const [labTab, setLabTab] = useState("k8s");

  const currentLog = LOGS_BY_SCENARIO[topTab];

  return (
    <section className="bg-neutral-900 px-6 pb-20 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Explore C3 Cloud in 60 seconds
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300 max-w-3xl">
            Switch between tabs to see how C3 Cloud provisions sandboxes, deploys
            from Git, controls IAM roles and exposes a secure shell — all from a
            single education-first platform.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl overflow-hidden">
          {/* Top tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 bg-slate-950/80 px-4 pt-4 pb-3">
            {TOP_TABS.map((tab) => {
              const active = tab.id === topTab;
              return (
                <button
                  key={tab.id}
                  disabled={tab.disabled}
                  onClick={() => !tab.disabled && setTopTab(tab.id)}
                  className={[
                    "px-4 py-2 rounded-full text-sm font-medium transition",
                    tab.disabled
                      ? "bg-slate-900 text-slate-600 cursor-not-allowed"
                      : active
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.55)]"
                      : "bg-slate-900 text-slate-200 hover:bg-slate-800",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Lab tabs */}
          <div className="flex flex-wrap gap-2 px-4 pt-4 pb-3 border-b border-slate-900/80">
            {LAB_TABS.map((tab) => {
              const active = tab.id === labTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLabTab(tab.id)}
                  className={[
                    "px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition",
                    active
                      ? "bg-slate-800 text-cyan-300 border border-cyan-500/40"
                      : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Neon terminal */}
          <div className="px-4 pt-4 pb-5">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-cyan-500/40 bg-[#020617] shadow-[0_0_40px_rgba(34,211,238,0.35)] overflow-hidden"
            >
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-cyan-500/20 bg-[#020617]/80">
                <div className="flex items-center gap-2 text-xs text-cyan-100/80">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="font-mono uppercase tracking-wide">
                    {labTab === "k8s" && "Kubernetes Cluster Sandbox"}
                    {labTab === "python" && "Python Lab Sandbox"}
                    {labTab === "devops" && "DevOps Lab Sandbox"}
                    {labTab === "golang" && "Golang API Lab Sandbox"}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-slate-900 text-slate-300 font-medium">
                  Demo preview
                </span>
              </div>

              {/* Terminal body */}
              <div className="px-4 py-3">
                <pre className="font-mono text-[13px] leading-relaxed text-cyan-100/95 whitespace-pre-wrap">
{currentLog}
                </pre>
              </div>
            </motion.div>

            <p className="mt-3 text-xs text-slate-400">
              This is a demo view — in the real console, each lab runs in its own
              isolated sandbox with per-student quotas and auto-cleanup timers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
