/* -------------------------------------------------------
   GlobalThreatSimulatorLab.jsx
   DigitalFort — Global Threat Simulator (Interactive View)
   Phase 1: Visualization + Intelligence Panel (UI only)
--------------------------------------------------------*/
import React from "react";
import GlobeSimulator from "../components/simulations/GlobeSimulator";

export default function GlobalThreatSimulatorLab() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">

      {/* --------------------------------------------------
         LEFT — GLOBE SIMULATOR
      -------------------------------------------------- */}
      <div className="flex-1 relative">
        <GlobeSimulator />
      </div>

      {/* --------------------------------------------------
         RIGHT — INTELLIGENCE PANEL
      -------------------------------------------------- */}
      <div className="w-full lg:w-[420px] bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-cyan-300 mb-4">
          Threat Intelligence Feed
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          Live simulated intelligence generated from DigitalFort sensors.
          This panel explains what the globe visualization represents.
        </p>

        {/* Feed Items */}
        <div className="space-y-4">

          <div className="p-4 rounded-lg bg-black border border-slate-700">
            <p className="text-cyan-300 font-semibold">
              Attack Detected
            </p>
            <p className="text-sm text-gray-300">
              Source: 🇺🇸 North America<br />
              Target: 🇮🇳 India<br />
              Type: Credential Stuffing<br />
              Severity: High
            </p>
          </div>

          <div className="p-4 rounded-lg bg-black border border-slate-700">
            <p className="text-cyan-300 font-semibold">
              AI Correlation Engine
            </p>
            <p className="text-sm text-gray-300">
              Pattern matches previous botnet behavior.
              Lateral movement probability: 72%.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-black border border-slate-700">
            <p className="text-cyan-300 font-semibold">
              Autonomous Action
            </p>
            <p className="text-sm text-gray-300">
              Rate-limiting enforced. IP ranges sandboxed.
              Payload captured for analysis.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-black border border-slate-700">
            <p className="text-cyan-300 font-semibold">
              Intelligence Update
            </p>
            <p className="text-sm text-gray-300">
              Threat signature added to DigitalFort dataset.
              Model retraining scheduled.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500">
          This is a simulated intelligence feed.
          Future phases will connect real telemetry,
          AI models, and private cyber ranges.
        </div>
      </div>
    </div>
  );
}
