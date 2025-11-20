// src/components/simulations/c3/C3SandboxSimulator.jsx
import React, { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";

const ENVIRONMENTS = [
  { id: "python", label: "Python Lab", size: "1 vCPU • 1GB" },
  { id: "devops", label: "DevOps Lab", size: "2 vCPU • 2GB" },
  { id: "golang", label: "Golang API Lab", size: "1 vCPU • 2GB" },
  { id: "kube", label: "Kubernetes Cluster", size: "2 vCPU • 4GB" },
];

export default function C3SandboxSimulator() {
  const [activeEnv, setActiveEnv] = useState("python");
  const [status, setStatus] = useState(
    "Pick a lab to see how C3 Cloud provisions isolated sandboxes."
  );

  function handleSelect(env) {
    setActiveEnv(env.id);
    setStatus(
      `Provisioning "${env.label}"…\n` +
        `• Allocating ${env.size}\n` +
        "• Attaching student policy\n" +
        "• Opening secure web IDE\n\nSandbox ready ✅"
    );
  }

  return (
    <Card className="bg-slate-900/70 border border-slate-800">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {ENVIRONMENTS.map((env) => (
            <Button
              key={env.id}
              size="sm"
              variant={activeEnv === env.id ? "default" : "outline"}
              className={
                activeEnv === env.id
                  ? "bg-cyan-500 text-white"
                  : "border-slate-700 text-slate-200"
              }
              onClick={() => handleSelect(env)}
            >
              {env.label}
            </Button>
          ))}
        </div>

        <pre className="mt-3 bg-black/60 text-xs text-slate-200 rounded-lg p-3 h-40 overflow-auto font-mono whitespace-pre-wrap">
          {status}
        </pre>

        <p className="text-xs text-slate-400">
          This is a demo view – in the real console, each lab runs in its own
          isolated sandbox with per-student quotas and auto-cleanup timers.
        </p>
      </CardContent>
    </Card>
  );
}
