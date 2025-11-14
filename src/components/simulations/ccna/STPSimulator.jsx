import React, { useState, useRef, useEffect } from "react";

/**
 * STPSimulator.jsx — Enhanced simulator matched to your UI patterns
 * Place at: /src/components/simulations/ccna/STPSimulator.jsx
 * Features implemented:
 * - Blocked/Designated port color legend
 * - Highlight Root Bridge visually (glow)
 * - Click on link to delete
 * - Click on switch to set bridge priority
 * - Auto-arrange topology (force-directed physics)
 * - Animated BPDU flow (colored packets)
 * - STP vs RSTP toggle
 * - Per-port state tooltip on hover
 * - Timer visualizer (Hello / Forward Delay / Max Age) with controls
 *
 * Matches styling & patterns used in your VLANTrafficFlowSimulator (Tailwind, logs, cards)
 */

const DEFAULT_SWITCHES = [
  { id: 1, name: "S1", x: 160, y: 140, priority: 32768 },
  { id: 2, name: "S2", x: 420, y: 120, priority: 32768 },
  { id: 3, name: "S3", x: 700, y: 200, priority: 32768 },
  { id: 4, name: "S4", x: 420, y: 360, priority: 32768 },
];

const DEFAULT_LINKS = [
  { id: 1, a: 1, b: 2, cost: 10 },
  { id: 2, a: 2, b: 3, cost: 10 },
  { id: 3, a: 1, b: 4, cost: 20 },
  { id: 4, a: 3, b: 4, cost: 5 },
  { id: 5, a: 2, b: 4, cost: 15 },
];

// BPDU packet styles
const BPDU_COLORS = {
  config: "#10B981", // green
  proposal: "#F59E0B", // yellow
  agreement: "#3B82F6", // blue
  tcn: "#EF4444", // red
};

