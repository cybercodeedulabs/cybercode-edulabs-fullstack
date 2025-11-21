// /src/components/simulations/c3/C3AdvancedSimulator.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * C3AdvancedSimulator
 * - Lightweight, visual, and interactive simulator for C3 Cloud instance lifecycle
 * - Uses CPU/GPU-friendly transforms (framer-motion + CSS)
 * - Uses the provided architecture image path for the diagram preview
 *
 * NOTE: image URL uses local path you uploaded. Your build system will transform it if needed:
 * "/mnt/data/c3-architecture.png"
 */

const STEPS = [
  { key: "git", label: "Fetch Git" },
  { key: "orchestrator", label: "Orchestrator" },
  { key: "iam", label: "Apply IAM" },
  { key: "network", label: "Network Setup" },
  { key: "storage", label: "Attach Storage" },
  { key: "worker", label: "Provision Worker" },
  { key: "finalize", label: "Finalize & Ready" },
];

const LOGS_TEMPLATE = {
  git: [
    'Cloning repository "c3-sample-app"...',
    "Checking out main branch",
    "Found Dockerfile; building image",
    "Image build complete",
  ],
  orchestrator: [
    "Scheduling job to cluster controller",
    "Evaluating resource availability",
    "Picking node with least load",
  ],
  iam: [
    "Creating student role (least-privilege)",
    "Attaching policy: s3:read, logs:write",
    "Issuing short-lived token",
  ],
  network: [
    "Creating VPC namespace",
    "Allocating ephemeral IPs",
    "Applying network policy (egress-restricted)",
  ],
  storage: [
    "Provisioning 20GB block storage",
    "Mounting volume to workspace",
    "Setting lifecycle (auto-cleanup 90m)",
  ],
  worker: [
    "Spawning container runtime",
    "Starting container from image",
    "Health checks passed",
  ],
  finalize: ["Applying metadata", "Marking sandbox ready ✅"],
};

function useAutoScroll(ref) {
  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight;
  });
}

