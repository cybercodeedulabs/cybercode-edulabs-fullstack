import React, { useState, useMemo, useRef, useEffect } from "react";

// ===========================================================
// 🧠 IPSubnetVisualizer — Interactive Subnetting Simulator
// Location: /src/components/simulations/ccna/IPSubnetVisualizer.jsx
// ===========================================================
// Features:
// ✅ CIDR subnet calculator
// ✅ Bit-level visualization (network vs host bits)
// ✅ Animated mask overlay for subnet changes
// ✅ Downloadable SVG & PNG
// ✅ Live simulation mode (auto cycles through subnets)
// ===========================================================

function ipToInt(ip) {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0;
}

function intToIp(int) {
  return [24, 16, 8, 0].map((shift) => (int >>> shift) & 0xff).join(".");
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
  const [animatedCidr, setAnimatedCidr] = useState(newCidr);
  const [autoPlay, setAutoPlay] = useState(false);
  const svgRef = useRef(null);

  // CIDR animation effect
  useEffect(() => {
    let frame;
    const diff = newCidr - animatedCidr;
    if (diff !== 0) {
      const step = diff > 0 ? 1 : -1;
      frame = setTimeout(() => setAnimatedCidr(animatedCidr + step), 40);
    }
    return () => clearTimeout(frame);
  }, [newCidr, animatedCidr]);

  // Auto Simulation (Next/Prev auto cycle)
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => {
        if (prev >= subnets.length - 1) return 0;
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const baseInt = useMemo(
    () => ipToInt(network) & (~0 << (32 - baseCidr)),
    [network, baseCidr]
  );

  const subnets = useMemo(() => {
    if (newCidr < baseCidr) return [];
    try {
      return generateSubnets(baseInt, baseCidr, newCidr);
    } catch {
      return [];
    }
  }, [baseInt, baseCidr, newCidr]);

  const current = subnets[selectedIndex] || null;

  function validateIp(value) {
    const parts = value.split(".");
    if (parts.length !== 4) return false;
    return parts.every((p) => {
      const n = Number(p);
      return Number.isInteger(n) && n >= 0 && n <= 255;
    });
  }

  function handlePrev() {
    setSelectedIndex((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    setSelectedIndex((i) => Math.min(subnets.length - 1, i + 1));
  }

  async function downloadSvgAsPng() {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = "ip-subnet-diagram.png";
      a.click();
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  return (
    <div
      className={`p-6 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-md ${className}`}
    >
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
        🧭 IP Subnet Visualizer
      </h3>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Network (base)</label>
          <input
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded ${
              !validateIp(network) ? "border-red-400" : ""
            }`}
          />
          <p className="text-xs text-gray-500 mt-1">Example: 192.168.10.0</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Base CIDR</label>
          <select
            value={baseCidr}
            onChange={(e) => setBaseCidr(Number(e.target.value))}
            className="mt-1 block w-full p-2 border rounded"
          >
            {Array.from({ length: 24 }, (_, i) => i + 8).map((c) => (
              <option key={c} value={c}>
                /{c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Subnet to create (new CIDR)
          </label>
          <select
            value={newCidr}
            onChange={(e) => setNewCidr(Number(e.target.value))}
            className="mt-1 block w-full p-2 border rounded"
          >
            {Array.from({ length: 33 - baseCidr }, (_, i) => baseCidr + i).map(
              (c) => (
                <option key={c} value={c}>
                  /{c}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setAutoPlay((v) => !v)}
          className={`px-4 py-2 rounded ${
            autoPlay
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {autoPlay ? "⏹ Stop Simulation" : "▶ Start Simulation"}
        </button>
        <button
          onClick={() => setSelectedIndex(0)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          🔁 Reset
        </button>
      </div>

      {/* Subnet Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-sm text-gray-600">Subnets generated</div>
                <div className="text-xl font-mono">{subnets.length || 0}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Hosts / Subnet</div>
                <div className="text-xl font-mono">
                  {current ? current.hosts : "—"}
                </div>
              </div>
            </div>

            {/* Subnet Cards */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subnets.slice(0, 6).map((s, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`p-3 rounded-md border cursor-pointer ${
                    selectedIndex === i
                      ? "bg-indigo-50 border-indigo-300"
                      : "bg-white"
                  }`}
                >
                  <div className="font-semibold">
                    {s.network}/{s.cidr}
                  </div>
                  <div className="text-xs text-gray-500">
                    {s.first} – {s.last}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
              >
                ◀ Prev
              </button>
              <button
                onClick={handleNext}
                disabled={selectedIndex >= subnets.length - 1}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
              >
                Next ▶
              </button>
              <div className="ml-auto text-sm text-gray-500">
                Selected: {selectedIndex + 1}/{subnets.length || 0}
              </div>
            </div>

            {/* Current Subnet Info */}
            {current && (
              <div className="mt-4 p-3 bg-black text-green-300 font-mono rounded whitespace-pre-line">
                Network: {current.network}/{current.cidr}
                {"\n"}First: {current.first}
                {"\n"}Last: {current.last}
                {"\n"}Broadcast: {current.broadcast}
                {"\n"}Mask: {current.mask}
              </div>
            )}
          </div>
        </div>

        {/* Binary + Copy JSON */}
        <div>
          <div className="p-4 bg-gray-50 rounded-lg border h-full">
            <div className="text-sm font-medium mb-2">
              Binary view (selected subnet)
            </div>
            {current ? (
              <div className="text-xs font-mono bg-white p-2 rounded">
                <div>
                  Network: {current.network} →{" "}
                  {current.network
                    .split(".")
                    .map((o) => Number(o).toString(2).padStart(8, "0"))
                    .join(".")}
                </div>
                <div>
                  Mask: {current.mask} →{" "}
                  {current.mask
                    .split(".")
                    .map((o) => Number(o).toString(2).padStart(8, "0"))
                    .join(".")}
                </div>
                <div className="mt-2">
                  Usable range: {current.first} - {current.last}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">No subnet selected.</div>
            )}
            <div className="mt-4">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    current ? JSON.stringify(current, null, 2) : ""
                  )
                }
                className="px-3 py-2 bg-gray-200 rounded"
              >
                Copy JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="mt-4 border rounded p-3 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-600">
            IP vs Bits Diagram
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadSvgAsPng}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Download PNG
            </button>
            <button
              onClick={() => {
                if (!svgRef.current) return;
                const serializer = new XMLSerializer();
                const str = serializer.serializeToString(svgRef.current);
                const blob = new Blob([str], { type: "image/svg+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "ip-subnet-diagram.svg";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              Download SVG
            </button>
          </div>
        </div>

        {/* Animated Bit Diagram */}
        <svg
          ref={svgRef}
          width="920"
          height="140"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="920" height="140" fill="#ffffff" />
          <text x="20" y="20" fontSize="14" fill="#0f172a">
            IP Address: {network} /{newCidr}
          </text>

          {Array.from({ length: 32 }).map((_, i) => {
            const x = 20 + i * 26;
            const isNetworkBit = i < animatedCidr;
            return (
              <g key={i} style={{ transition: "all 0.3s ease" }}>
                <rect
                  x={x}
                  y={30}
                  width={24}
                  height={40}
                  fill={isNetworkBit ? "#b6fbb3" : "#ffdd9e"}
                  stroke="#111827"
                />
                <text
                  x={x + 12}
                  y={55}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#111827"
                >
                  {i % 8 === 0 ? `${Math.floor(i / 8) + 1}` : ""}
                </text>
                <text
                  x={x + 12}
                  y={85}
                  fontSize="8"
                  textAnchor="middle"
                  fill="#6b7280"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}

          <text x="20" y="120" fontSize="12" fill="#065f46">
            Network bits (green) = {animatedCidr}
          </text>
          <text x="480" y="120" fontSize="12" fill="#92400e">
            Host bits (orange) = {32 - animatedCidr}
          </text>
        </svg>
      </div>
    </div>
  );
}
