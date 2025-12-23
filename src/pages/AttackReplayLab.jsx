/* -------------------------------------------------------
   AttackReplayLab.jsx — DigitalFort Attack Replay Lab
   Phase 2: Visual + Narrative Replay Engine
   Timeline • Speed Control • POV Toggle
   No backend | No globe dependency (yet)
--------------------------------------------------------*/
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GlobeSimulator from "../components/simulations/GlobeSimulator";


const ATTACK_STEPS = [
    {
        id: 1,
        title: "Reconnaissance",
        subtitle: "Scanning & Enumeration",
        description:
            "The attacker begins scanning public-facing infrastructure to identify open ports, exposed services, and vulnerable endpoints.",
        attackerView:
            "Automated scanners probe IP ranges, collecting banners and service fingerprints.",
        defenderView:
            "Increased scan-rate detected from foreign ASNs. Low confidence alert raised.",
        color: "text-yellow-300",
    },
    {
        id: 2,
        title: "Initial Access",
        subtitle: "Credential Stuffing / Exploit",
        description:
            "Using leaked credentials and automated tools, the attacker attempts login abuse against exposed authentication services.",
        attackerView:
            "Credential lists tested against VPN and admin portals using automation.",
        defenderView:
            "Authentication failures spike beyond baseline. Risk score increases.",
        color: "text-orange-300",
    },
    {
        id: 3,
        title: "Payload Delivery",
        subtitle: "Malicious Code Execution",
        description:
            "A malicious payload is delivered and executed, establishing persistence within the compromised system.",
        attackerView:
            "Payload beacon successfully executed. Persistence hook installed.",
        defenderView:
            "Endpoint behavior deviates from normal execution profile.",
        color: "text-red-400",
    },
    {
        id: 4,
        title: "Lateral Movement",
        subtitle: "Internal Network Expansion",
        description:
            "The attacker moves laterally, probing internal systems to expand access and elevate privileges.",
        attackerView:
            "SMB and RDP enumeration across internal subnets.",
        defenderView:
            "East-west traffic anomaly detected. Correlation begins.",
        color: "text-red-500",
    },
    {
        id: 5,
        title: "Detection by DigitalFort",
        subtitle: "Behavioral Anomaly Identified",
        description:
            "DigitalFort detects abnormal behavior patterns and correlates signals across multiple attack vectors.",
        attackerView:
            "Command execution latency increases. Some channels blocked.",
        defenderView:
            "Multi-signal correlation confirms active intrusion.",
        color: "text-cyan-300",
    },
    {
        id: 6,
        title: "Isolation",
        subtitle: "Threat Containment",
        description:
            "Compromised endpoints and IP ranges are isolated to prevent further spread of the attack.",
        attackerView:
            "Connections reset. Lateral movement blocked.",
        defenderView:
            "Endpoints isolated. Network segmentation enforced.",
        color: "text-cyan-400",
    },
    {
        id: 7,
        title: "Mitigation",
        subtitle: "Attack Neutralization",
        description:
            "Security policies, patches, and countermeasures are deployed to fully neutralize the threat.",
        attackerView:
            "Access lost. Payload neutralized.",
        defenderView:
            "Threat fully neutralized. Systems stabilized.",
        color: "text-green-400",
    },
    {
        id: 8,
        title: "Intelligence Stored",
        subtitle: "Threat Knowledge Retained",
        description:
            "Attack patterns and indicators are stored in DigitalFort’s intelligence engine for future prevention.",
        attackerView:
            "Campaign fingerprint now burned.",
        defenderView:
            "Indicators stored. Models scheduled for retraining.",
        color: "text-green-500",
    },
];

const GEO_MAP = {
    0: { startLat: 40.7, startLng: -74, endLat: 28.6, endLng: 77.2, color: "yellow" },
    1: { startLat: 35.8, startLng: 104.1, endLat: 28.6, endLng: 77.2, color: "orange" },
    2: { startLat: 55.7, startLng: 37.6, endLat: 28.6, endLng: 77.2, color: "red" },
    3: { startLat: 52.5, startLng: 13.4, endLat: 28.6, endLng: 77.2, color: "red" },
};

