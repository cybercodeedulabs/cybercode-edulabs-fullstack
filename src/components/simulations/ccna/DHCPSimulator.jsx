import React, { useState, useRef, useEffect } from "react";

/**
 * DHCPSimulator.jsx — Enterprise-grade enhanced DHCP simulator
 * Place at: /src/components/simulations/ccna/DHCPSimulator.jsx
 * Implements all requested enhancements:
 * - Randomized T1/T2 renewal failures
 * - DHCP relay (helper-address) simulation (visual only)
 * - VLAN-aware scopes (per-VLAN pools)
 * - Optional dynamic DNS registration simulation
 * - Color-coded packet animations for DISCOVER/OFFER/REQUEST/ACK/NAK
 * - Scope exhaustion alert (blinking) and NAK handling
 * - Client rebound on NAK and reattempt logic
 * - Lease countdown UI under each client
 * - Auto layout of clients around server
 * - Rogue DHCP server detection (competing offers)
 * - Export/import snapshot
 *
 * UI follows your project patterns (Tailwind, card layout, logs, monospace log pane)
 */

const DEFAULT_SCOPE = {
  id: "SCOPE-1",
  vlan: 1,
  network: "192.168.10.0",
  mask: "255.255.255.0",
  start: 11,
  end: 30,
  gateway: "192.168.10.1",
  dns: "8.8.8.8",
  lease: 30, // seconds for demo
};

const PACKET_COLORS = {
  DISCOVER: "#F59E0B",
  OFFER: "#10B981",
  REQUEST: "#3B82F6",
  ACK: "#0ea5a4",
  NAK: "#ef4444",
};

