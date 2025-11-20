// src/components/simulations/c3/C3LiveTerminal.jsx
import React, { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";

const DEMO_OUTPUT = [
  "student@c3-lab:~$ kubectl get pods",
  "NAME                 READY   STATUS    RESTARTS   AGE",
  "api-deploy-6b7f9    1/1     Running   0          2m",
  "redis-7c9d8         1/1     Running   0          2m",
  "",
  "student@c3-lab:~$ docker ps",
  "CONTAINER ID   IMAGE               STATUS         PORTS",
  "a1b2c3d4e5     sample-app:latest   Up 2 minutes   0.0.0.0:8080->80/tcp",
];

export default function C3LiveTerminal() {
  const [lines, setLines] = useState([
    "student@c3-lab:~$ # Click 'Run demo command' to see output",
  ]);

  function handleRun() {
    setLines([
      "student@c3-lab:~$ # Connecting to secure terminal…",
      ...DEMO_OUTPUT,
      "",
      "✅ This is a read-only demo. Real labs expose a full Linux shell per student.",
    ]);
  }

  return (
    <Card className="bg-slate-900/70 border border-slate-800">
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-400">
            Read-only demo of a secure shell inside a C3 Cloud sandbox.
          </p>
          <Button size="sm" onClick={handleRun}>
            Run demo command
          </Button>
        </div>

        <div className="bg-black/70 rounded-lg border border-slate-800 h-44 overflow-auto">
          <pre className="p-3 text-xs text-emerald-200 font-mono whitespace-pre-wrap">
            {lines.join("\n")}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
