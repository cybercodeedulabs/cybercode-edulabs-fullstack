// /src/components/simulations/ccna/VLANTrafficFlowSimulator.jsx
import React, { useState, useRef } from "react";

/**
 * VLANTrafficFlowSimulator
 *
 * A lightweight interactive simulation to demonstrate:
 * - VLAN segmentation (Access ports)
 * - Trunk links carrying multiple VLANs (802.1Q tags)
 * - Broadcast isolation (broadcasts stay within VLAN)
 * - Inter-VLAN traffic requires a router (simulated here)
 *
 * This component uses no external libraries and relies on Tailwind classes.
 * Place this file at: /src/components/simulations/ccna/VLANTrafficFlowSimulator.jsx
 *
 * Usage: import and render <VLANTrafficFlowSimulator /> inside lessons.
 */

const initialHosts = [
  { id: "H1", name: "HR-PC-1", vlan: 10, side: "left" },
  { id: "H2", name: "HR-PC-2", vlan: 10, side: "left" },
  { id: "H3", name: "IT-PC-1", vlan: 20, side: "left" },
  { id: "H4", name: "SALES-PC-1", vlan: 30, side: "right" },
  { id: "H5", name: "SALES-PC-2", vlan: 30, side: "right" },
  { id: "R1", name: "Router (Inter-VLAN)", vlan: null, side: "right", isRouter: true },
];

const vlanColors = {
  10: "bg-green-100 border-green-400 text-green-800",
  20: "bg-indigo-100 border-indigo-400 text-indigo-800",
  30: "bg-yellow-100 border-yellow-400 text-yellow-800",
  tag: "bg-slate-100 border-slate-300 text-slate-700",
};

