// /src/components/simulations/ccna/AutomationSimulator.jsx
import React, { useState, useEffect, useRef } from "react";

/**
 * AutomationSimulator.jsx
 * CCNA Lesson 15 — Network Automation & Monitoring
 *
 * Full-feature version includes:
 * - Inventory Manager
 * - Template Engine (Jinja-like)
 * - Config Generator
 * - Device-by-device preview
 * - Telemetry polling (simulated SNMP/NetFlow)
 * - Automation Engine (Simulated Ansible/Python automation)
 * - Logging + Animations
 * - Import/Export Inventory/Templates
 */

const DEFAULT_INVENTORY = [
  {
    id: "R1",
    hostname: "Router-1",
    mgmtIp: "10.0.0.11",
    os: "IOS",
    role: "core",
    cpu: 12,
    mem: 38,
    interfaces: [
      { name: "Gig0/0", ip: "10.1.1.1/24", traffic: 2.1 },
      { name: "Gig0/1", ip: "172.16.0.1/24", traffic: 7.4 },
    ],
  },
  {
    id: "SW1",
    hostname: "Switch-1",
    mgmtIp: "10.0.0.21",
    os: "IOS",
    role: "access",
    cpu: 24,
    mem: 18,
    interfaces: [
      { name: "Gig1/0/1", ip: "N/A", traffic: 0.4 },
      { name: "Gig1/0/2", ip: "N/A", traffic: 3.1 },
    ],
  },
];

const DEFAULT_TEMPLATE = `
hostname {{ hostname }}
!
interface Loopback0
 ip address {{ mgmtIp }} 255.255.255.255
!
{% if role == "core" %}
router ospf 10
 network 10.0.0.0 0.0.255.255 area 0
{% endif %}
!
line vty 0 4
 login local
 transport input ssh
`;

const DEFAULT_AUTOMATION_SCRIPT = `# pseudo-python automation script
for device in inventory:
    push_config(device.mgmtIp, generated_configs[device.id])
    print("✔ Applied config to", device.hostname)
`;