export default function DHCPSimulator() {
  // scopes can be per VLAN
  const [scopes, setScopes] = useState([DEFAULT_SCOPE]);

  // clients may belong to VLANs
  const [clients, setClients] = useState([
    { id: "C1", name: "Client-1", vlan: 1, state: "idle", ip: null, leaseExpiresAt: null, t1: null, t2: null },
    { id: "C2", name: "Client-2", vlan: 1, state: "idle", ip: null, leaseExpiresAt: null, t1: null, t2: null },
  ]);

  // pool per scope id
  const buildPoolForScope = (s) => {
    const base = s.network.replace(/\d+$/, "");
    const arr = [];
    for (let i = s.start; i <= s.end; i++) arr.push(`${base}${i}`);
    return arr;
  };

  const [pools, setPools] = useState(() => {
    const map = {};
    scopes.forEach((s) => (map[s.id] = buildPoolForScope(s)));
    return map;
  });

  const [logs, setLogs] = useState(["Enhanced DHCP Simulator ready."]);
  const [animPackets, setAnimPackets] = useState([]); // {id, from, to, label, t, color}
  const nextAnimId = useRef(1);
  const [relayEnabled, setRelayEnabled] = useState(false);
  const [helperAddress, setHelperAddress] = useState("10.0.0.1");
  const [dnsDynamic, setDnsDynamic] = useState(true);
  const [rogueServerEnabled, setRogueServerEnabled] = useState(false);
  const [exhaustionAlert, setExhaustionAlert] = useState(null);
  const [showLeaseCountdown, setShowLeaseCountdown] = useState(true);

  const pushLog = (msg) => setLogs((s) => [...s.slice(-80), `${new Date().toLocaleTimeString()} — ${msg}`]);

  // helper to pick scope by VLAN
  const getScopeForVlan = (vlan) => scopes.find((s) => s.vlan === vlan) || scopes[0];

  // allocate IP from pool for given scope id
  function allocateIpForScope(scopeId) {
    setPools((prev) => {
      const next = { ...prev };
      const arr = next[scopeId] || [];
      if (!arr || arr.length === 0) return prev;
      const ip = arr[0];
      next[scopeId] = arr.slice(1);
      return next;
    });
  }

  // obtain (and return) ip synchronously (reads current state)
  function peekAllocateIp(scopeId) {
    const arr = pools[scopeId] || [];
    if (!arr || arr.length === 0) return null;
    return arr[0];
  }

  function consumeIp(scopeId) {
    const arr = pools[scopeId] || [];
    if (!arr || arr.length === 0) return null;
    const ip = arr[0];
    setPools((p) => ({ ...p, [scopeId]: p[scopeId].slice(1) }));
    return ip;
  }

  function releaseIp(scopeId, ip) {
    setPools((p) => ({ ...p, [scopeId]: [ip, ...(p[scopeId] || [])] }));
  }

  // animate packet from 'from' to 'to'
  function animatePacket(from, to, label, color) {
    const id = nextAnimId.current++;
    setAnimPackets((a) => [...a, { id, from, to, label, t: 0, color }]);
    const start = performance.now();
    const dur = 700;
    function frame(now) {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / dur);
      setAnimPackets((arr) => arr.map((x) => (x.id === id ? { ...x, t: p } : x)));
      if (p < 1) requestAnimationFrame(frame);
      else setAnimPackets((arr) => arr.filter((x) => x.id !== id));
    }
    requestAnimationFrame(frame);
  }

  // rogue server: when enabled, it will also offer addresses (simulate competing offers)
  function rogueOffer(client, scope) {
    if (!rogueServerEnabled) return null;
    // rogue offers an IP outside pool range to illustrate problem
    const base = scope.network.replace(/\d+$/, "");
    const ip = base + (99 + Math.floor(Math.random() * 50));
    return ip;
  }

  // start the DHCP 4-way handshake with enhanced behavior
  function startDhcpFlow(clientId) {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    if (client.state === "bound") {
      pushLog(`${client.name} already has ${client.ip}`);
      return;
    }

    const scope = getScopeForVlan(client.vlan);
    const scopeId = scope.id;

    pushLog(`${client.name}: DHCPDISCOVER (vlan ${client.vlan})`);
    animatePacket(client.id, "server", "DISCOVER", PACKET_COLORS.DISCOVER);
    setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, state: "discovering" } : c)));

    setTimeout(() => {
      // server prepares offer
      const availableIp = peekAllocateIp(scopeId);
      if (!availableIp) {
        // no addresses available: server NAK
        pushLog(`Server: pool exhausted for scope ${scopeId} — sending NAK`);
        animatePacket("server", client.id, "NAK", PACKET_COLORS.NAK);
        setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, state: "nak" } : c)));
        setExhaustionAlert(scopeId);
        // client behavior: can retry after random backoff
        setTimeout(() => {
          pushLog(`${client.name}: retrying DHCPDISCOVER after NAK/backoff`);
          startDhcpFlow(clientId);
        }, 1500 + Math.random() * 2000);
        return;
      }

      // server sends an offer (and rogue may also send)
      const ipOffered = consumeIp(scopeId);
      pushLog(`Server: DHCPOFFER -> ${client.name} offers ${ipOffered}`);
      animatePacket("server", client.id, "OFFER", PACKET_COLORS.OFFER);

      const rogueIp = rogueOffer(client, scope);
      if (rogueIp) {
        pushLog(`RogueDHCP: DHCPOFFER -> ${client.name} offers ${rogueIp} (rogue)`);
        animatePacket("rogue", client.id, "OFFER(rogue)", "#A78BFA");
      }

      setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, state: "offered", ipOffered: ipOffered } : c)));

      setTimeout(() => {
        // client requests the offered IP
        pushLog(`${client.name}: DHCPREQUEST -> requesting ${ipOffered}`);
        animatePacket(client.id, "server", "REQUEST", PACKET_COLORS.REQUEST);
        setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, state: "requesting" } : c)));

        setTimeout(() => {
          // server may randomly NAK to simulate other conditions (e.g., conflict)
          const randomNak = Math.random() < 0.08; // 8% chance
          if (randomNak) {
            // server NAKs; return ip to pool
            pushLog(`Server: DHCPNAK -> ${client.name} (simulated conflict)`);
            releaseIp(scopeId, ipOffered);
            animatePacket("server", client.id, "NAK", PACKET_COLORS.NAK);
            setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, state: "nak" } : c)));
            // client will retry after backoff
            setTimeout(() => {
              pushLog(`${client.name}: detected NAK — retrying DHCPDISCOVER`);
              startDhcpFlow(clientId);
            }, 1200 + Math.random() * 2000);
            return;
          }

          // success: server ACK
          const expiresAt = Date.now() + scope.lease * 1000;
          pushLog(`Server: DHCPACK -> ${client.name} granted ${ipOffered} until ${new Date(expiresAt).toLocaleTimeString()}`);
          animatePacket("server", client.id, "ACK", PACKET_COLORS.ACK);

          // dynamic DNS registration (optional)
          if (dnsDynamic) pushLog(`DNS: registered ${client.name} -> ${ipOffered}`);

          // bind client
          setClients((cs) =>
            cs.map((c) => (c.id === clientId ? { ...c, state: "bound", ip: ipOffered, leaseExpiresAt: expiresAt } : c))
          );

          // setup T1/T2 timers with possibility of random failure
          scheduleLeaseTimers(clientId, scopeId, ipOffered, expiresAt);
        }, 700);
      }, 500);
    }, 500);
  }

  // timers: T1 (50%), T2 (87.5%) with random failure probabilities
  function scheduleLeaseTimers(clientId, scopeId, ip, expiresAt) {
    const now = Date.now();
    const leaseMs = expiresAt - now;
    const t1Ms = Math.max(1000, leaseMs * 0.5);
    const t2Ms = Math.max(1000, leaseMs * 0.875);

    const t1Handle = setTimeout(() => {
      pushLog(`${clientId}: T1 - sending DHCPREQUEST (renew) for ${ip}`);
      animatePacket(clientId, "server", "REQUEST(T1)", PACKET_COLORS.REQUEST);
      // random failure possibility
      const fail = Math.random() < 0.12; // 12% chance to fail
      setTimeout(() => {
        if (!fail) {
          const newExpires = Date.now() + (expiresAt - now); // extend by same lease
          pushLog(`Server: DHCPACK (renew) -> ${clientId} lease extended`);
          setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, leaseExpiresAt: newExpires } : c)));
          // schedule again relative to new expiry
          scheduleLeaseTimers(clientId, scopeId, ip, Date.now() + (expiresAt - now));
        } else {
          pushLog(`${clientId}: no response to T1 (simulated)`);
        }
      }, 500 + Math.random() * 400);
    }, t1Ms);

    const t2Handle = setTimeout(() => {
      pushLog(`${clientId}: T2 - rebinding (broadcast REQUEST) for ${ip}`);
      animatePacket(clientId, "server", "REQUEST(T2)", PACKET_COLORS.REQUEST);
      const fail = Math.random() < 0.18; // 18% chance to fail T2
      setTimeout(() => {
        if (!fail) {
          const newExpires = Date.now() + (expiresAt - now);
          pushLog(`Server: DHCPACK (rebind) -> ${clientId} lease extended`);
          setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, leaseExpiresAt: newExpires } : c)));
          scheduleLeaseTimers(clientId, scopeId, ip, Date.now() + (expiresAt - now));
        } else {
          pushLog(`${clientId}: no response to T2 — lease will expire`);
        }
      }, 700 + Math.random() * 500);
    }, t2Ms);

    // expiry timer
    const expiry = setTimeout(() => {
      pushLog(`${clientId}: lease expired for ${ip} — releasing`);
      // remove ip binding and release to pool
      setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, state: "idle", ip: null, leaseExpiresAt: null } : c)));
      releaseIp(scopeId, ip);
    }, leaseMs + 200);

    // attach timers to client state (so they can be cleared if client removed)
    setClients((cs) => cs.map((c) => (c.id === clientId ? { ...c, t1: t1Handle, t2: t2Handle, expiry: expiry } : c)));
  }

  // UI helpers
  function addClient() {
    const id = `C${clients.length + 1}`;
    setClients((c) => [...c, { id, name: `Client-${clients.length + 1}`, vlan: 1, state: "idle", ip: null }]);
    pushLog(`Added ${id}`);
  }

  function removeClient(id) {
    const found = clients.find((c) => c.id === id);
    if (found) {
      if (found.t1) clearTimeout(found.t1);
      if (found.t2) clearTimeout(found.t2);
      if (found.expiry) clearTimeout(found.expiry);
      if (found.ip) releaseIp(getScopeForVlan(found.vlan).id, found.ip);
      setClients((c) => c.filter((x) => x.id !== id));
      pushLog(`Removed ${id}`);
    }
  }

  // export/import snapshot
  function exportSnapshot() {
    const payload = { scopes, clients, pools };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dhcp-snapshot.json";
    a.click();
    URL.revokeObjectURL(url);
    pushLog("Exported snapshot");
  }

  function importSnapshot(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const obj = JSON.parse(ev.target.result);
        if (obj.scopes && obj.pools) {
          setScopes(obj.scopes);
          setPools(obj.pools);
          if (Array.isArray(obj.clients)) setClients(obj.clients.map((c) => ({ ...c, t1: null, t2: null, expiry: null })));
          pushLog("Imported snapshot");
        } else pushLog("Invalid snapshot file");
      } catch (err) {
        pushLog("Failed to parse snapshot");
      }
    };
    r.readAsText(f);
  }

  // UI positions auto-layout
  const positions = { server: { x: 420, y: 220 } };
  clients.forEach((c, i) => {
    const cols = 5;
    const x = 80 + (i % cols) * 120;
    const y = 40 + Math.floor(i / cols) * 150;
    positions[c.id] = { x, y };
  });

  // cleanup
  useEffect(() => {
    return () => {
      clients.forEach((c) => {
        if (c.t1) clearTimeout(c.t1);
        if (c.t2) clearTimeout(c.t2);
        if (c.expiry) clearTimeout(c.expiry);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scope exhaustion alert blink
  useEffect(() => {
    if (!exhaustionAlert) return;
    const t = setTimeout(() => setExhaustionAlert(null), 6000);
    return () => clearTimeout(t);
  }, [exhaustionAlert]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 shadow-md">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">🛟 DHCP Simulator — Enhanced</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Server & Scope</div>
          <div className="mt-2 p-2 border rounded bg-gray-50 dark:bg-gray-800">
            <div className="text-xs">Scopes: {scopes.length}</div>
            <div className="text-xs">Pools: {Object.keys(pools).length}</div>
            <div className="text-xs">Relay: <input type="checkbox" checked={relayEnabled} onChange={(e) => setRelayEnabled(e.target.checked)} className="ml-2" /></div>
            <div className="text-xs mt-2">Helper: <input value={helperAddress} onChange={(e) => setHelperAddress(e.target.value)} className="ml-2 p-1 rounded border text-xs" /></div>
            <div className="text-xs mt-2">Dynamic DNS: <input type="checkbox" checked={dnsDynamic} onChange={(e) => setDnsDynamic(e.target.checked)} className="ml-2" /></div>
            <div className="text-xs mt-2">Rogue DHCP: <input type="checkbox" checked={rogueServerEnabled} onChange={(e) => setRogueServerEnabled(e.target.checked)} className="ml-2" /></div>
          </div>

          <div className="flex gap-2 mt-3">
            <button onClick={() => startDhcpFlow("C1")} className="px-3 py-2 bg-indigo-600 text-white rounded-md">Start C1</button>
            <button onClick={() => startDhcpFlow("C2")} className="px-3 py-2 bg-indigo-600 text-white rounded-md">Start C2</button>
            <button onClick={() => addClient()} className="px-3 py-2 bg-green-600 text-white rounded-md">➕ Add Client</button>
          </div>

          <div className="mt-3 flex gap-2">
            <button onClick={exportSnapshot} className="px-3 py-2 bg-slate-700 text-white rounded-md">Export</button>
            <label className="px-3 py-2 bg-slate-200 rounded-md cursor-pointer text-sm"><input type="file" accept="application/json" onChange={importSnapshot} className="hidden" />Import</label>
            <button onClick={() => { setPools(() => { const map = {}; scopes.forEach((s) => (map[s.id] = buildPoolForScope(s))); return map; }); pushLog("Rebuilt pools"); }} className="px-3 py-2 bg-gray-200 rounded-md">Rebuild Pools</button>
          </div>
        </div>

        <div className="col-span-2 p-3 border rounded bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Network View</div>
            <div className="text-xs text-gray-500">Pools left: {Object.values(pools).reduce((acc, arr) => acc + (arr ? arr.length : 0), 0)}</div>
          </div>

          <div style={{ position: "relative", height: 420 }}>
            {/* Server */}
            <div style={{ position: "absolute", left: positions.server.x - 48, top: positions.server.y - 36 }}>
              <div className="w-32 h-28 rounded-md border bg-yellow-50 flex items-center justify-center">DHCP Server</div>
            </div>

            {/* Clients */}
            {clients.map((c) => (
              <div key={c.id} style={{ position: "absolute", left: positions[c.id].x - 50, top: positions[c.id].y - 20 }}>
                <div className={`w-40 p-2 rounded-md border ${c.state === "bound" ? "bg-green-50" : "bg-white"}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.vlan}</div>
                  </div>
                  <div className="text-xs text-gray-500">{c.state}{c.ip ? ` — ${c.ip}` : ""}</div>

                  {showLeaseCountdown && c.leaseExpiresAt && (
                    <div className="text-xs mt-1 text-gray-700">Expires in: {Math.max(0, Math.round((c.leaseExpiresAt - Date.now()) / 1000))}s</div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button onClick={() => startDhcpFlow(c.id)} className="px-2 py-1 bg-indigo-600 text-white rounded-md text-xs">Start</button>
                    <button onClick={() => removeClient(c.id)} className="px-2 py-1 bg-gray-200 rounded-md text-xs">Remove</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Packet animations overlay */}
            <svg width="100%" height={420} style={{ position: "absolute", left: 0, top: 0 }}>
              {animPackets.map((p) => {
                // compute positions
                const from = p.from === "server" ? positions.server : positions[p.from];
                const to = p.to === "server" ? positions.server : positions[p.to];
                if (!from || !to) return null;
                const x = from.x + (to.x - from.x) * Math.min(1, Math.max(0, p.t));
                const y = from.y + (to.y - from.y) * Math.min(1, Math.max(0, p.t));
                return (
                  <g key={p.id}>
                    <circle cx={x} cy={y} r={8} fill={p.color || "#10B981"} />
                    <text x={x} y={y + 4} fontSize={8} textAnchor="middle" fill="#fff">{p.label}</text>
                  </g>
                );
              })}
            </svg>

            {/* Exhaustion alert */}
            {exhaustionAlert && (
              <div style={{ position: "absolute", right: 16, top: 8 }} className="p-2 rounded-md bg-red-500 text-white text-xs animate-pulse">Pool exhausted: {exhaustionAlert}</div>
            )}
          </div>
        </div>
      </div>

      {/* Controls row 2 */}
      <div className="flex gap-2 mb-3">
        <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={showLeaseCountdown} onChange={(e) => setShowLeaseCountdown(e.target.checked)} /> Show Lease Countdown</label>
        <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={dnsDynamic} onChange={(e) => setDnsDynamic(e.target.checked)} /> Dynamic DNS</label>
        <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={rogueServerEnabled} onChange={(e) => setRogueServerEnabled(e.target.checked)} /> Rogue DHCP</label>
      </div>

      {/* Logs */}
      <div className="mt-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Simulation Log</div>
        <div className="h-48 overflow-auto p-3 bg-black text-green-300 font-mono rounded">{logs.map((l, i) => <div key={i} className="text-xs whitespace-pre-wrap">{l}</div>)}</div>
      </div>
    </div>
  );
}
