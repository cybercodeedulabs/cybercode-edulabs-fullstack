import React, { useState, useMemo, useRef } from "react";

// IPSubnetVisualizer.jsx
// Place this file under: /src/components/simulations/ccna/IPSubnetVisualizer.jsx
// This component renders an interactive subnet calculator + visualizer and
// also renders an SVG diagram (Network vs Host bits) which can be downloaded as PNG/SVG.

function ipToInt(ip) {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0;
}

function intToIp(int) {
  return [24, 16, 8, 0].map(shift => (int >>> shift) & 0xff).join('.');
}

function cidrToMask(cidr) {
  const mask = cidr === 0 ? 0 : (~((1 << (32 - cidr)) - 1)) >>> 0;
  return intToIp(mask);
}

function hostsForCidr(cidr) {
  const hostBits = 32 - cidr;
  return hostBits <= 0 ? 0 : Math.max(0, Math.pow(2, hostBits) - 2);
}

function generateSubnets(networkIp, cidr, newCidr) {
  // networkIp as integer
  const step = 1 << (32 - newCidr);
  const subnets = [];
  const total = 1 << (newCidr - cidr);
  for (let i = 0; i < total; i++) {
    const net = (networkIp + i * step) >>> 0;
    const first = (net + 1) >>> 0;
    const last = (net + step - 2) >>> 0;
    const broadcast = (net + step - 1) >>> 0;
    subnets.push({
      network: intToIp(net),
      first: intToIp(first),
      last: intToIp(last),
      broadcast: intToIp(broadcast),
      cidr: newCidr,
      hosts: hostsForCidr(newCidr),
      mask: cidrToMask(newCidr),
    });
  }
  return subnets;
}