const TELEMETRY_INTERVAL_MS = 2500;
export default function AutomationSimulator() {
  // ================================
  // Global State
  // ================================
  const [inventory, setInventory] = useState(DEFAULT_INVENTORY);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [automationScript, setAutomationScript] = useState(DEFAULT_AUTOMATION_SCRIPT);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [logs, setLogs] = useState(["Automation Simulator ready — load inventory or start generating configs."]);
  const [generatedConfigs, setGeneratedConfigs] = useState({});
  const [runAnimation, setRunAnimation] = useState([]);

  // telemetry
  const [telemetryData, setTelemetryData] = useState({});
  const telemetryTimer = useRef(null);

  // ================================
  // Logging helper
  // ================================
  function pushLog(msg) {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-250), `${timestamp} — ${msg}`]);
  }

  // ================================
  // Start/Stop Telemetry
  // ================================
  useEffect(() => {
    // initialize blank telemetry map
    const t = {};
    inventory.forEach((d) => {
      t[d.id] = {
        cpu: d.cpu,
        mem: d.mem,
        interfaces: d.interfaces.map((i) => ({
          name: i.name,
          traffic: i.traffic,
        })),
      };
    });
    setTelemetryData(t);
  }, [inventory]);

  function startTelemetry() {
    if (telemetryTimer.current) return;
    pushLog("Telemetry polling started.");

    telemetryTimer.current = setInterval(() => {
      setTelemetryData((prev) => {
        const updated = {};
        Object.entries(prev).forEach(([id, dev]) => {
          updated[id] = {
            cpu: Math.min(99, Math.max(1, dev.cpu + (Math.random() * 10 - 5))),
            mem: Math.min(99, Math.max(1, dev.mem + (Math.random() * 6 - 3))),
            interfaces: dev.interfaces.map((i) => ({
              name: i.name,
              traffic: Math.max(0, i.traffic + (Math.random() * 6 - 2)),
            })),
          };
        });
        return updated;
      });
    }, TELEMETRY_INTERVAL_MS);
  }

  function stopTelemetry() {
    if (telemetryTimer.current) {
      clearInterval(telemetryTimer.current);
      telemetryTimer.current = null;
      pushLog("Telemetry polling stopped.");
    }
  }

  // ======================================
  // Animation helper for simulated config push
  // ======================================
  const animId = useRef(1);

  function createRunAnimation(deviceId) {
    const id = animId.current++;
    const marker = { id, deviceId, t: 0 };
    setRunAnimation((a) => [...a, marker]);

    const start = performance.now();
    const duration = 900;

    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      setRunAnimation((a) =>
        a.map((x) => (x.id === id ? { ...x, t: p } : x))
      );

      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        // remove when complete
        setRunAnimation((a) => a.filter((x) => x.id !== id));
      }
    }

    requestAnimationFrame(frame);
  }

  // ======================================
  // JSON Import/Export Helpers
  // ======================================
  function exportInventory() {
    const blob = new Blob([JSON.stringify(inventory, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.json";
    a.click();
    URL.revokeObjectURL(url);
    pushLog("Exported inventory file.");
  }

  function importInventoryFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const obj = JSON.parse(ev.target.result);
        if (Array.isArray(obj)) {
          setInventory(obj);
          pushLog("Inventory imported.");
        } else {
          pushLog("Invalid inventory format.");
        }
      } catch {
        pushLog("Failed to parse imported file.");
      }
    };
    reader.readAsText(file);
  }
  // ======================================
  // Inventory Manager Functions
  // ======================================

  function addDevice() {
    const id = `D${inventory.length + 1}`;
    const newDev = {
      id,
      hostname: `Device-${inventory.length + 1}`,
      mgmtIp: `10.0.0.${50 + inventory.length}`,
      os: "IOS",
      role: "access",
      cpu: Math.floor(Math.random() * 40) + 5,
      mem: Math.floor(Math.random() * 50) + 5,
      interfaces: [
        { name: "Gig0/0", ip: "N/A", traffic: Math.random() * 5 },
        { name: "Gig0/1", ip: "N/A", traffic: Math.random() * 5 },
      ],
    };

    setInventory((inv) => [...inv, newDev]);
    pushLog(`Added new device ${id}`);
  }

  function removeDevice(id) {
    setInventory((inv) => inv.filter((d) => d.id !== id));
    pushLog(`Removed device ${id}`);
    if (selectedDevice === id) setSelectedDevice(null);
  }

  function updateDeviceField(id, field, value) {
    setInventory((inv) =>
      inv.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }

  function updateInterfaceField(deviceId, idx, field, value) {
    setInventory((inv) =>
      inv.map((d) => {
        if (d.id !== deviceId) return d;
        const newIfs = [...d.interfaces];
        newIfs[idx] = { ...newIfs[idx], [field]: value };
        return { ...d, interfaces: newIfs };
      })
    );
  }

  function addInterface(deviceId) {
    setInventory((inv) =>
      inv.map((d) => {
        if (d.id !== deviceId) return d;
        return {
          ...d,
          interfaces: [
            ...d.interfaces,
            {
              name: `Gig${d.interfaces.length}/0`,
              ip: "N/A",
              traffic: 0,
            },
          ],
        };
      })
    );
    pushLog(`Added interface to ${deviceId}`);
  }

  function removeInterface(deviceId, idx) {
    setInventory((inv) =>
      inv.map((d) => {
        if (d.id !== deviceId) return d;
        const newIfs = d.interfaces.filter((_, i) => i !== idx);
        return { ...d, interfaces: newIfs };
      })
    );
    pushLog(`Removed interface ${idx} from ${deviceId}`);
  }

  // ======================================
  // Inventory Sorting Helpers
  // ======================================
  function sortInventoryBy(field) {
    setInventory((inv) =>
      [...inv].sort((a, b) => {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
      })
    );
  }

  function resetInventory() {
    setInventory(DEFAULT_INVENTORY);
    pushLog("Inventory reset to defaults.");
  }
  // ======================================
  // Template Engine (Jinja-like)
  // ======================================

  /**
   * Renders simple Jinja-like templates:
   *  - {{ variable }}
   *  - {% if field == "value" %} ... {% endif %}
   *  - {% for intf in interfaces %} ... {% endfor %}
   */
  function renderTemplate(tpl, device) {
    try {
      let out = tpl;

      // ----------------------------
      // 1) Handle {{ variables }}
      // ----------------------------
      out = out.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
        return device[key] !== undefined ? String(device[key]) : "";
      });

      // ----------------------------
      // 2) Handle {% if ... %}
      // Example: {% if role == "core" %} ... {% endif %}
      // ----------------------------
      out = out.replace(
        /{%\s*if\s+([^%]+)\s*%}([\s\S]*?){%\s*endif\s*%}/g,
        (_, condition, body) => {
          try {
            // Build evaluation context
            const ctx = { ...device };
            const fn = new Function(
              ...Object.keys(ctx),
              `return (${condition});`
            );
            const result = fn(...Object.values(ctx));
            return result ? body : "";
          } catch {
            return "";
          }
        }
      );

      // ----------------------------
      // 3) Handle {% for x in list %}
      // Example:
      // {% for i in interfaces %}
      //   interface {{ i.name }}
      // {% endfor %}
      // ----------------------------
      out = out.replace(
        /{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%}([\s\S]*?){%\s*endfor\s*%}/g,
        (_, varName, listName, loopBody) => {
          const list = device[listName];
          if (!Array.isArray(list)) return "";
          let rendered = "";
          for (const item of list) {
            let seg = loopBody;
            // Replace {{ varName.xyz }} inside loop
            seg = seg.replace(
              new RegExp(`{{\\s*${varName}\\.([^}]+)\\s*}}`, "g"),
              (_, key) => (item[key] !== undefined ? item[key] : "")
            );
            rendered += seg;
          }
          return rendered;
        }
      );

      return out;
    } catch (err) {
      pushLog("Template rendering error: " + err.message);
      return "";
    }
  }

  // Render for all devices
  function generateConfigsForInventory(inv, tpl) {
    const result = {};
    inv.forEach((dev) => {
      result[dev.id] = renderTemplate(tpl, dev);
    });
    return result;
  }

  function generateConfigs() {
    const cfgs = generateConfigsForInventory(inventory, template);
    setGeneratedConfigs(cfgs);
    pushLog("Generated configurations for all devices.");
    return cfgs;
  }
  // ======================================
  // Config Generation Helpers
  // ======================================

  function downloadConfig(deviceId) {
    if (!generatedConfigs[deviceId]) {
      pushLog(`No config generated for ${deviceId}`);
      return;
    }

    const blob = new Blob([generatedConfigs[deviceId]], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deviceId}-config.txt`;
    a.click();
    URL.revokeObjectURL(url);

    pushLog(`Downloaded config for ${deviceId}.`);
  }

  function downloadAllConfigs() {
    const cfgs = generatedConfigs;
    if (!cfgs || Object.keys(cfgs).length === 0) {
      pushLog("No configs to download.");
      return;
    }

    let allTxt = "";
    Object.entries(cfgs).forEach(([id, cfg]) => {
      allTxt += `=======================\n`;
      allTxt += ` Device ${id}\n`;
      allTxt += `=======================\n`;
      allTxt += cfg + "\n\n";
    });

    const blob = new Blob([allTxt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `all-device-configs.txt`;
    a.click();

    URL.revokeObjectURL(url);
    pushLog("Downloaded combined config file.");
  }

  function clearGeneratedConfigs() {
    setGeneratedConfigs({});
    pushLog("Cleared generated configuration set.");
  }

  function selectDeviceForPreview(id) {
    setSelectedDevice(id);
    pushLog(`Selected ${id} for preview.`);
  }
  // ======================================
  // Automation Engine (Simulated)
  // ======================================

  function runAutomation() {
    const cfgs = generatedConfigs;
    if (!cfgs || Object.keys(cfgs).length === 0) {
      pushLog("Generate configs before running automation.");
      return;
    }

    pushLog("🚀 Starting automation run…");

    const scriptLines = automationScript.split("\n");
    let index = 0;

    function step() {
      if (index >= scriptLines.length) {
        pushLog("✔ Automation completed.");
        return;
      }

      const line = scriptLines[index].trim();
      if (line.length > 0) pushLog("SCRIPT > " + line);

      // Match: push_config(device.mgmtIp, generated_configs[device.id])
      if (line.startsWith("push_config(")) {
        const matches = /push_config\(([^,]+),\s*([^)]+)\)/.exec(line);
        if (matches) {
          const mgmt = sanitizeParam(matches[1]);
          const cfgVar = sanitizeParam(matches[2]);
          const dev = inventory.find((d) => d.mgmtIp === mgmt);

          if (dev) {
            simulateConfigPush(dev);
          }
        }
      }

      index++;
      setTimeout(step, 500);
    }

    step();
  }

  function sanitizeParam(param) {
    return param.replace(/['"]/g, "").trim();
  }

  // Run actual animation + log for device config push
  function simulateConfigPush(device) {
    pushLog(`⏳ Applying config to ${device.hostname} (${device.mgmtIp})…`);
    createRunAnimation(device.id);

    // Simulate random failure chance
    const failureChance = Math.random();
    setTimeout(() => {
      if (failureChance < 0.1) {
        pushLog(`❌ Failed to reach ${device.hostname}, retrying…`);
        setTimeout(() => {
          pushLog(`✔ Retry successful: ${device.hostname} updated.`);
        }, 600);
      } else {
        pushLog(`✔ Successfully pushed config to ${device.hostname}.`);
      }
    }, 600);
  }

  // Reset automation state
  function resetAutomation() {
    setRunAnimation([]);
    pushLog("Automation state reset.");
  }
  // ======================================
  // Telemetry & Monitoring View Helpers
  // ======================================

  function getCpuColor(v) {
    if (v < 40) return "text-green-500";
    if (v < 70) return "text-yellow-500";
    return "text-red-500";
  }

  function getMemColor(v) {
    if (v < 40) return "text-green-500";
    if (v < 70) return "text-yellow-500";
    return "text-red-500";
  }

  function getTrafficColor(v) {
    if (v < 5) return "text-green-500";
    if (v < 15) return "text-yellow-500";
    return "text-red-500";
  }

  // NetFlow sampler (fake)
  function generateNetFlowEntries(deviceId) {
    const flows = [];
    for (let i = 0; i < 4; i++) {
      flows.push({
        src: `10.0.${Math.floor(Math.random() * 80)}.${Math.floor(Math.random() * 200)}`,
        dst: `172.16.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 200)}`,
        bytes: Math.floor(Math.random() * 50000) + 200,
        proto: ["TCP", "UDP", "ICMP"][Math.floor(Math.random() * 3)],
      });
    }
    return flows;
  }

  function renderTelemetryPanel(deviceId) {
    if (!telemetryData[deviceId]) return null;
    const t = telemetryData[deviceId];

    return (
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700 text-xs mt-2">
        <div className="font-semibold mb-1 text-gray-700 dark:text-gray-200">
          Live Telemetry — {deviceId}
        </div>

        {/* CPU & Memory */}
        <div className="flex gap-4 mb-3">
          <div>
            <div className="text-gray-600 dark:text-gray-300">CPU</div>
            <div className={`text-lg font-bold ${getCpuColor(t.cpu)}`}>{t.cpu.toFixed(1)}%</div>
          </div>

          <div>
            <div className="text-gray-600 dark:text-gray-300">Memory</div>
            <div className={`text-lg font-bold ${getMemColor(t.mem)}`}>{t.mem.toFixed(1)}%</div>
          </div>
        </div>

        {/* Interfaces */}
        <div className="mb-3">
          <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
            Interfaces
          </div>
          {t.interfaces.map((itf, idx) => (
            <div key={idx} className="flex justify-between mb-1">
              <div>{itf.name}</div>
              <div className={getTrafficColor(itf.traffic)}>
                {itf.traffic.toFixed(1)} Mbps
              </div>
            </div>
          ))}
        </div>

        {/* NetFlow Sample */}
        <div className="mt-2">
          <div className="font-medium text-gray-700 dark:text-gray-300">NetFlow Samples</div>
          <div className="bg-black text-green-300 p-2 mt-1 rounded h-24 overflow-auto font-mono">
            {generateNetFlowEntries(deviceId).map((f, i) => (
              <div key={i}>
                {f.src} → {f.dst} | {f.proto} | {f.bytes} bytes
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // ======================================
  // MAIN JSX RENDERING
  // ======================================
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 shadow-md">

      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
        🤖 Network Automation & Monitoring Simulator
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ----------------------------- */}
        {/* LEFT SIDEBAR — INVENTORY */}
        {/* ----------------------------- */}
        <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 max-h-[800px] overflow-auto">
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            DEVICE INVENTORY
          </div>

          <button
            onClick={addDevice}
            className="px-3 py-1 bg-green-600 text-white rounded text-xs mb-2"
          >
            ➕ Add Device
          </button>

          <button
            onClick={resetInventory}
            className="px-3 py-1 bg-gray-300 rounded text-xs mb-2 ml-2"
          >
            Reset
          </button>

          <button
            onClick={exportInventory}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-xs mb-2 ml-2"
          >
            Export
          </button>

          <label className="px-3 py-1 bg-gray-200 rounded text-xs ml-2 cursor-pointer">
            Import
            <input type="file" accept="application/json" onChange={importInventoryFile} className="hidden" />
          </label>

          {/* Inventory List */}
          <div className="mt-3 space-y-2">
            {inventory.map((dev) => (
              <div
                key={dev.id}
                className={`p-2 rounded border cursor-pointer ${
                  selectedDevice === dev.id ? "bg-indigo-100 dark:bg-indigo-900" : "bg-white dark:bg-gray-900"
                }`}
                onClick={() => selectDeviceForPreview(dev.id)}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-sm">{dev.hostname}</div>
                    <div className="text-xs text-gray-500">{dev.mgmtIp}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDevice(dev.id);
                    }}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs"
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ----------------------------- */}
        {/* CENTER PANEL — TEMPLATES & PREVIEW */}
        {/* ----------------------------- */}
        <div className="border rounded-lg p-3 col-span-2 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CONFIG TEMPLATE
          </div>

          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full p-2 h-40 rounded border bg-white dark:bg-gray-900 text-sm"
          />

          <button
            onClick={generateConfigs}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md mt-3"
          >
            ⚙️ Generate Configs
          </button>

          <button
            onClick={clearGeneratedConfigs}
            className="px-3 py-2 bg-gray-300 rounded-md mt-3 ml-2"
          >
            Clear
          </button>

          {/* CONFIG PREVIEW */}
          {selectedDevice && (
            <div className="mt-5">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CONFIG PREVIEW — {selectedDevice}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadConfig(selectedDevice)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                >
                  Download
                </button>

                <span className="text-xs text-gray-600 mt-2">
                  {previewConfigLinesCount(previewConfig(selectedDevice))} lines
                </span>
              </div>

              <pre className="bg-black text-green-300 p-3 h-64 overflow-auto rounded mt-2 text-xs">
                {previewConfig(selectedDevice)}
              </pre>

              {/* Telemetry */}
              {renderTelemetryPanel(selectedDevice)}
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------- */}
      {/* BOTTOM SECTION — AUTOMATION + LOGS */}
      {/* ----------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">

        {/* Automation Script */}
        <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            AUTOMATION SCRIPT (Simulated Python)
          </div>

          <textarea
            value={automationScript}
            onChange={(e) => setAutomationScript(e.target.value)}
            className="w-full p-2 h-40 rounded border bg-white dark:bg-gray-900 text-xs"
          />

          <button
            onClick={runAutomation}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md mt-3"
          >
            ▶ Run Automation
          </button>

          <button
            onClick={resetAutomation}
            className="px-3 py-2 bg-gray-300 rounded-md mt-3 ml-2"
          >
            Reset
          </button>

          <button
            onClick={downloadAllConfigs}
            className="px-3 py-2 bg-green-600 text-white rounded-md mt-3 ml-2"
          >
            Download All Configs
          </button>
        </div>

        {/* Logs */}
        <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SIMULATION LOG
          </div>

          <div className="bg-black text-green-300 p-3 h-64 overflow-auto rounded font-mono text-xs">
            {logs.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------------------------- */}
      {/* RUN ANIMATION — PACKET DOT */}
      {/* ----------------------------------- */}
      <svg width="100%" height="0">
        {runAnimation.map((a) => {
          const devIdx = inventory.findIndex((d) => d.id === a.deviceId);
          if (devIdx < 0) return null;

          // Basic animation left → right
          const x = 100 + a.t * 300;
          const y = 120 + devIdx * 30;

          return (
            <circle key={a.id} cx={x} cy={y} r={6} fill="#3B82F6" />
          );
        })}
      </svg>
    </div>
  );

  /* --------------------------
     Local helper functions used inside JSX but defined below
     ---------------------------*/

  function previewConfig(deviceId) {
    if (!deviceId) return "";
    const cfgs = generateConfigsForInventory(inventory, template);
    return cfgs[deviceId] || "(error rendering)";
  }

  function previewConfigLinesCount(cfg) {
    if (!cfg) return 0;
    return cfg.split("\n").length;
  }
}