/* Simple colored glow variants for module highlight */
const highlightVariants = {
  idle: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
  active: {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(34,211,238,0.14)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function C3AdvancedSimulator({ compact = false }) {
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [logLines, setLogLines] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const logRef = useRef(null);
  useAutoScroll(logRef);

  // control animation timing per step
  useEffect(() => {
    if (!running) return;

    let mounted = true;
    const runSteps = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        if (!mounted) break;
        const step = STEPS[i];
        setStepIndex(i);
        setActiveModule(step.key);

        // push logs associated with step with small delays
        const logs = LOGS_TEMPLATE[step.key] || [`Processing ${step.label}...`];
        for (let j = 0; j < logs.length; j++) {
          if (!mounted) break;
          await new Promise((res) => setTimeout(res, 450 + Math.random() * 300));
          setLogLines((s) => [...s, `> ${logs[j]}`]);
        }

        // brief pause after step to let flows animate
        await new Promise((res) => setTimeout(res, 350));
      }

      // finalize
      if (mounted) {
        setActiveModule("finalize");
        await new Promise((res) => setTimeout(res, 500));
        setLogLines((s) => [...s, "> Sandbox ready ✅"]);
        setStepIndex(STEPS.length - 1);
        setRunning(false);
      }
    };

    runSteps();

    return () => {
      mounted = false;
    };
  }, [running]);

  const handleStart = () => {
    setLogLines([
      `⭑ Starting demo run — ${new Date().toLocaleTimeString()}`,
      "> Initializing C3 orchestration...",
    ]);
    setStepIndex(-1);
    setActiveModule(null);
    setRunning(true);
  };

  const handleReset = () => {
    setRunning(false);
    setStepIndex(-1);
    setActiveModule(null);
    setLogLines([]);
  };

  const moduleClass = (key) =>
    `rounded-xl p-4 min-w-[160px] flex-shrink-0 text-left ${activeModule === key ? "bg-slate-800/80" : "bg-slate-900/70"}`;

  return (
    <section className={`py-10 ${compact ? "px-4" : "px-6"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white">Advanced Cloud Simulator</h3>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Visualize how C3 provisions an instance: Git → Orchestrator → IAM / Network / Storage → Worker.
              Interactive, safe demo — shows internal flows and logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStart}
              disabled={running}
              className={`px-4 py-2 rounded-md font-medium transition ${
                running ? "bg-slate-700 text-slate-300 cursor-not-allowed" : "bg-cyan-500 text-slate-900 hover:scale-[1.02]"
              }`}
            >
              ▶ Run Demo
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Layout: left = modules & flows, right = logs + diagram preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: modules & flow lines */}
          <div className="lg:col-span-7">
            {/* Module row */}
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-center overflow-x-auto py-2 px-1">
                {/* Git module */}
                <motion.div
                  variants={highlightVariants}
                  animate={activeModule === "git" ? "active" : "idle"}
                  className={moduleClass("git")}
                >
                  <div className="font-semibold text-white">Git</div>
                  <div className="text-xs text-slate-400 mt-1">Source repository & CI trigger</div>
                </motion.div>

                {/* Orchestrator */}
                <motion.div
                  variants={highlightVariants}
                  animate={activeModule === "orchestrator" ? "active" : "idle"}
                  className={moduleClass("orchestrator")}
                >
                  <div className="font-semibold text-white">Orchestrator</div>
                  <div className="text-xs text-slate-400 mt-1">Schedules & deploys to nodes</div>
                </motion.div>

                {/* IAM */}
                <motion.div
                  variants={highlightVariants}
                  animate={activeModule === "iam" ? "active" : "idle"}
                  className={moduleClass("iam")}
                >
                  <div className="font-semibold text-white">IAM</div>
                  <div className="text-xs text-slate-400 mt-1">Roles, policies, short tokens</div>
                </motion.div>

                {/* Network */}
                <motion.div
                  variants={highlightVariants}
                  animate={activeModule === "network" ? "active" : "idle"}
                  className={moduleClass("network")}
                >
                  <div className="font-semibold text-white">Network</div>
                  <div className="text-xs text-slate-400 mt-1">VPC, namespaces, policies</div>
                </motion.div>

                {/* Storage */}
                <motion.div
                  variants={highlightVariants}
                  animate={activeModule === "storage" ? "active" : "idle"}
                  className={moduleClass("storage")}
                >
                  <div className="font-semibold text-white">Storage</div>
                  <div className="text-xs text-slate-400 mt-1">Volumes & lifecycle</div>
                </motion.div>

                {/* Worker */}
                <motion.div
                  variants={highlightVariants}
                  animate={activeModule === "worker" ? "active" : "idle"}
                  className={moduleClass("worker")}
                >
                  <div className="font-semibold text-white">Worker</div>
                  <div className="text-xs text-slate-400 mt-1">Container runtime & checks</div>
                </motion.div>
              </div>

              {/* Flow SVG (simple animated arrows) */}
              <div className="relative px-2">
                <svg viewBox="0 0 1200 120" className="w-full h-24">
                  {/* small static bezier arrows representing flow lanes */}
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
                    </linearGradient>
                    <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                    </filter>
                  </defs>

                  {/* Flow path */}
                  <motion.path
                    d="M20 80 C200 20, 400 20, 580 80 S980 140,1180 80"
                    stroke="url(#g1)"
                    strokeWidth="3"
                    fill="transparent"
                    strokeLinecap="round"
                    style={{ filter: "url(#f1)" }}
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: running ? [0, 1, 0.9] : 0,
                    }}
                    transition={{ duration: 3.5, repeat: running ? Infinity : 0, ease: "easeInOut" }}
                  />
                </svg>
                <div className="text-xs text-slate-400 mt-2">Animated data flow (visual)</div>
              </div>

              {/* Status Pips / Steps */}
              <div className="flex gap-3 items-center pt-2">
                {STEPS.map((s, idx) => {
                  const active = idx <= stepIndex;
                  return (
                    <div key={s.key} className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          active ? "bg-cyan-500 text-slate-900" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {active ? "✓" : idx + 1}
                      </div>
                      <div className="text-xs text-slate-300 hidden md:block">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: logs + architecture preview */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live logs panel */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/90 shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/70 bg-[#020617]/80">
                <div className="text-sm font-medium text-cyan-200">Live Logs</div>
                <div className="text-xs text-slate-400">Demo console</div>
              </div>

              <div ref={logRef} className="p-4 h-44 overflow-auto">
                {logLines.length === 0 ? (
                  <div className="text-xs text-slate-500">Logs will appear here when you run the demo.</div>
                ) : (
                  <pre className="font-mono text-[13px] leading-relaxed text-cyan-100/95 whitespace-pre-wrap">
                    {logLines.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </pre>
                )}
              </div>

              <div className="px-4 py-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
                <div>Sandbox lifecycle — ephemeral, secure, per-student</div>
                <div>{running ? "Running…" : stepIndex >= 0 ? "Completed" : "Idle"}</div>
              </div>
            </div>

            {/* Architecture preview */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/80">
              <div className="px-4 py-3 border-b border-slate-800/60 bg-[#061425]/70">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-white">Architecture</div>
                  <div className="text-xs text-slate-400">High-level</div>
                </div>
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <img
                    src="/images/c3-architecture.png"
                    alt="C3 Architecture"
                    className="w-full h-40 object-contain rounded-md border border-slate-800/50"
                    style={{ background: "linear-gradient(180deg,#071021, #03101a)" }}
                  />
                </div>

                <div className="w-36">
                  <div className="text-xs text-slate-300 font-semibold mb-2">Key points</div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Secure per-student sandboxes</li>
                    <li>• Git-driven deployments</li>
                    <li>• IAM & network isolation</li>
                    <li>• Auto-cleanup jobs</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="text-xs text-slate-400">
              Tip: this is a safe visual demo. For a real live terminal, we will integrate a streamed WebSocket session (Phase 2).
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