/* ======================================================
   🧠 PHASE E — MITRE ATT&CK STATIC MAP (ADD)
====================================================== */
const MITRE_MAP = {
    1: {
        tactic: "Reconnaissance",
        techniques: [
            { id: "T1595", name: "Active Scanning" }
        ]
    },
    2: {
        tactic: "Initial Access",
        techniques: [
            { id: "T1078", name: "Valid Accounts" },
            { id: "T1110", name: "Brute Force" }
        ]
    },
    3: {
        tactic: "Execution",
        techniques: [
            { id: "T1059", name: "Command and Scripting Interpreter" }
        ]
    },
    4: {
        tactic: "Lateral Movement",
        techniques: [
            { id: "T1021", name: "Remote Services" }
        ]
    },
    5: {
        tactic: "Detection",
        techniques: [
            { id: "Defensive", name: "Behavioral Correlation" }
        ]
    },
    6: {
        tactic: "Containment",
        techniques: [
            { id: "Response", name: "Network Isolation" }
        ]
    },
    7: {
        tactic: "Mitigation",
        techniques: [
            { id: "Response", name: "Threat Neutralization" }
        ]
    },
    8: {
        tactic: "Impact",
        techniques: [
            { id: "T1485", name: "Data Destruction (Prevented)" }
        ]
    }
};

/* --------------------------------------------------
   🧠 Phase C2 — AI Markdown Section Parser (ADD)
-------------------------------------------------- */
function parseAISections(text = "") {
    const sections = {};
    let current = null;

    text.split("\n").forEach((line) => {
        const h = line.match(/^[-*]?\s*(What|Why|Detection|Likely|Recommended)/i);
        if (h) {
            current = h[0].replace(/[:*-]/g, "").trim();
            sections[current] = [];
        } else if (current && line.trim()) {
            sections[current].push(line.replace(/^[-*]\s*/, ""));
        }
    });

    return sections;
}