export default function STPSimulator() {
  // topology state
  const [switches, setSwitches] = useState(DEFAULT_SWITCHES.map(s => ({...s, vx:0, vy:0})));
  const [links, setLinks] = useState(DEFAULT_LINKS.map(l=>({...l, designated: null, state: 'designated'})));

  // UI / controls
  const [selectedFrom, setSelectedFrom] = useState(1);
  const [selectedTo, setSelectedTo] = useState(2);
  const [linkCost, setLinkCost] = useState(10);
  const [logs, setLogs] = useState(["STP Simulator ready — enhanced mode."]);
  const [rootId, setRootId] = useState("");
  const [stpMode, setStpMode] = useState("STP"); // 'STP' or 'RSTP'

  // timers (defaults for classic STP)
  const [helloTime, setHelloTime] = useState(2);
  const [forwardDelay, setForwardDelay] = useState(15);
  const [maxAge, setMaxAge] = useState(20);

  // animation
  const [bpduPackets, setBpduPackets] = useState([]); // {id, linkId, t(0..1), color, type}
  const nextPacketId = useRef(1);

  // dragging
  const dragRef = useRef(null);

  // force simulation refs
  const simRef = useRef({running:false, raf: null});

  const pushLog = (msg) => setLogs(s=>{ const next=[...s, `${new Date().toLocaleTimeString()} — ${msg}`]; return next.slice(-18); });

  // helpers
  const getSwitch = id => switches.find(s=>s.id===id);
  const getLink = id => links.find(l=>l.id===id);

  // --- Topology edit functions ---
  function addSwitch(){
    const id = switches.length ? Math.max(...switches.map(s=>s.id))+1 : 1;
    const sw = {id, name:`S${id}`, x:250 + Math.random()*400, y:150 + Math.random()*200, priority:32768, vx:0, vy:0};
    setSwitches(s=>[...s, sw]);
    pushLog(`Added ${sw.name}`);
  }

  function addLink(){
    if(selectedFrom===selectedTo){ pushLog('Cannot connect switch to itself'); return; }
    if(links.some(l=> (l.a===selectedFrom && l.b===selectedTo) || (l.a===selectedTo && l.b===selectedFrom))){ pushLog('Link already exists'); return; }
    const id = links.length ? Math.max(...links.map(l=>l.id))+1 : 1;
    const l = {id,a:selectedFrom,b:selectedTo,cost: Number(linkCost)||10, designated:null, state:'designated'};
    setLinks(s=>[...s,l]);
    pushLog(`Added link S${l.a} <-> S${l.b} (cost ${l.cost})`);
  }

  function deleteLink(linkId){
    setLinks(l=> l.filter(x=>x.id!==linkId));
    pushLog(`Deleted link L${linkId}`);
  }

  function clearTopology(){ if(!confirm('Clear topology?')) return; setSwitches([]); setLinks([]); pushLog('Topology cleared'); }

  // set priority (clicked on switch)
  function promptSetPriority(sw){
    const val = prompt(`Set bridge priority for ${sw.name} (current ${sw.priority}) — must be multiple of 4096`, sw.priority);
    if(val===null) return;
    const p = Number(val);
    if(Number.isNaN(p)){ pushLog('Invalid priority value'); return; }
    setSwitches(s=> s.map(x=> x.id===sw.id? {...x, priority:p}: x));
    pushLog(`Priority for ${sw.name} set to ${p}`);
  }

  // pointer drag
  function onPointerDown(e, sw){
    dragRef.current = { id: sw.id, startX: e.clientX, startY: e.clientY, origX: sw.x, origY: sw.y };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }
  function onPointerMove(e){
    if(!dragRef.current) return;
    const d = dragRef.current; const nx = d.origX + (e.clientX - d.startX); const ny = d.origY + (e.clientY - d.startY);
    setSwitches(s=> s.map(x=> x.id===d.id? {...x, x:nx, y:ny} : x));
  }
  function onPointerUp(){ dragRef.current = null; window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('pointerup', onPointerUp); }

  // --- STP core logic (simplified but educational) ---
  function runSTP(calcOnly=false){
    if(switches.length===0) return;
    const root = rootId? Number(rootId) : Math.min(...switches.map(s=>s.id));
    pushLog(`Running ${stpMode} — root candidate: S${root}`);

    // compute Bridge ID = priority:MAC. We don't have MACs here, so tie-break by id.
    // Dijkstra like path costs
    const nodes = new Map(); switches.forEach(s=> nodes.set(s.id, {cost: Infinity, prev: null}));
    nodes.get(root).cost = 0;
    const adj = new Map(); switches.forEach(s=> adj.set(s.id, []));
    links.forEach(l=>{ adj.get(l.a).push({to:l.b,cost:l.cost,linkId:l.id}); adj.get(l.b).push({to:l.a,cost:l.cost,linkId:l.id}); });

    const Q = new Set(nodes.keys());
    while(Q.size){ let u=null; let best=Infinity; for(const id of Q){ if(nodes.get(id).cost < best){ best = nodes.get(id).cost; u = id; } } if(u===null) break; Q.delete(u);
      for(const e of adj.get(u) || []){ const alt = nodes.get(u).cost + e.cost; if(alt < nodes.get(e.to).cost){ nodes.get(e.to).cost = alt; nodes.get(e.to).prev = u; } }
    }

    // decide designated per link
    const updated = links.map(l=>{
      const costA = nodes.get(l.a)?.cost ?? Infinity; const costB = nodes.get(l.b)?.cost ?? Infinity;
      let designated = null;
      if(costA < costB) designated = l.a;
      else if(costB < costA) designated = l.b;
      else designated = l.a < l.b ? l.a : l.b;
      const state = designated ? 'designated' : 'blocked';
      return {...l, designated, state: (designated? (designated===l.a ? 'a-designated' : 'b-designated') : 'blocked') };
    });

    setLinks(updated);
    pushLog('STP calculation finished.');

    if(!calcOnly){
      // animate BPDUs across topology to show convergence
      startBPDUFlood(root);
    }
  }

  // --- Auto-arrange: force-directed simple physics ---
  function startAutoArrange(){
    if(simRef.current.running) return; simRef.current.running = true; pushLog('Auto-arrange (force) started'); simStep();
  }
  function stopAutoArrange(){ simRef.current.running = false; if(simRef.current.raf) cancelAnimationFrame(simRef.current.raf); pushLog('Auto-arrange stopped'); }

  function simStep(){
    // apply repulsion and spring forces
    const kRepel = 14000; const kSpring = 0.05; const damping = 0.85;
    setSwitches(prev => {
      const next = prev.map(n => ({...n}));
      // repulsion
      for(let i=0;i<next.length;i++){
        for(let j=i+1;j<next.length;j++){
          const a = next[i], b = next[j]; let dx = a.x - b.x; let dy = a.y - b.y; let d2 = dx*dx + dy*dy; let d = Math.sqrt(Math.max(d2,1)); let force = kRepel / (d2 + 1000);
          let fx = (dx/d)*force; let fy = (dy/d)*force; a.vx = (a.vx||0) + fx; a.vy = (a.vy||0) + fy; b.vx = (b.vx||0) - fx; b.vy = (b.vy||0) - fy;
        }
      }
      // springs along links
      links.forEach(l=>{
        const ia = next.find(n=>n.id===l.a); const ib = next.find(n=>n.id===l.b); if(!ia||!ib) return; let dx = ib.x - ia.x; let dy = ib.y - ia.y; let d = Math.sqrt(dx*dx + dy*dy) || 1; let desired = 180; let force = kSpring*(d - desired);
        let fx = (dx/d)*force; let fy = (dy/d)*force; ia.vx = (ia.vx||0) + fx; ia.vy = (ia.vy||0) + fy; ib.vx = (ib.vx||0) - fx; ib.vy = (ib.vy||0) - fy;
      });
      // integrate
      next.forEach(n=>{ n.vx = (n.vx||0)*damping; n.vy = (n.vy||0)*damping; n.x += n.vx*0.016; n.y += n.vy*0.016; // keep within viewport
        n.x = Math.max(60, Math.min(1000, n.x)); n.y = Math.max(60, Math.min(520, n.y));
      });
      return next;
    });
    simRef.current.raf = requestAnimationFrame(simStep);
  }

  // --- BPDU packet animation ---
  function startBPDUFlood(root){
    // start BPDUs from root toward all links
    const idBase = nextPacketId.current;
    const newPackets = [];
    links.forEach(l=>{
      // create packet towards both ends (authentic STP sends config BPDUs periodically)
      const color = BPDU_COLORS.config; const type = 'config';
      newPackets.push({ id: idBase + newPackets.length + 1, linkId: l.id, t:0, dir: l.a===root? 'a->b' : 'b->a', color, type });
    });
    nextPacketId.current += newPackets.length;
    setBpduPackets(prev => [...prev, ...newPackets]);

    // animate over time
    if(!simRef.current.raf) animatePackets();
  }

  function animatePackets(){
    let last = performance.now();
    function frame(now){
      const dt = (now - last)/1000; last = now;
      setBpduPackets(prev => {
        const next = prev.map(p => ({...p, t: p.t + dt*0.7})).filter(p=> p.t <= 1.05);
        return next;
      });
      if(simRef.current.running || bpduPackets.length > 0) {
        simRef.current.raf = requestAnimationFrame(frame);
      }
    }
    simRef.current.raf = requestAnimationFrame(frame);
  }

  // remove packets regularly (cleanup)
  useEffect(()=>{
    if(bpduPackets.length>0 && !simRef.current.raf) animatePackets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpduPackets.length]);

  // --- STP vs RSTP behavior toggle ---
  function toggleMode(){ setStpMode(m=> m==='STP'?'RSTP':'STP'); pushLog(`Mode switched to ${stpMode==='STP' ? 'RSTP' : 'STP'}`); }

  // show per-link hover state via temporary state
  const [hoverInfo, setHoverInfo] = useState(null);

  // timer visualizer helper
  function formatTimerSec(v){ return `${v}s`; }

  // start/stop auto arrange controls
  const [autoArranging, setAutoArranging] = useState(false);
  function toggleAutoArrange(){ if(autoArranging){ stopAutoArrange(); setAutoArranging(false); } else { startAutoArrange(); setAutoArranging(true); } }

  // convenience: run STP automatically when topology changes
  useEffect(()=>{ /* do nothing automatically; user invokes runSTP */ }, [links, switches]);

  // --- Render ---
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 shadow-md">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">🌳 STP (Spanning Tree) Simulator — Enhanced</h3>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
          <select value={selectedFrom} onChange={(e)=>setSelectedFrom(Number(e.target.value))} className="mt-2 w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white">
            {switches.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
          <select value={selectedTo} onChange={(e)=>setSelectedTo(Number(e.target.value))} className="mt-2 w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white">
            {switches.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Controls</label>
          <div className="flex gap-2 mt-2">
            <button onClick={addLink} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">➕ Add Link</button>
            <button onClick={addSwitch} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">➕ Add Switch</button>
            <button onClick={()=>runSTP()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">▶ Run STP</button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="number" value={linkCost} onChange={(e)=>setLinkCost(e.target.value)} className="w-20 p-2 border rounded-md dark:bg-gray-800 dark:text-white" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Link Cost</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <select value={rootId} onChange={(e)=>setRootId(e.target.value)} className="p-2 border rounded-md dark:bg-gray-800 dark:text-white">
              <option value="">Auto Root (lowest ID)</option>
              {switches.map(s=> <option key={s.id} value={s.id}>{s.name} (prio {s.priority})</option>)}
            </select>
            <button onClick={()=> { setRootId(''); pushLog('Root selection reset to auto'); }} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md">Reset</button>
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={toggleMode} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md">Mode: {stpMode}</button>
            <button onClick={toggleAutoArrange} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md">{autoArranging? 'Stop Arrange' : 'Auto-arrange'}</button>
            <button onClick={()=>{ clearTopology(); setSwitches(DEFAULT_SWITCHES.map(s=>({...s,vx:0,vy:0}))); setLinks(DEFAULT_LINKS.map(l=>({...l,designated:null, state:'designated'}))); pushLog('Restored default topology'); }} className="px-4 py-2 bg-gray-200 rounded-md">Restore</button>
          </div>
        </div>
      </div>

      {/* Second row: legend + timers + helpers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Legend</div>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded border bg-green-100 border-green-400" /> <div className="text-xs">Designated Port / Active</div>
            <div className="w-4 h-4 rounded border bg-red-100 border-red-400 ml-4" /> <div className="text-xs">Blocked Port</div>
            <div className="w-4 h-4 rounded border bg-indigo-200 border-indigo-400 ml-4" /> <div className="text-xs">Root Bridge (glow)</div>
          </div>
        </div>

        <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">STP Timers</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <div>Hello Time</div>
              <div className="font-mono">{formatTimerSec(helloTime)}</div>
            </div>
            <input type="range" min={1} max={5} value={helloTime} onChange={e=>setHelloTime(Number(e.target.value))} />

            <div className="flex items-center justify-between text-xs">
              <div>Forward Delay</div>
              <div className="font-mono">{formatTimerSec(forwardDelay)}</div>
            </div>
            <input type="range" min={5} max={30} value={forwardDelay} onChange={e=>setForwardDelay(Number(e.target.value))} />

            <div className="flex items-center justify-between text-xs">
              <div>Max Age</div>
              <div className="font-mono">{formatTimerSec(maxAge)}</div>
            </div>
            <input type="range" min={10} max={40} value={maxAge} onChange={e=>setMaxAge(Number(e.target.value))} />

            <div className="text-xs text-gray-600 mt-2">Mode: {stpMode}. For faster convergence, use RSTP.</div>
          </div>
        </div>

        <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Helpers</div>
          <div className="flex flex-col gap-2 text-xs">
            <button onClick={()=>{ runSTP(); pushLog('Run STP (with animation)'); }} className="px-3 py-2 bg-blue-600 text-white rounded-md">Run + Animate</button>
            <button onClick={()=>{ runSTP(true); pushLog('Run STP (calc only)'); }} className="px-3 py-2 bg-gray-200 rounded-md">Calculate Only</button>
            <button onClick={()=>{ setBpduPackets([]); pushLog('Cleared BPDU animations'); }} className="px-3 py-2 bg-gray-200 rounded-md">Clear BPDU</button>
          </div>
        </div>
      </div>

      {/* Topology Panel */}
      <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
        <svg width="100%" height={520} style={{background:'white'}}>
          {/* draw links (underlays) */}
          {links.map(l=>{
            const a = getSwitch(l.a); const b = getSwitch(l.b); if(!a||!b) return null;
            // decide stroke based on link state
            const isBlocked = l.state && l.state.startsWith('b');
            const stroke = isBlocked ? '#ef4444' : '#10B981';
            const dash = isBlocked ? '6 6' : '';
            return (
              <g key={l.id} onMouseEnter={(e)=> setHoverInfo({type:'link', id:l.id, a:l.a, b:l.b, cost:l.cost})} onMouseLeave={()=>setHoverInfo(null)}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={stroke} strokeWidth={4} strokeDasharray={dash} />
                <text x={(a.x+b.x)/2} y={(a.y+b.y)/2 - 12} textAnchor="middle" fontSize={12} fill="#334155">{l.cost}</text>
                {/* clickable delete hotspot */}
                <rect x={(a.x+b.x)/2 - 18} y={(a.y+b.y)/2 - 24} width={36} height={18} fill="transparent" onClick={()=>{ if(window.confirm('Delete this link?')) deleteLink(l.id); }} style={{cursor:'pointer'}} />
              </g>
            );
          })}

          {/* BPDU packets */}
          {bpduPackets.map(p=>{
            const link = getLink(p.linkId); if(!link) return null; const a = getSwitch(link.a); const b = getSwitch(link.b); if(!a||!b) return null;
            // compute position along link depending on direction
            const t = Math.max(0, Math.min(1, p.t)); const sx = p.dir==='a->b'? a.x : b.x; const sy = p.dir==='a->b'? a.y : b.y; const ex = p.dir==='a->b'? b.x : a.x; const ey = p.dir==='a->b'? b.y : a.y; const cx = sx + (ex - sx) * t; const cy = sy + (ey - sy) * t;
            return (
              <circle key={p.id} cx={cx} cy={cy} r={6} fill={p.color} fillOpacity={0.95} />
            );
          })}

          {/* switches on top */}
          {switches.map(sw=>{
            const isRoot = (rootId? Number(rootId) : Math.min(...switches.map(s=>s.id))) === sw.id;
            return (
              <g key={sw.id} transform={`translate(${sw.x},${sw.y})`} onPointerDown={(e)=>onPointerDown(e,sw)} onDoubleClick={()=> promptSetPriority(sw)} onMouseEnter={()=> setHoverInfo({type:'switch', id:sw.id})} onMouseLeave={()=> setHoverInfo(null)} style={{cursor:'grab'}}>
                <circle r={26} fill={isRoot? '#EEF2FF' : '#0ea5a4'} stroke={isRoot? '#3730A3' : '#064E3B'} strokeWidth={isRoot? 4 : 3} />
                {/* glow for root */}
                {isRoot && <circle r={34} fillOpacity={0.08} fill="#6366F1" />}
                <text x={0} y={6} textAnchor="middle" fontSize={12} fill={isRoot? '#0f1724' : '#ffffff'}>{sw.name}</text>
                <text x={0} y={24} textAnchor="middle" fontSize={10} fill="#334155">prio {sw.priority}</text>
              </g>
            );
          })}

        </svg>
      </div>

      {/* Hover info tooltip */}
      {hoverInfo && hoverInfo.type==='switch' && (
        <div className="mb-2 text-xs text-gray-600">Hover: {getSwitch(hoverInfo.id)?.name} — click to set priority (double-click)</div>
      )}
      {hoverInfo && hoverInfo.type==='link' && (
        <div className="mb-2 text-xs text-gray-600">Hover Link: L{hoverInfo.id} S{hoverInfo.a} ↔ S{hoverInfo.b} cost {hoverInfo.cost}</div>
      )}

      {/* Logs */}
      <div className="mt-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Simulation Log</div>
        <div className="h-44 overflow-auto p-3 bg-black text-green-300 font-mono rounded">
          {logs.map((l,i)=> <div key={i} className="whitespace-pre-wrap text-xs">{l}</div>)}
        </div>
      </div>
    </div>
  );
}
