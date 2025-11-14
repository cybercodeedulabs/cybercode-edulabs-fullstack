import React, { useState, useRef, useEffect } from "react";

/**
 * SecurityEventSimulator.jsx
 *
 * Place at: /src/components/simulations/ccna/SecurityEventSimulator.jsx
 *
 * Features:
 * - Simulate attacks: MAC Flood, DHCP Spoof, ARP Poison, BPDU Attack
 * - Toggle protections: Port Security, DHCP Snooping, DAI, BPDU Guard
 * - Visual topology (Access ports, Switch, Router)
 * - Logs, alerts, counters, simple animations
 * - Safe, deterministic simulation (no external libs)
 *
 * Styling: Tailwind classes to match your simulators
 */

const initialPorts = [
  { id: "p1", name: "Fa0/1", host: "Host-A", macs: ["00:11:11:01"], state: "up", violationCount: 0 },
  { id: "p2", name: "Fa0/2", host: "Host-B", macs: ["00:11:11:02"], state: "up", violationCount: 0 },
  { id: "p3", name: "Fa0/3", host: "Rogue-Host", macs: [], state: "up", violationCount: 0 },
];

export default function SecurityEventSimulator() {
  // topology & protections
  const [ports, setPorts] = useState(initialPorts);
  const [dhcpBindings, setDhcpBindings] = useState([]); // {ip,mac,port}
  const [arpTable, setArpTable] = useState([]); // {ip,mac,port}
  const [logs, setLogs] = useState(["Security Simulator ready — choose an attack or enable protections."]);
  const [alerts, setAlerts] = useState([]);
  const [prot, setProt] = useState({
    portSecurity: true,
    portSecurityMode: "restrict", // protect/restrict/shutdown (we'll implement restrict)
    portSecurityMax: 2,
    dhcpSnooping: true,
    dai: true,
    bpduGuard: true,
  });

  // running animations and timers
  const animRef = useRef({});
  const nextAnimId = useRef(1);

  // helper: push log (keeps last 120)
  const pushLog = (msg) => setLogs((s) => [...s.slice(-120), `${new Date().toLocaleTimeString()} — ${msg}`]);
  const pushAlert = (msg) => {
    setAlerts((a) => [...a.slice(-20), { id: Date.now(), msg }]);
    pushLog(`ALERT: ${msg}`);
  };

  // utility: update a port entry
  function updatePort(id, patch) {
    setPorts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  // clear simulation state
  function resetSim() {
    setPorts(initialPorts.map((p) => ({ ...p, macs: p.macs.length ? [...p.macs] : [], state: "up", violationCount: 0 })));
    setDhcpBindings([]);
    setArpTable([]);
    setLogs(["Simulator reset — ready."]);
    setAlerts([]);
    pushLog("Simulation reset");
  }

  /* -----------------------------
     Simulated actions (attacks & benign)
     -----------------------------*/

  // MAC Flood: rapidly send many unique MACs into a target port to overflow CAM table
  function attackMacFlood(targetPortId = "p3", packetCount = 80) {
    pushLog(`Starting MAC Flood on ${targetPortId} (${packetCount} frames)`);
    let count = 0;
    const id = nextAnimId.current++;
    animRef.current[`macflood-${id}`] = true;

    function step() {
      if (!animRef.current[`macflood-${id}`]) return;
      if (count >= packetCount) {
        pushLog(`MAC Flood on ${targetPortId} completed`);
        delete animRef.current[`macflood-${id}`];
        // evaluate CAM overflow -> switch starts flooding traffic: represented as alert
        pushAlert(`CAM table overflow at switch — flooding behavior observed`);
        return;
      }

      // create a random MAC
      const mac = `02:${Math.floor(Math.random() * 90 + 10).toString(16)}:${Math.floor(Math.random() * 90 + 10).toString(16)}:${Math.floor(Math.random() * 90 + 10).toString(16)}:${Math.floor(Math.random() * 90 + 10).toString(16)}:${Math.floor(Math.random() * 90 + 10).toString(16)}`.replace(/ /g, "0");
      // pretend switch learns it on targetPort (we'll just track count)
      count++;
      // simulate learning by adding to port.macs until portSecurity limit reached
      setPorts((prev) =>
        prev.map((p) => {
          if (p.id !== targetPortId) return p;
          const newMacs = (p.macs || []).slice();
          if (newMacs.indexOf(mac) === -1) newMacs.push(mac);
          let violation = p.violationCount;
          // Port security reaction
          if (prot.portSecurity && newMacs.length > prot.portSecurityMax) {
            violation = violation + 1;
            // act based on mode
            if (prot.portSecurityMode === "shutdown") {
              pushAlert(`${p.name} -> Shutdown due to port-security violation`);
              return { ...p, macs: newMacs, state: "err-disabled", violationCount: violation };
            } else if (prot.portSecurityMode === "restrict") {
              pushAlert(`${p.name} -> Restrict: dropped frames from violating MACs`);
              return { ...p, macs: newMacs, violationCount: violation };
            } else {
              // protect: drop without log
              return { ...p, macs: newMacs, violationCount: violation };
            }
          }
          return { ...p, macs: newMacs, violationCount: violation };
        })
      );

      // animate small pulse on the port (we push log)
      if (count % 10 === 0) pushLog(`MAC Flood: ${count}/${packetCount} frames injected on ${targetPortId}`);
      setTimeout(step, 60); // rapid but not fully instant
    }

    step();
  }

  // DHCP Spoof: rogue DHCP server offers addresses to clients
  function attackDhcpSpoof(roguePortId = "p3") {
    pushLog(`Starting DHCP Spoof attempt on ${roguePortId}`);
    // Rogue offers IP to Host-A (p1) and Host-B (p2) sequentially
    const offers = [
      { targetPort: "p1", ip: "10.0.0.200" },
      { targetPort: "p2", ip: "10.0.0.201" },
    ];
    let idx = 0;
    function offerNext() {
      if (idx >= offers.length) {
        pushLog("Rogue DHCP attempt finished");
        return;
      }
      const o = offers[idx++];
      pushLog(`Rogue DHCP server offers ${o.ip} to ${o.targetPort}`);
      // if DHCP Snooping enabled, only allow binding if port is trusted (we assume uplink is not p3)
      if (prot.dhcpSnooping) {
        // mark p3 as untrusted (rogue on access) so offer is dropped
        pushAlert(`DHCP Snooping blocked offer from rogue server on ${roguePortId} to ${o.targetPort}`);
      } else {
        // Create binding
        setDhcpBindings((b) => [...b, { ip: o.ip, mac: `00:aa:bb:${o.targetPort}`, port: o.targetPort }]);
        pushLog(`Client on ${o.targetPort} accepted rogue DHCP IP ${o.ip}`);
      }
      setTimeout(offerNext, 700);
    }
    offerNext();
  }

  // ARP Poison: attacker sends fake ARP to associate gateway IP to attacker's MAC
  function attackArpPoison(victimPortId = "p1") {
    pushLog(`Starting ARP Poisoning targeting ${victimPortId}`);
    // Target gateway IP (assume 10.10.10.1)
    const gatewayIp = "10.10.10.1";
    // attacker claims gateway IP with attacker MAC
    if (prot.dai) {
      pushAlert("DAI blocked malicious ARP — ARP inspection prevented poisoning");
      pushLog("DAI validated ARP against DHCP snooping database and dropped packet");
      return;
    }
    // if DAI is off, poisoning succeeds
    setArpTable((a) => [...a.filter((e) => e.ip !== gatewayIp), { ip: gatewayIp, mac: "02:de:ad:be:ef:01", port: "p3" }]);
    pushAlert(`ARP Poisoning succeeded: ${gatewayIp} -> 02:de:ad:be:ef:01 on p3`);
  }

  // BPDU Attack: attacker injects superior BPDU on an access port to try to become root
  function attackBpdu(attackPortId = "p3") {
    pushLog(`BPDU Attack: forged BPDUs injected from ${attackPortId}`);
    if (prot.bpduGuard) {
      // BPDU Guard should disable the port
      updatePort(attackPortId, { state: "err-disabled" });
      pushAlert(`${attackPortId} disabled by BPDU Guard (rogue switch detected)`);
      return;
    }
    // else effect: switch may change root -> indicate alert
    pushAlert("BPDU attack caused potential root bridge change (simulated)");
    pushLog("Topology change observed: some ports moved to blocking (simulated)");
  }

  /* -----------------------------
     Defensive actions (admin)
     -----------------------------*/

  // Admin: enable/disable a port
  function adminTogglePort(id) {
    setPorts((prev) => prev.map((p) => (p.id === id ? { ...p, state: p.state === "up" ? "shutdown" : "up" } : p)));
    pushLog(`Admin toggled ${id}`);
  }

  // Admin: clear bindings / ARP / violations
  function clearSecurityState() {
    setDhcpBindings([]);
    setArpTable([]);
    setPorts((prev) => prev.map((p) => ({ ...p, violationCount: 0, macs: p.macs.slice(0, 2) })));
    pushLog("Cleared DHCP bindings, ARP table, and port violation counts");
  }

  /* -----------------------------
     Small UI animation helpers
     -----------------------------*/
  function showPulse(portId, msg) {
    const pulseId = nextAnimId.current++;
    setLogs((s) => [...s, `${new Date().toLocaleTimeString()} — ${msg}`]);
    animRef.current[`pulse-${pulseId}`] = portId;
    setTimeout(() => {
      delete animRef.current[`pulse-${pulseId}`];
      // force re-render
      setPorts((p) => [...p]);
    }, 700);
  }

  /* -----------------------------
     Render
     -----------------------------*/
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 shadow-md">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-3">🛡️ Security Event Simulator</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Controls */}
        <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-semibold mb-2">Protections</div>

          <label className="flex items-center gap-2 text-sm mb-1">
            <input type="checkbox" checked={prot.portSecurity} onChange={(e) => setProt((p) => ({ ...p, portSecurity: e.target.checked }))} />
            Port Security
          </label>

          <div className="text-xs text-gray-500 mb-2 ml-6">Mode:
            <select value={prot.portSecurityMode} onChange={(e) => setProt((p) => ({ ...p, portSecurityMode: e.target.value }))} className="ml-2 p-1 text-xs rounded border">
              <option value="protect">protect</option>
              <option value="restrict">restrict</option>
              <option value="shutdown">shutdown</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm mb-1">
            <input type="checkbox" checked={prot.dhcpSnooping} onChange={(e) => setProt((p) => ({ ...p, dhcpSnooping: e.target.checked }))} />
            DHCP Snooping
          </label>

          <label className="flex items-center gap-2 text-sm mb-1">
            <input type="checkbox" checked={prot.dai} onChange={(e) => setProt((p) => ({ ...p, dai: e.target.checked }))} />
            Dynamic ARP Inspection (DAI)
          </label>

          <label className="flex items-center gap-2 text-sm mb-1">
            <input type="checkbox" checked={prot.bpduGuard} onChange={(e) => setProt((p) => ({ ...p, bpduGuard: e.target.checked }))} />
            BPDU Guard
          </label>

          <div className="mt-3">
            <button onClick={() => attackMacFlood("p3", 80)} className="px-3 py-2 bg-red-600 text-white rounded-md mr-2 text-sm">Attack: MAC Flood (p3)</button>
          </div>
          <div className="mt-2">
            <button onClick={() => attackDhcpSpoof("p3")} className="px-3 py-2 bg-red-500 text-white rounded-md mr-2 text-sm">Attack: DHCP Spoof</button>
          </div>
          <div className="mt-2">
            <button onClick={() => attackArpPoison("p1")} className="px-3 py-2 bg-red-500 text-white rounded-md mr-2 text-sm">Attack: ARP Poison (target p1)</button>
          </div>
          <div className="mt-2">
            <button onClick={() => attackBpdu("p3")} className="px-3 py-2 bg-red-500 text-white rounded-md mr-2 text-sm">Attack: BPDU Injection</button>
          </div>

          <div className="mt-4 border-t pt-3 text-xs text-gray-500">
            <div className="flex gap-2">
              <button onClick={() => resetSim()} className="px-3 py-1 bg-gray-200 rounded text-sm">Reset Simulator</button>
              <button onClick={() => clearSecurityState()} className="px-3 py-1 bg-yellow-200 rounded text-sm">Clear Security State</button>
            </div>
          </div>
        </div>

        {/* Topology visual */}
        <div className="col-span-2 p-3 border rounded bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Network Topology</div>
            <div className="text-xs text-gray-500">Switch with 3 access ports</div>
          </div>

          <div className="flex items-center gap-8 justify-center">
            {/* Ports */}
            <div className="space-y-4">
              {ports.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className={`w-56 p-3 rounded border ${p.state !== "up" ? "bg-red-50 border-red-300" : "bg-white"}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{p.name} — {p.host}</div>
                        <div className="text-xs text-gray-500">MACs: {p.macs.slice(0, 4).join(", ") || "(none)"}</div>
                        <div className="text-xs text-gray-500">Violations: {p.violationCount}</div>
                        <div className="text-xs text-gray-500">State: {p.state}</div>
                      </div>
                      <div className="text-right space-y-1">
                        <button onClick={() => adminTogglePort(p.id)} className="px-2 py-1 bg-gray-200 rounded text-xs">Toggle</button>
                        <button onClick={() => showPulse(p.id, `Probe ${p.name}`)} className="px-2 py-1 bg-indigo-600 text-white rounded text-xs">Probe</button>
                      </div>
                    </div>
                  </div>
                  {/* Pulse indicator if animRef contains any pulse for this port */}
                  <div className="w-4 h-4">
                    {Object.values(animRef.current).some((v) => v === p.id) && <div className="w-4 h-4 rounded-full bg-indigo-400 animate-ping" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Switch */}
            <div className="w-72 p-4 rounded border bg-slate-50 text-center">
              <div className="text-sm font-semibold">Switch (Access)</div>
              <div className="text-xs text-gray-500 mt-2">Port Security: {prot.portSecurity ? "Enabled" : "Disabled"}</div>
              <div className="text-xs text-gray-500">DHCP Snooping: {prot.dhcpSnooping ? "Enabled" : "Disabled"}</div>
              <div className="text-xs text-gray-500">DAI: {prot.dai ? "Enabled" : "Disabled"}</div>
              <div className="text-xs text-gray-500 mt-3">BPDU Guard: {prot.bpduGuard ? "Enabled" : "Disabled"}</div>
            </div>

            {/* Router / Gateway */}
            <div className="w-64 p-4 rounded border bg-slate-50 text-center">
              <div className="text-sm font-semibold">Gateway / Router</div>
              <div className="text-xs text-gray-500 mt-2">IP: 10.10.10.1</div>
              <div className="text-xs text-gray-500">DHCP Server: {prot.dhcpSnooping ? "Blocked on untrusted ports" : "Unrestricted"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* State panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">DHCP Bindings</div>
          <div className="text-xs">
            {dhcpBindings.length === 0 ? <div className="text-gray-500">No bindings</div> : dhcpBindings.map((b, i) => <div key={i} className="text-xs">{b.ip} — {b.mac} ({b.port})</div>)}
          </div>
        </div>

        <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ARP Table</div>
          <div className="text-xs">
            {arpTable.length === 0 ? <div className="text-gray-500">No ARP entries</div> : arpTable.map((a, i) => <div key={i} className="text-xs">{a.ip} → {a.mac} ({a.port})</div>)}
          </div>
        </div>

        <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Alerts</div>
          <div className="text-xs space-y-2">
            {alerts.length === 0 && <div className="text-gray-500">No alerts</div>}
            {alerts.slice().reverse().map((a) => <div key={a.id} className="text-xs text-red-600">{a.msg}</div>)}
          </div>
        </div>
      </div>

      {/* Logs */}
      <div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Simulation Log</div>
        <div className="h-48 overflow-auto p-3 bg-black text-green-300 font-mono rounded text-xs">
          {logs.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l}</div>)}
        </div>
      </div>
    </div>
  );
}