export default function IPSubnetVisualizer({ className = "" }) {
  const [network, setNetwork] = useState("192.168.10.0");
  const [baseCidr, setBaseCidr] = useState(24);
  const [newCidr, setNewCidr] = useState(26);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const svgRef = useRef(null);

  const baseInt = useMemo(() => ipToInt(network) & (~0 << (32 - baseCidr)), [network, baseCidr]);

  const subnets = useMemo(() => {
    if (newCidr < baseCidr) return [];
    try {
      return generateSubnets(baseInt, baseCidr, newCidr);
    } catch (e) {
      return [];
    }
  }, [baseInt, baseCidr, newCidr]);

  const current = subnets[selectedIndex] || null;

  function handlePrev() {
    setSelectedIndex((s) => Math.max(0, s - 1));
  }
  function handleNext() {
    setSelectedIndex((s) => Math.min(subnets.length - 1, s + 1));
  }

  function validateIp(value) {
    const parts = value.split('.');
    if (parts.length !== 4) return false;
    return parts.every(p => {
      const n = Number(p);
      return Number.isInteger(n) && n >= 0 && n <= 255;
    });
  }

  async function downloadSvgAsPng() {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = png;
      a.download = 'ip-subnet-diagram.png';
      a.click();
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  return (
    <div className={`p-6 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-md ${className}`}>
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">🧭 IP Subnet Visualizer</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Network (base)</label>
          <input
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white ${!validateIp(network) ? 'border-red-400' : ''}`}
          />
          <p className="text-xs text-gray-500 mt-1">Example: 192.168.10.0</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Base CIDR</label>
          <select value={baseCidr} onChange={(e) => setBaseCidr(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white">
            {Array.from({length: 24}, (_,i)=> i+8).map(c => (
              <option key={c} value={c}>/{c}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Network prefix length</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subnet to create (new CIDR)</label>
          <select value={newCidr} onChange={(e) => { setNewCidr(Number(e.target.value)); setSelectedIndex(0); }} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white">
            {Array.from({length: 33 - baseCidr}, (_,i)=> baseCidr + i).map(c => (
              <option key={c} value={c}>/{c}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Choose a longer mask to split the base network</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Subnets generated</div>
                <div className="text-xl font-mono">{subnets.length || 0}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-300">Hosts / Subnet</div>
                <div className="text-xl font-mono">{current ? current.hosts : '—'}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subnets.slice(0,6).map((s, i) => (
                <div key={i} className={`p-3 rounded-md border dark:border-gray-700 ${selectedIndex===i ? 'bg-indigo-50 dark:bg-indigo-800 border-indigo-300' : 'bg-white dark:bg-gray-900'}`}>
                  <div className="font-semibold">{s.network}/{s.cidr}</div>
                  <div className="text-xs text-gray-500">{s.first} – {s.last}</div>
                </div>
              ))}

              {subnets.length > 6 && (
                <div className="col-span-1 sm:col-span-2 p-3 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-600">Showing first 6 subnets. Use Prev/Next to navigate all.</div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={handlePrev} disabled={selectedIndex===0} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50">◀ Prev</button>
              <button onClick={handleNext} disabled={selectedIndex>=subnets.length-1} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50">Next ▶</button>

              <div className="ml-auto text-sm text-gray-500">Selected: {selectedIndex+1}/{subnets.length || 0}</div>
            </div>

            {current && (
              <div className="mt-4 p-3 bg-black text-green-300 font-mono rounded">Network: {current.network}/{current.cidr}\nFirst: {current.first}\nLast: {current.last}\nBroadcast: {current.broadcast}\nMask: {current.mask}</div>
            )}

          </div>
        </div>

        <div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 h-full">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Binary view (selected subnet)</div>
            {current ? (
              <div className="text-xs font-mono bg-white dark:bg-gray-900 p-2 rounded">
                <div>Network: {current.network} → {current.network.split('.').map(o=>Number(o).toString(2).padStart(8,'0')).join('.')}</div>
                <div>Mask: {current.mask} → {current.mask.split('.').map(o=>Number(o).toString(2).padStart(8,'0')).join('.')}</div>
                <div className="mt-2">Usable host range: {current.first} - {current.last}</div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">No subnet selected or invalid input.</div>
            )}

            <div className="mt-4">
              <button onClick={() => {navigator.clipboard.writeText(current? JSON.stringify(current,null,2): '');}} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">Copy JSON</button>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Diagram + Download */}
      <div className="mt-4 border rounded p-3 bg-white dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">IP vs Bits Diagram</div>
          <div className="flex items-center gap-2">
            <button onClick={downloadSvgAsPng} className="px-3 py-2 bg-green-600 text-white rounded">Download PNG</button>
            <a href="#" onClick={(e)=>{e.preventDefault(); if (svgRef.current){ const serializer = new XMLSerializer(); const str = serializer.serializeToString(svgRef.current); const blob = new Blob([str],{type:'image/svg+xml'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='ip-subnet-diagram.svg'; a.click(); URL.revokeObjectURL(url);} }} className="px-3 py-2 bg-gray-200 rounded">Download SVG</a>
          </div>
        </div>

        <div className="overflow-auto">
          <svg ref={svgRef} width="900" height="120" viewBox="0 0 900 120" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="900" height="120" fill="#ffffff" />
            {/* Label */}
            <text x="20" y="20" fontSize="14" fill="#0f172a">IP Address: {network} /{newCidr}</text>

            {/* Bit boxes */}
            {Array.from({length:32}).map((_,i)=>{
              const x = 20 + i*26;
              const isNetworkBit = i < newCidr;
              return (
                <g key={i}>
                  <rect x={x} y={30} width={24} height={40} fill={isNetworkBit ? '#c7f9cc' : '#ffe4b5'} stroke="#111827" />
                  <text x={x+12} y={55} fontSize="10" textAnchor="middle" fill="#111827">{((i%8===0)?(Math.floor(i/8)+'.'):'')}</text>
                </g>
              );
            })}

            <text x="20" y="105" fontSize="12" fill="#065f46">Network bits (green) = {newCidr}</text>
            <text x="500" y="105" fontSize="12" fill="#92400e">Host bits (orange) = {32 - newCidr}</text>
          </svg>
        </div>

      </div>

    </div>
  );
}
