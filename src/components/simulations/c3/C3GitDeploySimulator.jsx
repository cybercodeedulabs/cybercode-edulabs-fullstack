// src/components/simulations/c3/C3GitDeploySimulator.jsx
import React, { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export default function C3GitDeploySimulator() {
  const [repo, setRepo] = useState("https://github.com/cybercode/sample-app");
  const [branch, setBranch] = useState("main");
  const [logs, setLogs] = useState(
    "Connect a Git repo and C3 Cloud will build & deploy a classroom-ready lab."
  );
  const [deploying, setDeploying] = useState(false);

  function handleDeploy(e) {
    e.preventDefault();
    setDeploying(true);
    setLogs(
      `Connecting to ${repo} (branch: ${branch})…\n` +
        "⚙️ Installing dependencies…\n" +
        "📦 Building container image…\n" +
        "🚀 Spinning up preview URL…\n"
    );

    setTimeout(() => {
      setLogs((prev) => prev + "✅ Lab deployed at https://lab.c3cloud.dev/demo\n");
      setDeploying(false);
    }, 900);
  }

  return (
    <Card className="bg-slate-900/70 border border-slate-800">
      <CardContent className="p-5 space-y-4">
        <form onSubmit={handleDeploy} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Git repository
            </label>
            <Input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="bg-black/40 border-slate-700 text-sm"
            />
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">
                Branch
              </label>
              <Input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="bg-black/40 border-slate-700 text-sm"
              />
            </div>
            <Button type="submit" disabled={deploying} className="text-sm">
              {deploying ? "Deploying…" : "Deploy Lab"}
            </Button>
          </div>
        </form>

        <pre className="bg-black/60 text-xs text-slate-200 rounded-lg p-3 h-40 overflow-auto font-mono whitespace-pre-wrap">
          {logs}
        </pre>
      </CardContent>
    </Card>
  );
}
