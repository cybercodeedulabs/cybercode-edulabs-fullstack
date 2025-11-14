import React, { useState, useRef, useEffect } from "react";

/**
 * NATSimulator.jsx (updated)
 * - Adds continuous simulation controls (Start / Stop)
 * - Mode: S2 (every 3s cycle), Start Mode B2 (auto-add clients every 10s)
 * - Visual running indicator and NAT/device/client glow
 *
 * Place at: /src/components/simulations/ccna/NATSimulator.jsx
 */

/* ---------------------
   Default data
   ---------------------*/
const defaultClients = [
  { id: "C1", name: "Host-1", insideIp: "10.10.10.10", active: false },
  { id: "C2", name: "Host-2", insideIp: "10.10.10.11", active: false },
  { id: "C3", name: "Host-3", insideIp: "10.20.20.10", active: false },
];

const defaultPublicPool = ["203.0.113.10", "203.0.113.11", "203.0.113.12"];

export default function NATSimulator() {
  /* -------------------------
   * State & refs (preserve existing behavior)
   * --------------------------*/
  const [clients, setClients] = useState(defaultClients);
  const [publicPool, setPublicPool] = useState(defaultPublicPool);
  const [staticMaps, setStaticMaps] = useState([]);
  const [mode, setMode] = useState("pat"); // 'static', 'dynamic', 'pat'
  const [translationTable, setTranslationTable] = useState([]);
  const [logs, setLogs] = useState(["NAT Simulator ready — choose mode and start clients."]);
  const [animPackets, setAnimPackets] = useState([]); // {id, from, to, label, t}
  const nextAnimId = useRef(1);

  // options
  const [patPortRange, setPatPortRange] = useState({ start: 1024, end: 65535 });
  const [asymmetricRouting, setAsymmetricRouting] = useState(false);
  const [portExhaustionAlarm, setPortExhaustionAlarm] = useState(null);

  // new: simulation control state & refs
  const [running, setRunning] = useState(false);
  const simIntervalRef = useRef(null); // main cycle interval (every 3s)
  const autoAddRef = useRef(null); // auto-add client interval (every 10s)
  const animCancelRef = useRef(false); // used to cancel in-flight animations
  const [autoRunNewClients, setAutoRunNewClients] = useState(true); // auto-run behavior checkbox

  const pushLog = (msg) => setLogs((s) => [...s.slice(-120), `${new Date().toLocaleTimeString()} — ${msg}`]);

  /* -------------------------
   * Pool helpers
   * --------------------------*/
  function allocatePublicFromPool() {
    if (publicPool.length === 0) return null;
    const p = [...publicPool];
    const ip = p.shift();
    setPublicPool(p);
    return ip;
  }
  function releasePublicToPool(ip) {
    setPublicPool((p) => [ip, ...p]);
  }

  const patMapRef = useRef({});
  const updatePatRef = (fn) => {
    patMapRef.current = fn(patMapRef.current);
  };

  /* -------------------------
   * Translation creation (keeps original logic)
   * --------------------------*/
  function createTranslation({ insideIp, insidePort = null, proto = "tcp", type = "dynamic" }) {
    const staticEntry = staticMaps.find((s) => s.inside === insideIp);
    if (type === "static" && staticEntry) {
      const existing = translationTable.find((t) => t.insideIp === insideIp && t.type === "static");
      if (existing) return existing;
      const entry = { insideIp, insidePort: null, publicIp: staticEntry.public, publicPort: null, proto, type: "static", expiresAt: null };
      setTranslationTable((t) => [...t, entry]);
      pushLog(`Static NAT: ${insideIp} -> ${entry.publicIp}`);
      return entry;
    }

    if (mode === "dynamic" || type === "dynamic") {
      const publicIp = allocatePublicFromPool();
      if (!publicIp) {
        pushLog("Dynamic NAT: pool exhausted — cannot allocate public IP");
        return null;
      }
      const entry = { insideIp, insidePort: null, publicIp, publicPort: null, proto, type: "dynamic", expiresAt: Date.now() + 60 * 1000 };
      setTranslationTable((t) => [...t, entry]);
      pushLog(`Dynamic NAT: ${insideIp} -> ${publicIp}`);
      return entry;
    }

    // PAT
    const publicIp = (publicPool.length > 0 ? publicPool[0] : null) || (staticMaps[0] && staticMaps[0].public);
    if (!publicIp) {
      pushLog("PAT: no public IP available to overload on");
      return null;
    }
    const { start, end } = patPortRange;
    updatePatRef((prev) => ({ ...prev })); // ensure exists
    const usedPorts = patMapRef.current[publicIp] || {};
    let allocatedPort = null;
    for (let p = start; p <= end; p++) {
      if (!usedPorts[p]) { allocatedPort = p; break; }
      if (p - start > 20000) break; // safety
    }
    if (!allocatedPort) {
      pushLog("PAT: port exhaustion on public IP");
      setPortExhaustionAlarm(publicIp);
      return null;
    }
    updatePatRef((prev) => {
      const copy = { ...prev };
      copy[publicIp] = { ...(copy[publicIp] || {}) };
      copy[publicIp][allocatedPort] = { insideIp, insidePort, proto };
      return copy;
    });
    const entry = { insideIp, insidePort, publicIp, publicPort: allocatedPort, proto, type: "pat", expiresAt: Date.now() + 60 * 1000 };
    setTranslationTable((t) => [...t, entry]);
    pushLog(`PAT: ${insideIp}:${insidePort || "*"} -> ${entry.publicIp}:${entry.publicPort}`);
    return entry;
  }

  function releasePatEntry(entry) {
    if (!entry) return;
    if (entry.type === "dynamic") {
      if (entry.publicIp) releasePublicToPool(entry.publicIp);
    } else if (entry.type === "pat") {
      updatePatRef((prev) => {
        const copy = { ...prev };
        if (copy[entry.publicIp]) delete copy[entry.publicIp][entry.publicPort];
        return copy;
      });
    }
    setTranslationTable((t) => t.filter((x) => x !== entry));
    pushLog(`Released translation for ${entry.insideIp}`);
  }

  /* -------------------------
   * Client flows & animations (preserve, add cancellation hook)
   * --------------------------*/
  function startClientFlow(clientId) {
    const c = clients.find((x) => x.id === clientId);
    if (!c) return;
    pushLog(`${c.name} (${c.insideIp}) initiating connection to Internet`);

    const staticEntry = staticMaps.find((s) => s.inside === c.insideIp);
    if (staticEntry && mode === "static") {
      animatePacket(c.id, "nat", "SYN");
      setTimeout(() => {
        pushLog(`Sent from ${c.insideIp} via static ${staticEntry.public}`);
        animatePacket("nat", "internet", "SYN");
      }, 500);
      return;
    }

    let existing = translationTable.find((t) => t.insideIp === c.insideIp);
    if (!existing) {
      const entry = createTranslation({ insideIp: c.insideIp, proto: "tcp", type: mode === "pat" ? "pat" : "dynamic" });
      if (!entry) {
        pushLog(`${c.name}: failed to obtain translation`);
        return;
      }
      existing = entry;
    } else {
      pushLog(`${c.name}: using existing translation ${existing.publicIp}${existing.publicPort ? ":" + existing.publicPort : ""}`);
    }

    // animate full flow and set client active for UI glow
    setClients((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: true } : x)));
    animatePacket(c.id, "nat", "SYN");
    setTimeout(() => animatePacket("nat", "internet", "SYN/ACK"), 400);

    setTimeout(() => {
      if (asymmetricRouting && Math.random() < 0.35) {
        pushLog("Asymmetric routing simulated — return path bypassed NAT device. Connection failed.");
        releaseTranslationByInside(c.insideIp);
        setClients((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: false } : x)));
      } else {
        pushLog(`Connection established via ${existing.publicIp}${existing.publicPort ? ":" + existing.publicPort : ""}`);
        scheduleTranslationExpiry(existing);
        // keep client active briefly to indicate session
        setTimeout(() => setClients((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: false } : x))), 1500);
      }
    }, 900);
  }

  function scheduleTranslationExpiry(entry) {
    if (!entry || !entry.expiresAt) return;
    const ttl = entry.expiresAt - Date.now();
    if (ttl <= 0) { releasePatEntry(entry); return; }
    setTimeout(() => {
      setTranslationTable((t) => {
        const found = t.find((e) => e === entry);
        if (found) releasePatEntry(found);
        return t.filter((x) => x !== entry);
      });
    }, ttl + 100);
  }

  function releaseTranslationByInside(insideIp) {
    const entry = translationTable.find((t) => t.insideIp === insideIp);
    if (entry) releasePatEntry(entry);
  }

  /* -------------------------
   * Animation helper (supports cancellation via animCancelRef)
   * --------------------------*/
  function animatePacket(from, to, label) {
    const id = nextAnimId.current++;
    setAnimPackets((a) => [...a, { id, from, to, label, t: 0 }]);
    const start = performance.now();
    const dur = 700;
    let stopped = false;

    function frame(now) {
      if (animCancelRef.current) {
        // cancel animation: remove it
        setAnimPackets((arr) => arr.filter((x) => x.id !== id));
        stopped = true;
        return;
      }
      const elapsed = now - start;
      const p = Math.min(1, elapsed / dur);
      setAnimPackets((arr) => arr.map((x) => (x.id === id ? { ...x, t: p } : x)));
      if (p < 1 && !stopped) requestAnimationFrame(frame);
      else if (!stopped) setAnimPackets((arr) => arr.filter((x) => x.id !== id));
    }
    requestAnimationFrame(frame);
  }

  /* -------------------------
   * UI helpers
   * --------------------------*/
  function addClient() {
    const id = `C${clients.length + 1}`;
    const newClient = { id, name: `Host-${clients.length + 1}`, insideIp: `10.10.10.${10 + clients.length}`, active: false };
    setClients((c) => [...c, newClient]);
    pushLog(`Added client ${id}`);
    return newClient;
  }

  function removeClient(id) {
    const found = clients.find((c) => c.id === id);
    if (!found) return;
    releaseTranslationByInside(found.insideIp);
    setClients((c) => c.filter((x) => x.id !== id));
    pushLog(`Removed client ${id}`);
  }

  function exportSnapshot() {
    const payload = { clients, publicPool, staticMaps, mode, translationTable };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nat-snapshot.json";
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
        if (obj.clients) setClients(obj.clients);
        if (obj.publicPool) setPublicPool(obj.publicPool);
        if (obj.staticMaps) setStaticMaps(obj.staticMaps);
        if (obj.mode) setMode(obj.mode);
        if (obj.translationTable) setTranslationTable(obj.translationTable);
        pushLog("Imported snapshot");
      } catch {
        pushLog("Failed to import snapshot");
      }
    };
    r.readAsText(f);
  }

  function clearTranslations() {
    translationTable.forEach((t) => {
      if (t.type === "dynamic" && t.publicIp) releasePublicToPool(t.publicIp);
      if (t.type === "pat" && t.publicIp && t.publicPort) {
        updatePatRef((prev) => {
          const copy = { ...prev };
          if (copy[t.publicIp]) delete copy[t.publicIp][t.publicPort];
          return copy;
        });
      }
    });
    setTranslationTable([]);
    pushLog("Cleared translation table");
  }

  /* -------------------------
   * NEW: Simulation control (Start / Stop)
   * S2: cycle every 3s
   * B2: auto-add client every 10s while running
   * --------------------------*/
  function runCycleOnce() {
    // send a flow from every client
    clients.forEach((c) => {
      startClientFlow(c.id);
    });
  }

  function startSimulation() {
    if (running) return;
    animCancelRef.current = false;
    setRunning(true);
    pushLog("Simulation started (continuous).");
    // run immediately, then every 3s
    runCycleOnce();
    simIntervalRef.current = setInterval(() => {
      runCycleOnce();
    }, 3000); // S2: 3 seconds

    // auto-add new clients every 10s if B2
    if (autoRunNewClients) {
      autoAddRef.current = setInterval(() => {
        const newC = addClient();
        // start flow immediately for newly added client
        startClientFlow(newC.id);
      }, 10000); // B2: 10 seconds
    }
  }

  function stopSimulation() {
    if (!running) return;
    setRunning(false);
    pushLog("Simulation stopped.");
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    if (autoAddRef.current) {
      clearInterval(autoAddRef.current);
      autoAddRef.current = null;
    }
    // cancel in-flight animations by setting flag and clearing animPackets
    animCancelRef.current = true;
    setTimeout(() => {
      animCancelRef.current = false;
    }, 50);
    setAnimPackets([]);
    // set all clients to not active (stop glow)
    setClients((prev) => prev.map((x) => ({ ...x, active: false })));
  }

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (autoAddRef.current) clearInterval(autoAddRef.current);
      animCancelRef.current = true;
    };
  }, []);

  /* -------------------------
   * Render positions for animation overlay
   * --------------------------*/
  const positions = { nat: { x: 380, y: 180 }, internet: { x: 700, y: 180 } };
  clients.forEach((c, i) => {
    positions[c.id] = { x: 60 + (i % 4) * 140, y: 40 + Math.floor(i / 4) * 140 };
  });

  /* -------------------------
   * UI: Match your existing style but add Start/Stop & running indicator
   * --------------------------*/
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">🌐 NAT Simulator</h3>

        {/* Running indicator */}
        <div className="flex items-center gap-3">
          {running ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <div className="text-xs text-gray-600 dark:text-gray-300">Simulation Running</div>
              <button onClick={stopSimulation} className="ml-3 px-3 py-1 bg-red-600 text-white rounded-md text-xs">Stop</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-600 dark:text-gray-300">Simulation stopped</div>
              <button onClick={startSimulation} className="ml-3 px-3 py-1 bg-green-600 text-white rounded-md text-xs">Start Simulation</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Controls */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="mt-2 w-full p-2 border rounded-md dark:bg-gray-800">
            <option value="pat">PAT (Overload)</option>
            <option value="dynamic">Dynamic NAT (Pool)</option>
            <option value="static">Static NAT (1:1)</option>
          </select>

          <div className="mt-3 p-3 border rounded bg-gray-50 dark:bg-gray-800">
            <div className="text-xs">Public Pool ({publicPool.length})</div>
            <div className="text-xs">{publicPool.join(", ") || "(empty)"}</div>

            <div className="mt-2">
              <button onClick={() => { setPublicPool([...publicPool, `203.0.113.${10 + publicPool.length}`]); pushLog("Added public IP to pool"); }} className="px-3 py-2 bg-green-600 text-white rounded-md mr-2">+ Add public IP</button>
              <button onClick={() => { setPublicPool(publicPool.slice(0, -1)); pushLog("Removed last public IP"); }} className="px-3 py-2 bg-gray-200 rounded-md">- Remove</button>
            </div>
          </div>

          <div className="mt-3">
            <button onClick={() => addClient()} className="px-3 py-2 bg-green-600 text-white rounded-md mr-2">➕ Add Client</button>
            <button onClick={() => clearTranslations()} className="px-3 py-2 bg-yellow-500 text-white rounded-md mr-2">Clear Translations</button>
            <button onClick={() => exportSnapshot()} className="px-3 py-2 bg-slate-700 text-white rounded-md">Export</button>
            <label className="px-3 py-2 bg-slate-200 rounded-md cursor-pointer ml-2 text-sm">
              <input type="file" accept="application/json" onChange={importSnapshot} className="hidden" />Import
            </label>
          </div>

          <div className="mt-3 p-3 border rounded bg-gray-50 dark:bg-gray-800 text-xs">
            <div><label className="flex items-center gap-2"><input type="checkbox" checked={asymmetricRouting} onChange={(e) => setAsymmetricRouting(e.target.checked)} /> Simulate Asymmetric Routing</label></div>
            <div className="mt-2">PAT Port Range: <input value={patPortRange.start} onChange={(e)=> setPatPortRange(p=>({...p, start: Number(e.target.value)}))} className="w-20 p-1 mx-1 rounded border text-xs inline" /> - <input value={patPortRange.end} onChange={(e)=> setPatPortRange(p=>({...p, end: Number(e.target.value)}))} className="w-20 p-1 mx-1 rounded border text-xs inline" /></div>
            <div className="mt-2"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={autoRunNewClients} onChange={(e)=> setAutoRunNewClients(e.target.checked)} /> Auto-add new clients while running (every 10s)</label></div>
          </div>
        </div>

        {/* Network View */}
        <div className="col-span-2 p-3 border rounded bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Network View</div>
            <div className="text-xs text-gray-500">Translations: {translationTable.length}</div>
          </div>

          <div style={{ position: "relative", height: 420 }}>
            {/* NAT device - glow when running */}
            <div style={{ position: "absolute", left: positions.nat.x - 48, top: positions.nat.y - 36 }}>
              <div className={`w-32 h-24 rounded-md border flex items-center justify-center ${running ? "bg-yellow-100 ring-4 ring-yellow-200 animate-pulse" : "bg-yellow-50"}`}>NAT Device</div>
            </div>

            {/* Internet */}
            <div style={{ position: "absolute", left: positions.internet.x - 48, top: positions.internet.y - 36 }}>
              <div className="w-32 h-24 rounded-md border bg-slate-50 flex items-center justify-center">Internet</div>
            </div>

            {/* Clients */}
            {clients.map((c) => (
              <div key={c.id} style={{ position: "absolute", left: positions[c.id].x - 46, top: positions[c.id].y - 20 }}>
                <div className={`w-40 p-2 rounded-md border ${c.active ? "bg-green-50 ring-2 ring-green-200" : "bg-white"}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.insideIp}</div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => startClientFlow(c.id)} className="px-2 py-1 bg-indigo-600 text-white rounded-md text-xs">Start</button>
                    <button onClick={() => removeClient(c.id)} className="px-2 py-1 bg-gray-200 rounded-md text-xs">Remove</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Animated packets overlay */}
            <svg width="100%" height={420} style={{ position: "absolute", left: 0, top: 0 }}>
              {animPackets.map((p) => {
                const from = p.from === "nat" ? positions.nat : p.from === "internet" ? positions.internet : positions[p.from];
                const to = p.to === "nat" ? positions.nat : p.to === "internet" ? positions.internet : positions[p.to];
                if (!from || !to) return null;
                const x = from.x + (to.x - from.x) * Math.min(1, Math.max(0, p.t));
                const y = from.y + (to.y - from.y) * Math.min(1, Math.max(0, p.t));
                return (
                  <g key={p.id}>
                    <circle cx={x} cy={y} r={8} fill="#3B82F6" />
                    <text x={x} y={y + 4} fontSize={8} textAnchor="middle" fill="#fff">{p.label}</text>
                  </g>
                );
              })}
            </svg>

            {/* Port exhaustion alarm */}
            {portExhaustionAlarm && (
              <div style={{ position: "absolute", right: 12, top: 12 }} className="p-2 rounded-md bg-red-500 text-white text-xs animate-pulse">Port exhaustion on {portExhaustionAlarm}</div>
            )}
          </div>
        </div>
      </div>

      {/* Translation table and static map editor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Translation Table</div>
          <div className="text-xs mb-2">InsideLocal → InsideGlobal/Public</div>
          <div className="space-y-2 max-h-56 overflow-auto">
            {translationTable.length === 0 && <div className="text-xs text-gray-500">No active translations</div>}
            {translationTable.map((t, i) => (
              <div key={i} className="p-2 rounded border bg-white dark:bg-gray-900 text-xs flex justify-between items-center">
                <div>
                  <div><b>{t.insideIp}{t.insidePort ? `:${t.insidePort}` : ""}</b> → {t.publicIp}{t.publicPort ? `:${t.publicPort}` : ""}</div>
                  <div className="text-gray-500">{t.type} • {t.proto} {t.expiresAt ? `• expires in ${Math.max(0, Math.round((t.expiresAt - Date.now())/1000))}s` : ""}</div>
                </div>
                <div>
                  <button onClick={() => releaseTranslationByInside(t.insideIp)} className="px-2 py-1 bg-gray-200 rounded text-xs">Release</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Static Mappings (1:1)</div>
          <div className="space-y-2">
            {staticMaps.map((s, i) => (
              <div key={i} className="p-2 rounded border bg-white dark:bg-gray-900 text-xs flex justify-between items-center">
                <div>{s.inside} → {s.public}</div>
                <div><button onClick={() => setStaticMaps(ms => ms.filter((_, idx) => idx !== i))} className="px-2 py-1 bg-red-100 rounded text-xs">Remove</button></div>
              </div>
            ))}
            <StaticMapEditor onAdd={(m) => { setStaticMaps((s)=>[...s,m]); pushLog(`Added static map ${m.inside}→${m.public}`); }} />
          </div>
        </div>

        <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Public Pool</div>
          <div className="text-xs mb-2">Editable public pool & PAT diagnostics</div>
          <div className="text-xs">Pool: {publicPool.join(", ") || "(empty)"}</div>
          <div className="mt-2 text-xs">PAT map summary:</div>
          <div className="mt-2 text-xs">
            {Object.keys(patMapRef.current).length === 0 && <div className="text-gray-500">No PAT allocations yet</div>}
            {Object.entries(patMapRef.current).map(([pub, map]) => (
              <div key={pub} className="text-xs">
                <b>{pub}</b>: {Object.keys(map).length} ports used
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="mt-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Simulator Log</div>
        <div className="h-48 overflow-auto p-3 bg-black text-green-300 font-mono rounded">
          {logs.map((l,i) => <div key={i} className="text-xs whitespace-pre-wrap">{l}</div>)}
        </div>
      </div>
    </div>
  );
}

/* Helper: StaticMapEditor component */
function StaticMapEditor({ onAdd }) {
  const [inside, setInside] = useState("10.30.30.10");
  const [publicIp, setPublicIp] = useState("203.0.113.20");
  return (
    <div className="mt-2">
      <div className="grid grid-cols-2 gap-2">
        <input value={inside} onChange={(e)=> setInside(e.target.value)} className="p-2 rounded border text-xs" />
        <input value={publicIp} onChange={(e)=> setPublicIp(e.target.value)} className="p-2 rounded border text-xs" />
      </div>
      <div className="mt-2">
        <button onClick={() => onAdd({ inside, public: publicIp })} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs">Add Static Map</button>
      </div>
    </div>
  );
}