export default function VLANTrafficFlowSimulator() {
  const [hosts] = useState(initialHosts);
  const [srcHostId, setSrcHostId] = useState("H1");
  const [dstHostId, setDstHostId] = useState("H2");
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [logs, setLogs] = useState([
    "Simulator ready — choose source & destination and click Send Packet.",
  ]);
  const [trunkEnabled, setTrunkEnabled] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [animPackets, setAnimPackets] = useState([]); // array of running packet animations
  const nextAnimId = useRef(1);

  const pushLog = (msg) =>
    setLogs((s) => {
      const next = [...s, `${new Date().toLocaleTimeString()} — ${msg}`];
      return next.slice(-12);
    });

  function reset() {
    setLogs(["Simulator reset — ready."]);
    setAnimPackets([]);
  }

  function findHost(id) {
    return hosts.find((h) => h.id === id);
  }

  // Simulate packet traversal with timeouts and logs + optional animation markers
  function sendPacket() {
    const src = findHost(srcHostId);
    const dst = findHost(dstHostId);

    if (!src) return;
    pushLog(`Packet created at ${src.name} (VLAN ${src.vlan ?? "N/A"})`);

    const animId = nextAnimId.current++;
    setAnimPackets((s) => [...s, { id: animId, src: src.id, step: 0 }]);

    // Step 1: Access port -> switch (left or right)
    setTimeout(() => {
      pushLog(`${src.name} -> switch (access port). Tag: ${src.vlan ?? "untagged"}`);
      advanceAnim(animId);
    }, 500);

    // Step 2: If source and destination are on same side (same switch) or trunk exists, forward
    setTimeout(() => {
      // If broadcast: send to all hosts in same VLAN as src
      if (isBroadcast) {
        pushLog(`Broadcast from ${src.name}: moving to VLAN ${src.vlan} hosts.`);
        advanceAnim(animId);
        // deliver to each host in same VLAN (excluding source)
        hosts
          .filter((h) => h.vlan === src.vlan && h.id !== src.id)
          .forEach((h, i) => {
            setTimeout(() => {
              pushLog(`Delivered (broadcast) to ${h.name}`);
              flashHost(h.id);
            }, 300 * (i + 1));
          });
        // finish
        setTimeout(() => {
          pushLog("Broadcast completed within VLAN (did NOT cross to other VLANs).");
          finishAnim(animId);
        }, 1200);
        return;
      }

      // Not broadcast — unicast handling
      if (!dst) {
        pushLog("Destination host not found.");
        finishAnim(animId);
        return;
      }

      // If same VLAN and trunk/switch path exists — deliver directly
      if (dst.vlan === src.vlan) {
        pushLog(`Destination ${dst.name} is in same VLAN ${dst.vlan}. Forwarding...`);
        advanceAnim(animId);
        setTimeout(() => {
          pushLog(`Delivered to ${dst.name} ✅`);
          flashHost(dst.id);
          finishAnim(animId);
        }, 800);
        return;
      }

      // Different VLANs — requires router (inter-VLAN) or L3 switch
      pushLog(`Destination ${dst.name} is in VLAN ${dst.vlan}. Inter-VLAN routing required.`);

      // If router present and reachable via trunk + trunk enabled
      const router = hosts.find((h) => h.isRouter);
      if (!router) {
        pushLog("No router available — packet dropped at switch.");
        finishAnim(animId);
        return;
      }

      if (!trunkEnabled) {
        pushLog("Trunk link disabled — VLAN tags won't traverse; packet dropped.");
        finishAnim(animId);
        return;
      }

      // Simulate trunk tag and router handling
      setTimeout(() => {
        pushLog(`Tagging frame with VLAN ${src.vlan} (802.1Q) and forwarding on trunk...`);
        advanceAnim(animId);
      }, 600);

      setTimeout(() => {
        pushLog(`Router (${router.name}) received tagged frame on subinterface (${src.vlan}).`);
        advanceAnim(animId);
      }, 1200);

      setTimeout(() => {
        pushLog(`Router performs routing and forwards to VLAN ${dst.vlan} (via trunk).`);
        advanceAnim(animId);
      }, 1700);

      setTimeout(() => {
        if (!trunkEnabled) {
          pushLog("Trunk disabled on return path — packet cannot reach destination.");
          finishAnim(animId);
          return;
        }
        pushLog(`Untagging frame on access port for ${dst.name} — Delivered ✅`);
        flashHost(dst.id);
        finishAnim(animId);
      }, 2300);
    }, 1000);

    // Optionally show VLAN tags visually if showTags true
    if (showTags) {
      pushLog("802.1Q VLAN tags will be shown in simulation visuals.");
    } else {
      pushLog("802.1Q VLAN tags hidden (visual).");
    }
  }

  function advanceAnim(animId) {
    setAnimPackets((arr) => arr.map((a) => (a.id === animId ? { ...a, step: a.step + 1 } : a)));
  }
  function finishAnim(animId) {
    setAnimPackets((arr) => arr.filter((a) => a.id !== animId));
  }

  // Very small host "flash" indicator when delivered
  const [flashes, setFlashes] = useState({});
  function flashHost(id) {
    setFlashes((f) => ({ ...f, [id]: true }));
    setTimeout(() => setFlashes((f) => ({ ...f, [id]: false })), 800);
  }

  // UI helpers
  const srcOptions = hosts.filter((h) => !h.isRouter);
  const dstOptions = hosts.filter((h) => !h.isRouter);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 shadow-md">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
        🛰️ VLAN Traffic Flow Simulator
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Source Host</label>
          <select
            value={srcHostId}
            onChange={(e) => setSrcHostId(e.target.value)}
            className="mt-2 w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          >
            {srcOptions.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} (VLAN {h.vlan})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Destination Host</label>
          <select
            value={dstHostId}
            onChange={(e) => setDstHostId(e.target.value)}
            className="mt-2 w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
            disabled={isBroadcast}
          >
            {dstOptions.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} (VLAN {h.vlan})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Controls</label>
          <div className="flex gap-2">
            <button
              onClick={sendPacket}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              ▶ Send Packet
            </button>
            <button onClick={reset} className="px-4 py-2 bg-gray-200 rounded-md">
              ↺ Reset
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              id="broadcast"
              type="checkbox"
              checked={isBroadcast}
              onChange={(e) => setIsBroadcast(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="broadcast" className="text-sm text-gray-600 dark:text-gray-300">
              Broadcast (within VLAN)
            </label>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              id="trunkEnabled"
              type="checkbox"
              checked={trunkEnabled}
              onChange={(e) => setTrunkEnabled(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="trunkEnabled" className="text-sm text-gray-600 dark:text-gray-300">
              Trunk Link Enabled
            </label>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              id="showTags"
              type="checkbox"
              checked={showTags}
              onChange={(e) => setShowTags(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="showTags" className="text-sm text-gray-600 dark:text-gray-300">
              Show 802.1Q Tags
            </label>
          </div>
        </div>
      </div>

      {/* Visualization area */}
      <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Left switch + hosts */}
        <div className="col-span-1 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Switch A</div>
          <div className="space-y-2">
            {hosts
              .filter((h) => h.side === "left")
              .map((h) => (
                <div
                  key={h.id}
                  className={`flex items-center justify-between p-2 rounded border ${h.vlan ? vlanColors[h.vlan] : "bg-white"} ${
                    flashes[h.id] ? "ring-4 ring-indigo-300" : ""
                  }`}
                >
                  <div className="text-sm">
                    <div className="font-semibold">{h.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {h.isRouter ? "Router (L3)" : `Access port — VLAN ${h.vlan}`}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{h.id}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Trunk link / core */}
        <div className="col-span-1 p-3 flex flex-col items-center justify-center">
          <div className="p-4 rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 w-full">
            <div className="text-center mb-2 text-sm text-gray-600 dark:text-gray-300">Trunk Link</div>

            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-24 h-12 rounded-md border flex items-center justify-center text-sm">Switch A</div>
              </div>

              <div
                className={`h-12 w-48 flex items-center justify-center rounded-md border ${
                  trunkEnabled ? "bg-indigo-50 border-indigo-300" : "bg-gray-100 border-gray-300"
                }`}
              >
                <div className="text-xs font-mono">{trunkEnabled ? "Trunk Active (802.1Q)" : "Trunk Disabled"}</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-28 h-12 rounded-md border flex items-center justify-center text-sm">Switch B / Router</div>
              </div>
            </div>

            {/* Running packet indicators */}
            <div className="mt-3 space-y-1">
              {animPackets.map((p) => (
                <div key={p.id} className="text-xs text-gray-600 dark:text-gray-300">
                  Packet #{p.id} — step {p.step}
                </div>
              ))}
            </div>
          </div>

          {/* Tag legend */}
          <div className="mt-3 w-full flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-green-100 border-green-400" />
              <div>VLAN 10</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-indigo-100 border-indigo-400" />
              <div>VLAN 20</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border bg-yellow-100 border-yellow-400" />
              <div>VLAN 30</div>
            </div>
          </div>
        </div>

        {/* Right switch + hosts */}
        <div className="col-span-1 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Switch B</div>
          <div className="space-y-2">
            {hosts
              .filter((h) => h.side === "right")
              .map((h) => (
                <div
                  key={h.id}
                  className={`flex items-center justify-between p-2 rounded border ${h.vlan ? vlanColors[h.vlan] : "bg-white"} ${
                    flashes[h.id] ? "ring-4 ring-indigo-300" : ""
                  }`}
                >
                  <div className="text-sm">
                    <div className="font-semibold">{h.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {h.isRouter ? "Router (L3)" : `Access port — VLAN ${h.vlan}`}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{h.id}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="mt-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Simulation Log</div>
        <div className="h-44 overflow-auto p-3 bg-black text-green-300 font-mono rounded">
          {logs.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap text-xs">
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
