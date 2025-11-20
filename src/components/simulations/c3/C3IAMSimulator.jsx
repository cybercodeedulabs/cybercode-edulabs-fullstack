// src/components/simulations/c3/C3IAMSimulator.jsx
import React, { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";

const ROLE_TEMPLATES = {
  student: ["Read-only labs", "Run commands", "View logs"],
  ta: ["Student privileges", "Restart sandboxes", "View usage"],
  instructor: ["TA privileges", "Create labs", "Manage cohorts"],
};

const ROLE_LIST = [
  { id: "student", label: "Student" },
  { id: "ta", label: "Teaching Assistant" },
  { id: "instructor", label: "Instructor" },
];

export default function C3IAMSimulator() {
  const [role, setRole] = useState("student");

  return (
    <Card className="bg-slate-900/70 border border-slate-800">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {ROLE_LIST.map((r) => (
            <Button
              key={r.id}
              size="sm"
              variant={role === r.id ? "default" : "outline"}
              className={
                role === r.id
                  ? "bg-emerald-500 text-white"
                  : "border-slate-700 text-slate-200"
              }
              onClick={() => setRole(r.id)}
            >
              {r.label}
            </Button>
          ))}
        </div>

        <div className="mt-3">
          <p className="text-xs text-slate-400 mb-2">
            Effective permissions for <span className="font-semibold">{role}</span>{" "}
            role:
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs">
            {ROLE_TEMPLATES[role].map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 bg-black/50 border border-slate-800 rounded-lg px-3 py-2"
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-slate-200">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-400">
          In the real product, IAM is mapped to your org structure — departments,
          batches and project teams — with audit logs & approvals.
        </p>
      </CardContent>
    </Card>
  );
}
