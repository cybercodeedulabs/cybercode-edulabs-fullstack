// src/components/simulations/CICDPipelineSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * CICDPipelineSimulator.jsx
 * Simulates a CI/CD pipeline with integrated security gates:
 * - Build → Unit Tests → SAST → Dependency Scan → Container Scan → Deploy
 * Learners can toggle which gates are enabled, introduce a misconfiguration,
 * and run the pipeline to see pass/fail and remediation hints.
 */

export default function CICDPipelineSimulator() {
  const initialGates = {
    build: true,
    unitTests: true,
    sast: true,
    dependencyScan: true,
    containerScan: true,
    deploy: true,
  };

  const [gates, setGates] = useState(initialGates);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [misconfig, setMisconfig] = useState({
    secretInCode: false,
    outdatedDep: false,
    insecureContainer: false,
  });
  const [result, setResult] = useState(null);

  const toggleGate = (k) => setGates((g) => ({ ...g, [k]: !g[k] }));

  const addLog = (msg) => setLogs((l) => [...l.slice(-12), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const reset = () => {
    setLogs([]);
    setResult(null);
    setRunning(false);
  };

  const runStep = (label, checkFn) =>
    new Promise((resolve) => {
      addLog(`Starting: ${label}`);
      setTimeout(() => {
        const ok = checkFn();
        addLog(ok ? `✅ ${label} passed` : `❌ ${label} failed`);
        resolve(ok);
      }, 900);
    });

  const runPipeline = async () => {
    reset();
    setRunning(true);
    setResult(null);

    // steps in order
    const steps = [
      { key: "build", label: "Build", check: () => true },
      { key: "unitTests", label: "Unit Tests", check: () => !misconfig.secretInCode },
      { key: "sast", label: "SAST (Static Analysis)", check: () => !misconfig.secretInCode },
      { key: "dependencyScan", label: "Dependency Vulnerability Scan", check: () => !misconfig.outdatedDep },
      { key: "containerScan", label: "Container Image Scan", check: () => !misconfig.insecureContainer },
      { key: "deploy", label: "Deploy to Staging", check: () => true },
    ];

    for (let s of steps) {
      if (!gates[s.key]) {
        addLog(`⚪ Skipped: ${s.label} (gate disabled)`);
        continue;
      }
      // run step
      // eslint-disable-next-line no-await-in-loop
      const ok = await runStep(s.label, s.check);
      if (!ok) {
        setResult({ success: false, failedStep: s.label });
        setRunning(false);
        addLog(`Pipeline halted due to failure at ${s.label}`);
        return;
      }
    }

    setResult({ success: true });
    addLog("🎉 Pipeline completed successfully — ready to promote.");
    setRunning(false);
  };

  const remediationHints = {
    secretInCode: "Secrets found in code — move to secrets manager and rotate secrets.",
    outdatedDep: "Outdated dependency with known CVE — update or apply mitigation.",
    insecureContainer: "Container has high-risk findings — rebuild image with minimal base and reprotect credentials.",
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">🔁 DevSecOps Pipeline Simulator</h3>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="font-semibold mb-2 text-sm">Security Gates (toggle)</div>
          <div className="space-y-2">
            {Object.keys(gates).map((k) => (
              <div key={k} className="flex items-center justify-between">
                <div className="capitalize text-sm">{k.replace(/([A-Z])/g, " $1")}</div>
                <button
                  onClick={() => toggleGate(k)}
                  className={`px-3 py-1 rounded text-sm font-medium ${gates[k] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {gates[k] ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="font-semibold mb-2 text-sm">Introduce Misconfiguration (simulate real-world issues)</div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={misconfig.secretInCode} onChange={() => setMisconfig((m) => ({ ...m, secretInCode: !m.secretInCode }))} />
              Secret in code
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={misconfig.outdatedDep} onChange={() => setMisconfig((m) => ({ ...m, outdatedDep: !m.outdatedDep }))} />
              Outdated dependency (vulnerable)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={misconfig.insecureContainer} onChange={() => setMisconfig((m) => ({ ...m, insecureContainer: !m.insecureContainer }))} />
              Insecure container image
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={runPipeline} disabled={running} className={`px-4 py-2 rounded ${running ? "bg-indigo-400 text-white cursor-wait" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
              {running ? "Running..." : "Run Pipeline"}
            </button>
            <button onClick={reset} className="px-4 py-2 rounded bg-gray-100">Reset</button>
          </div>
        </div>

        {/* Visualization & Logs */}
        <div>
          <div className="mb-3 font-semibold text-sm">Pipeline Visualization</div>
          <div className="space-y-3">
            {[
              { key: "build", label: "Build" },
              { key: "unitTests", label: "Unit Tests" },
              { key: "sast", label: "SAST" },
              { key: "dependencyScan", label: "Dependency Scan" },
              { key: "containerScan", label: "Container Scan" },
              { key: "deploy", label: "Deploy" },
            ].map((step, i) => {
              const enabled = gates[step.key];
              const status =
                logs.find((l) => l.includes(step.label + " passed")) ? "passed" : logs.find((l) => l.includes(step.label + " failed")) ? "failed" : enabled ? "pending" : "skipped";
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${status === "passed" ? "bg-green-100 text-green-700" : status === "failed" ? "bg-red-100 text-red-700" : status === "skipped" ? "bg-gray-100 text-gray-600" : "bg-indigo-50 text-indigo-700"}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">{step.label}</div>
                      <div className="text-xs text-gray-500">{enabled ? (status === "skipped" ? "Disabled" : status) : "Disabled"}</div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded mt-2 overflow-hidden">
                      <motion.div animate={{ width: status === "passed" ? "100%" : status === "failed" ? "100%" : status === "pending" ? "35%" : "5%" }} transition={{ duration: 0.9 }} className={`h-full ${status === "passed" ? "bg-green-500" : status === "failed" ? "bg-red-500" : status === "skipped" ? "bg-gray-300" : "bg-indigo-400"}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 h-36 overflow-auto font-mono text-xs">
            {logs.length === 0 ? <div className="text-gray-400 italic">Pipeline logs will appear here...</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>

          <div className="mt-3 text-sm">
            {result ? result.success ? <div className="text-green-600 font-semibold">Pipeline Success — ready for promotion</div> : <div className="text-red-600 font-semibold">Failed at: {result.failedStep}</div> : <div className="text-gray-600">Run the pipeline to see results and remediation hints.</div>}
            {!result?.success && Object.keys(misconfig).some((k) => misconfig[k]) && (
              <div className="mt-2 text-xs text-yellow-700">
                <div className="font-semibold">Remediation Hints</div>
                <ul className="list-disc pl-4">
                  {Object.keys(misconfig).filter((k) => misconfig[k]).map((k) => <li key={k}>{remediationHints[k]}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
