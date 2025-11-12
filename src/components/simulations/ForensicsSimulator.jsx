// src/components/simulations/ForensicsSimulator.jsx
import React, { useState } from "react";

/**
 * ForensicsSimulator.jsx
 * ----------------------
 * Lightweight, interactive forensics lab for learners:
 * - Upload (paste) a sample "file" (text blob)
 * - Compute and verify SHA-256 (demonstrates hashing for evidence integrity)
 * - Simulate timeline entries (create/modify/access)
 * - "Carve" a deleted file from hex sample (simple substring search simulation)
 *
 * No backend required — all client-side.
 */

export default function ForensicsSimulator() {
  const [sample, setSample] = useState("");
  const [hash, setHash] = useState("");
  const [expectedHash, setExpectedHash] = useState("");
  const [logs, setLogs] = useState([]);
  const [carved, setCarved] = useState("");
  const [timeline, setTimeline] = useState([]);

  // compute SHA-256 using Web Crypto API
  const computeHash = async (text) => {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    const hex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex;
  };

  const handleIngest = async () => {
    if (!sample) return;
    addLog("Ingested evidence sample");
    const h = await computeHash(sample);
    setHash(h);
    addLog(`Computed SHA-256: ${h.slice(0, 12)}...`);
  };

  const handleVerify = async () => {
    if (!hash || !expectedHash) {
      addLog("Provide computed hash and expected hash to verify");
      return;
    }
    if (hash === expectedHash.trim()) {
      addLog("✅ Hash verification passed — evidence integrity preserved");
    } else {
      addLog("❌ Hash verification FAILED — evidence mismatch");
    }
  };

  const addLog = (msg) => {
    const ts = new Date().toLocaleTimeString();
    setLogs((l) => [...l.slice(-7), `[${ts}] ${msg}`]);
  };

  const addTimelineEvent = (evt) => {
    const ts = new Date().toISOString();
    setTimeline((t) => [...t, { ts, evt }]);
    addLog(`Timeline event added: ${evt}`);
  };

  // simple "carving" simulation: look for ASCII file signature or substring in hex text
  const handleCarve = (hexInput, marker) => {
    // marker: e.g., "504B0304" (PK.. for zip) or a plain text snippet
    if (!hexInput || !marker) {
      addLog("Provide hex input and marker for carving");
      return;
    }
    const idx = hexInput.indexOf(marker);
    if (idx === -1) {
      setCarved("");
      addLog("No matching marker found — carving returned no result");
      return;
    }
    // for demo: extract 200 characters after marker and convert to text where possible
    const start = Math.max(0, idx - 10);
    const excerpt = hexInput.slice(start, Math.min(hexInput.length, idx + 200));
    setCarved(excerpt);
    addLog("Carving succeeded — excerpt extracted");
  };

  const clearAll = () => {
    setSample("");
    setHash("");
    setExpectedHash("");
    setLogs([]);
    setCarved("");
    setTimeline([]);
    addLog("Simulator reset");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">🕵️ Digital Forensics Lab — Evidence Handling</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Evidence Sample (paste text)</label>
          <textarea
            rows={6}
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            placeholder="Paste a sample file content here (for demo)."
            className="w-full mt-2 p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-mono text-gray-800 dark:text-gray-100"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={handleIngest} className="px-3 py-2 rounded bg-indigo-600 text-white">Ingest & Hash</button>
            <button onClick={() => { navigator.clipboard.writeText(hash || ""); addLog("Computed hash copied to clipboard"); }} className="px-3 py-2 rounded bg-gray-100">Copy Hash</button>
            <button onClick={clearAll} className="px-3 py-2 rounded bg-red-100 text-red-700">Reset</button>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Computed SHA-256</div>
          <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 font-mono text-xs break-words">{hash || "No hash yet"}</div>

          <div className="mt-3">
            <label className="text-sm text-gray-700 dark:text-gray-300">Expected Hash (for verification)</label>
            <input value={expectedHash} onChange={(e) => setExpectedHash(e.target.value)} placeholder="paste expected SHA-256 here" className="w-full mt-2 p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-mono" />
            <div className="flex gap-2 mt-2">
              <button onClick={handleVerify} className="px-3 py-2 rounded bg-green-600 text-white">Verify Hash</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Timeline Builder</h4>
        <div className="flex gap-2">
          <input id="evt" placeholder="e.g., File created /etc/passwd" className="flex-1 p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          <button onClick={() => { const val = document.getElementById("evt").value; if (val) { addTimelineEvent(val); document.getElementById("evt").value = ""; } }} className="px-3 py-2 rounded bg-indigo-50 text-indigo-700">Add</button>
        </div>

        <div className="mt-3 space-y-1 text-xs font-mono text-gray-600 dark:text-gray-300 h-28 overflow-auto p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          {timeline.length === 0 ? <div className="text-gray-400">No timeline events yet</div> : timeline.map((t, i) => <div key={i}>[{new Date(t.ts).toLocaleString()}] — {t.evt}</div>)}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">File Carving (hex sample)</h4>
        <textarea id="hexInput" rows={4} placeholder="Paste sample hex or long text here (demo)..." className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono" />
        <div className="flex gap-2 mt-2">
          <input id="marker" placeholder="Marker (e.g., 504B0304 or text snippet)" className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
          <button onClick={() => { const hex = document.getElementById("hexInput").value.trim(); const marker = document.getElementById("marker").value.trim(); handleCarve(hex, marker); }} className="px-3 py-2 rounded bg-yellow-100 text-yellow-700">Carve</button>
        </div>
        <div className="mt-2 text-xs font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 h-20 overflow-auto">{carved || "No carved output"}</div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 h-40 overflow-auto font-mono text-xs">
          <div className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Live Lab Log</div>
          {logs.length === 0 ? <div className="text-gray-400 italic">No activity yet</div> : logs.map((l, i) => <div key={i} className="text-gray-700 dark:text-gray-300">{l}</div>)}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm">
          <div className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Forensics Tips</div>
          <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
            <li>• Always preserve original evidence (make bit-for-bit copies).</li>
            <li>• Use hashing (SHA-256) to prove evidence integrity.</li>
            <li>• Maintain a chain-of-custody log with timestamps and handlers.</li>
            <li>• Work on copies; never alter original media.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