/* ======================================================
   🧠 PHASE C3 — AI INSIGHT NORMALIZER (ADD)
   Guarantees structured SOC-style output
====================================================== */
function normalizeAIInsight(raw = "") {
    const buckets = {
        "Attacker Activity": [],
        "Security Risk": [],
        "DigitalFort Detection": [],
        "MITRE / Techniques": [],
        "Recommended Actions": [],
    };

    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

    let current = null;

    lines.forEach(line => {
        const lower = line.toLowerCase();

        if (lower.includes("attacker")) current = "Attacker Activity";
        else if (lower.includes("risk")) current = "Security Risk";
        else if (lower.includes("detect")) current = "DigitalFort Detection";
        else if (lower.includes("mitre") || lower.includes("t1")) current = "MITRE / Techniques";
        else if (lower.includes("recommend") || lower.includes("action")) current = "Recommended Actions";

        if (current) {
            buckets[current].push(
                line.replace(/^[-*#]+\s*/, "")
            );
        }
    });

    // Fallback: dump everything into Attacker Activity
    if (Object.values(buckets).every(v => v.length === 0)) {
        buckets["Attacker Activity"].push(raw);
    }

    return buckets;
}

/* ======================================================
   🧠 PHASE D — THREAT SCORING ENGINE (ADD)
   Deterministic SOC-style assessment per replay step
====================================================== */
function computeThreatAssessment(stepId) {
    if (stepId <= 2) {
        return {
            severity: 3.5,
            confidence: 45,
            posture: "Monitoring",
            verdict: "Reconnaissance activity observed"
        };
    }

    if (stepId === 3) {
        return {
            severity: 6.5,
            confidence: 70,
            posture: "Elevated",
            verdict: "Malicious payload execution detected"
        };
    }

    if (stepId === 4) {
        return {
            severity: 8.5,
            confidence: 88,
            posture: "Critical",
            verdict: "Lateral movement in progress"
        };
    }

    if (stepId === 5) {
        return {
            severity: 9.2,
            confidence: 95,
            posture: "Critical",
            verdict: "Confirmed active intrusion"
        };
    }

    if (stepId === 6) {
        return {
            severity: 7.0,
            confidence: 92,
            posture: "Contained",
            verdict: "Threat containment initiated"
        };
    }

    return {
        severity: 2.0,
        confidence: 98,
        posture: "Monitoring",
        verdict: "Threat neutralized and logged"
    };
}


export default function AttackReplayLab() {
    const [currentStep, setCurrentStep] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [view, setView] = useState("defender");
    const [aiInsight, setAiInsight] = useState("AI analysis pending…");
    const [aiLoading, setAiLoading] = useState(false);
    const [threat, setThreat] = useState(null);



    // 🔒 Remember last geo position for non-geo steps
    const lastGeoRef = useRef(null);

    // Auto-play logic with speed control
    useEffect(() => {
        if (!playing) return;

        const timer = setTimeout(() => {
            setCurrentStep((prev) => {
                if (prev < ATTACK_STEPS.length - 1) return prev + 1;
                setPlaying(false);
                return prev;
            });
        }, 3000 / speed);

        return () => clearTimeout(timer);
    }, [playing, currentStep, speed]);

    const step = ATTACK_STEPS[currentStep];
    // const aiSections = parseAISections(aiInsight);
    const normalizedInsight = normalizeAIInsight(aiInsight);
    const mitre = MITRE_MAP[step.id];

    useEffect(() => {
        setThreat(computeThreatAssessment(step.id));
    }, [currentStep]);


    // — Fetch AI insight per replay step
    useEffect(() => {
        let cancelled = false;

        async function fetchAIInsight() {
            try {
                setAiLoading(true);

                const res = await fetch("/.netlify/functions/ask-ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mode: "attack_replay",
                        attackContext: {
                            stepId: step.id,
                            title: step.title,
                            subtitle: step.subtitle,
                            attackerView: step.attackerView,
                            defenderView: step.defenderView,
                        },
                    }),
                });

                const data = await res.json();
                const content = data?.choices?.[0]?.message?.content;

                if (!cancelled) {
                    setAiInsight(content || "No AI insight available for this phase.");
                }
            } catch (err) {
                if (!cancelled) {
                    setAiInsight("AI engine unavailable.");
                }
            } finally {
                if (!cancelled) setAiLoading(false);
            }
        }

        fetchAIInsight();
        return () => {
            cancelled = true;
        };
    }, [currentStep]);


    useEffect(() => {
        const globe = window.__DIGITALFORT_GLOBE__;
        if (!globe) return;

        globe.pauseLive?.();

        if (currentStep === 0) lastGeoRef.current = null;

        if (currentStep >= 4) globe.pause();
        else globe.resume();

        globe.clearReplayAnnotations?.();

        if (GEO_MAP[currentStep]) {
            const geo = GEO_MAP[currentStep];
            lastGeoRef.current = geo;

            globe.highlightAttack(geo);

            globe.showReplayAnnotation?.({
                lat: geo.endLat,
                lng: geo.endLng,
                label: step.title,
                color: geo.color,
            });
        } else if (lastGeoRef.current) {
            if (currentStep >= 6) {
                globe.resolveAttack?.(lastGeoRef.current);
            }

            globe.showReplayAnnotation?.({
                lat: lastGeoRef.current.endLat,
                lng: lastGeoRef.current.endLng,
                label: step.title,
                color: step.color.includes("green")
                    ? "green"
                    : step.color.includes("cyan")
                        ? "cyan"
                        : "yellow",
            });
        }

        return () => {
            globe.resumeLive?.();
        };
    }, [currentStep]);

    useEffect(() => {
        window.__DIGITALFORT_REPLAY__ = true;
        return () => {
            window.__DIGITALFORT_REPLAY__ = false;
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-10 relative">

            {/* REPLAY STEP LEGEND */}
            <div className="fixed top-6 left-6 z-40 bg-black/80 border border-slate-700 rounded-xl px-5 py-4">
                <div className="text-xs text-gray-400 mb-1">
                    Step {step.id} / {ATTACK_STEPS.length}
                </div>
                <div className={`font-bold ${step.color}`}>
                    {step.title}
                </div>
                <div className="text-sm text-gray-400">
                    {step.subtitle}
                </div>
            </div>

            {/* HEADER */}
            <h1 className="text-4xl font-bold text-cyan-300 mb-2">
                🔁 Attack Replay Lab
            </h1>
            <p className="max-w-3xl text-gray-300 mb-8">
                Replay real-world cyberattack scenarios step-by-step. Observe both
                attacker behavior and DigitalFort’s defensive response.
            </p>
            {/* PRODUCT OVERVIEW */}
            <div className="max-w-6xl mb-12 space-y-10 text-gray-300 leading-relaxed">

                <div>
                    <h2 className="text-2xl font-bold text-cyan-300 mb-3">
                        See Cyberattacks the Way a Real SOC Sees Them
                    </h2>

                    <p className="mb-3">
                        <span className="text-cyan-300 font-semibold">Attack Replay Lab</span> is an
                        interactive cyber-defense simulation that lets you replay real-world
                        cyberattacks step-by-step, exactly as they unfold inside a modern
                        Security Operations Center (SOC).
                    </p>

                    <p className="mb-3">
                        Instead of reading theory, you observe attacker behavior, defensive
                        detection, risk scoring, and response decisions in real time — all
                        visualized across a global threat map.
                    </p>

                    <p>
                        This is how cyber incidents are actually analyzed, detected, and
                        neutralized in the real world.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                        🧠 What You Experience Inside the Lab
                    </h3>

                    <p className="mb-3">
                        Attack Replay Lab walks you through the full cyber kill chain, from the
                        first scan to final mitigation:
                    </p>

                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><span className="text-yellow-300">Reconnaissance</span> — attackers scan exposed systems</li>
                        <li><span className="text-orange-300">Initial Access</span> — credentials or exploits are abused</li>
                        <li><span className="text-red-400">Payload Delivery</span> — malicious code executes</li>
                        <li><span className="text-red-500">Lateral Movement</span> — attackers spread internally</li>
                        <li><span className="text-cyan-300">Detection</span> — DigitalFort identifies anomalies</li>
                        <li><span className="text-cyan-400">Isolation & Mitigation</span> — threats are contained</li>
                        <li><span className="text-green-400">Intelligence Stored</span> — knowledge retained for the future</li>
                    </ul>

                    <p className="mt-4">
                        Each phase is explained from both perspectives:
                    </p>

                    <ul className="list-disc list-inside ml-2 mt-2">
                        <li>🟥 Attacker actions</li>
                        <li>🟦 Defender (SOC) response</li>
                    </ul>

                    <p className="mt-3">
                        You don’t just see what happened — you understand <em>why</em> it happened.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                        🌍 Global Threat Visualization
                    </h3>

                    <p className="mb-3">
                        Every attack is visualized on a live 3D cyber globe, showing:
                    </p>

                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Attack origin and target locations</li>
                        <li>Active and resolved attack paths</li>
                        <li>Realistic global attack flows</li>
                    </ul>

                    <p className="mt-3">
                        This gives learners and professionals a true sense of scale, showing how
                        cyber threats operate across borders in real time.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                        🧩 AI-Driven SOC Intelligence
                    </h3>

                    <p className="mb-3">
                        At every step, DigitalFort’s AI generates SOC-style intelligence reports,
                        including:
                    </p>

                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Attacker Activity Analysis</li>
                        <li>Security Risk Assessment</li>
                        <li>Detection Signals</li>
                        <li>MITRE ATT&CK Technique Mapping</li>
                        <li>Recommended Defensive Actions</li>
                    </ul>

                    <p className="mt-3">
                        This mirrors how real SOC analysts reason during live incidents.
                        <br />
                        <span className="text-cyan-300 font-semibold">
                            No generic explanations — only operational security intelligence.
                        </span>
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                        🛡️ SOC Verdict & Risk Scoring
                    </h3>

                    <p className="mb-3">
                        Each replay step produces a DigitalFort SOC Verdict, showing:
                    </p>

                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Threat Severity (0–10)</li>
                        <li>Confidence Level</li>
                        <li>Security Posture (Monitoring, Elevated, Critical, Contained)</li>
                        <li>Final Incident Verdict</li>
                    </ul>

                    <p className="mt-3">
                        Users learn how risk evolves, when alerts escalate, and when an incident
                        is officially closed.
                        <br />
                        <span className="text-cyan-300 font-semibold">
                            This is exactly how enterprise SOCs operate.
                        </span>
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                        🎯 Who Is This Lab For?
                    </h3>

                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Students & Learners — understand real cyberattacks, not just theory</li>
                        <li>Blue Team & SOC Analysts — sharpen detection and response thinking</li>
                        <li>Cloud & Security Engineers — see how infrastructure attacks unfold</li>
                        <li>Decision Makers — understand incident impact and response flow</li>
                    </ul>

                    <p className="mt-3">
                        Whether you’re learning cybersecurity or operating it — this lab speaks
                        your language.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                        🚀 Why Attack Replay Lab Is Different
                    </h3>

                    <p className="mb-2">Most platforms teach tools.</p>
                    <p className="mb-3 text-cyan-300 font-semibold">
                        Attack Replay Lab teaches thinking like a SOC.
                    </p>

                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Realistic attack flow</li>
                        <li>Defender-first perspective</li>
                        <li>Intelligence-driven analysis</li>
                        <li>Visual + narrative learning</li>
                        <li>Built for real-world readiness</li>
                    </ul>

                    <p className="mt-3 font-semibold">
                        This is not a demo.
                        <br />
                        <span className="text-cyan-300">
                            This is operational cyber defense training.
                        </span>
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                        🔮 What’s Coming Next
                    </h3>

                    <p className="mb-3">
                        Attack Replay Lab is built to evolve. Upcoming phases will integrate:
                    </p>

                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Real infrastructure telemetry</li>
                        <li>Cloud & OpenStack-based environments</li>
                        <li>Persistent threat intelligence storage</li>
                        <li>Advanced ML-based risk scoring</li>
                    </ul>

                    <p className="mt-3">
                        What you see today is the foundation of a full SOC intelligence platform.
                    </p>
                </div>

                <div className="pt-6 border-t border-slate-700 text-lg font-semibold text-cyan-300">
                    🔐 Learn. Observe. Think Like a Defender.
                    <p className="text-gray-300 text-base mt-2 font-normal">
                        Attack Replay Lab brings the reality of cyber defense into your hands —
                        one attack, one decision, one lesson at a time.
                    </p>
                </div>

            </div>


            {/* CONTROLS BAR */}
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={() => {
                        if (!playing && currentStep === ATTACK_STEPS.length - 1) {
                            setCurrentStep(0);      // 🔁 reset to Step 1
                            lastGeoRef.current = null;
                        }
                        setPlaying(!playing);
                    }}

                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-semibold"
                >
                    {playing ? "Pause" : "Play"}
                </button>

                <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2"
                >
                    <option value={1}>1× Speed</option>
                    <option value={2}>2× Speed</option>
                    <option value={4}>4× Speed</option>
                </select>

                <button
                    onClick={() =>
                        setView(view === "attacker" ? "defender" : "attacker")
                    }
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
                >
                    View: {view === "attacker" ? "Attacker POV" : "Defender POV"}
                </button>
            </div>
            {threat && (
                <div className="lg:col-span-6 mb-4 p-4 bg-slate-950 border border-slate-700 rounded-xl">
                    <div className="text-xs text-gray-400 mb-1">
                        DigitalFort SOC Verdict
                    </div>

                    <div className="text-lg font-bold text-cyan-300">
                        {threat.verdict}
                    </div>

                    <div className="flex gap-6 mt-2 text-sm text-gray-300">
                        <span>
                            Severity: <span className="text-white">{threat.severity}/10</span>
                        </span>
                        <span>
                            Confidence: <span className="text-white">{threat.confidence}%</span>
                        </span>
                        <span>
                            Posture: <span className="text-white">{threat.posture}</span>
                        </span>
                    </div>
                </div>
            )}

            {/* 🛡️ DEFENSE DECISION PANEL — PHASE F */}
            {threat && threat.severity >= 6 && (
                <div className="mb-6 p-5 bg-black border border-cyan-700 rounded-xl max-w-7xl">

                    <div className="text-xs text-gray-400 mb-1">
                        SOC Decision Required
                    </div>

                    <div className="text-lg font-semibold text-cyan-300 mb-3">
                        Choose a Defensive Action
                    </div>

                    <p className="text-sm text-gray-300 mb-4">
                        Based on current threat severity and confidence, select how the SOC
                        should respond. This mirrors real-world incident response decisions.
                    </p>

                    <div className="flex flex-wrap gap-4">

                        <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm">
                            Monitor Closely
                        </button>

                        <button className="px-5 py-2 bg-yellow-600/80 hover:bg-yellow-600 text-black rounded-lg text-sm font-semibold">
                            Isolate Affected Assets
                        </button>

                        <button className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold">
                            Block & Neutralize
                        </button>

                        <button className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-black rounded-lg text-sm font-semibold">
                            Escalate to Incident Response
                        </button>

                    </div>

                    <div className="mt-3 text-[11px] text-gray-500">
                        Decisions are simulated in demo mode. In future phases, these actions
                        will trigger real infrastructure and AI workflows.
                    </div>

                </div>
            )}


            {mitre && (
                <div className="mb-8 p-4 bg-black border border-slate-700 rounded-xl max-w-7xl">
                    <div className="text-xs text-gray-400 mb-1">
                        MITRE ATT&CK Mapping
                    </div>

                    <div className="text-sm text-cyan-300 font-semibold">
                        Tactic: {mitre.tactic}
                    </div>

                    <ul className="mt-2 list-disc list-inside text-sm text-gray-300 space-y-1">
                        {mitre.techniques.map((t) => (
                            <li key={t.id}>
                                <span className="text-white font-mono">{t.id}</span> — {t.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}



            {/* MAIN PANEL */}
            <div className="grid lg:grid-cols-6 gap-10 max-w-7xl">

                {/* LEFT — TIMELINE */}
                <div className="space-y-3 lg:col-span-1">
                    {ATTACK_STEPS.map((s, index) => (
                        <div
                            key={s.id}
                            onClick={() => {
                                setPlaying(false);
                                setCurrentStep(index);
                            }}
                            className={`p-4 rounded-lg border cursor-pointer transition ${index === currentStep
                                ? "border-cyan-400 bg-slate-900"
                                : "border-slate-700 bg-slate-950 hover:bg-slate-900"
                                }`}
                        >
                            <div className="text-xs text-gray-400">Step {s.id}</div>
                            <div className={`font-semibold ${s.color}`}>
                                {s.title}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CENTER — STEP DETAIL */}
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="lg:col-span-2 p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl max-h-[520px] overflow-y-auto"
                >
                    <h2 className={`text-xl font-bold mb-2 ${step.color}`}>
                        {step.title}
                    </h2>
                    <h3 className="text-gray-400 mb-6">{step.subtitle}</h3>

                    <p className="text-gray-300 leading-relaxed text-base mb-4">
                        {step.description}
                    </p>

                    <div className="p-5 rounded-lg bg-black border border-slate-700">
                        <p className="text-sm text-gray-400 mb-2">
                            {view === "attacker" ? "Attacker Perspective" : "Defender Perspective"}
                        </p>
                        <p className="text-base text-gray-200">
                            {view === "attacker" ? step.attackerView : step.defenderView}
                        </p>
                    </div>
                </motion.div>

                {/* RIGHT — GLOBE */}
                <div className="lg:col-span-2 h-[620px] relative border border-slate-700 rounded-xl overflow-hidden">
                    <GlobeSimulator />
                </div>



                {/* 🔮 AI INSIGHT PANEL — PHASE C2 */}
                <div className="lg:col-span-1 h-[620px] bg-slate-950 border border-slate-700 rounded-xl p-3 flex flex-col text-sm">
                    <h3 className="text-sm font-semibold text-cyan-300 mb-2">
                        🤖 DigitalFort AI Insight
                    </h3>

                    <div className="text-xs text-gray-400 mb-3">
                        Context-aware analysis (Phase B)
                    </div>

                    <div className="flex-1 bg-black border border-slate-700 rounded-lg p-2 text-xs text-gray-300 overflow-auto">
                        <p className="mb-2 text-cyan-300 font-semibold">
                            Current Stage: {step.title}
                        </p>

                        {aiLoading ? (
                            <p className="text-gray-500 italic">
                                Analyzing current attack phase…
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(normalizedInsight).map(([section, lines]) =>
                                    lines.length ? (
                                        <div key={section}>
                                            <div className="text-cyan-400 font-semibold mb-1">
                                                {section}
                                            </div>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                                                {lines.map((l, i) => (
                                                    <li key={i}>{l}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null
                                )}
                            </div>


                        )}


                        <p className="text-xs text-gray-500">
                            ▶ Future: LLM-driven reasoning
                            ▶ MITRE ATT&CK mapping
                            ▶ Risk scoring
                            ▶ Recommended counter-actions
                        </p>
                    </div>

                    <div className="mt-3 text-[10px] text-gray-500">
                        Phase C3 — Normalized AI Intelligence
                    </div>
                </div>
            </div>

            <div className="mt-12 max-w-7xl grid md:grid-cols-3 gap-6">
                <div className="p-5 bg-black border border-slate-700 rounded-lg">
                    <h4 className="text-cyan-300 font-semibold mb-2">Detection Signals</h4>
                    <p className="text-sm text-gray-300">
                        Anomaly score increased across authentication, endpoint, and network layers.
                    </p>
                </div>

                <div className="p-5 bg-black border border-slate-700 rounded-lg">
                    <h4 className="text-cyan-300 font-semibold mb-2">Defensive Actions</h4>
                    <p className="text-sm text-gray-300">
                        Isolation, policy enforcement, and threat neutralization executed.
                    </p>
                </div>

                <div className="p-5 bg-black border border-slate-700 rounded-lg">
                    <h4 className="text-cyan-300 font-semibold mb-2">Intelligence Outcome</h4>
                    <p className="text-sm text-gray-300">
                        Indicators stored. Models scheduled for retraining.
                    </p>
                </div>
            </div>

            {/* FOOTER NOTE */}
            <div className="mt-16 max-w-4xl text-gray-400 text-sm">
                This replay visually demonstrates the cyber kill chain.
                Upcoming phases will synchronize this timeline with globe
                visualization and real telemetry inside DigitalFort.
            </div>
        </div>
    );
}
