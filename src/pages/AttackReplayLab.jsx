/* -------------------------------------------------------
   AttackReplayLab.jsx — DigitalFort Attack Replay Lab
   Phase 2: Visual + Narrative Replay Engine
   Timeline • Speed Control • POV Toggle
   No backend | No globe dependency (yet)
--------------------------------------------------------*/
import React, { useState, useEffect } from "react";
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


export default function AttackReplayLab() {
    const [currentStep, setCurrentStep] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [view, setView] = useState("defender");

    // Auto-play logic with speed control
    useEffect(() => {
        if (!playing) return;

        const timer = setTimeout(() => {
            setCurrentStep((prev) =>
                prev < ATTACK_STEPS.length - 1 ? prev + 1 : prev
            );
        }, 3000 / speed);

        return () => clearTimeout(timer);
    }, [playing, currentStep, speed]);

    const step = ATTACK_STEPS[currentStep];

    useEffect(() => {
        const globe = window.__DIGITALFORT_GLOBE__;
        if (!globe) return;

        if (currentStep >= 4) globe.pause();
        else globe.resume();

        if (GEO_MAP[currentStep]) {
            globe.highlightAttack(GEO_MAP[currentStep]);
        } else {
            globe.restoreLive?.();
        }
    }, [currentStep]);


    return (
        <div className="min-h-screen bg-black text-white p-10">
            {/* HEADER */}
            <h1 className="text-4xl font-bold text-cyan-300 mb-2">
                🔁 Attack Replay Lab
            </h1>
            <p className="max-w-3xl text-gray-300 mb-8">
                Replay real-world cyberattack scenarios step-by-step. Observe both
                attacker behavior and DigitalFort’s defensive response.
            </p>

            {/* CONTROLS BAR */}
            <div className="flex flex-wrap gap-4 mb-10">
                <button
                    onClick={() => setPlaying(!playing)}
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

            {/* MAIN PANEL */}
            <div className="grid lg:grid-cols-4 gap-10 max-w-7xl">
                {/* LEFT — TIMELINE */}
                <div className="space-y-3 lg:col-span-1">
                    {ATTACK_STEPS.map((s, index) => (
                        <div
                            key={s.id}
                            onClick={() => setCurrentStep(index)}
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
                    className="lg:col-span-2 p-8 rounded-xl bg-slate-900 border border-slate-700 shadow-xl"
                >

                    <h2 className={`text-2xl font-bold mb-2 ${step.color}`}>
                        {step.title}
                    </h2>
                    <h3 className="text-gray-400 mb-6">{step.subtitle}</h3>

                    <p className="text-gray-300 leading-relaxed text-lg mb-6">
                        {step.description}
                    </p>

                    <div className="p-5 rounded-lg bg-black border border-slate-700">
                        <p className="text-sm text-gray-400 mb-2">
                            {view === "attacker" ? "Attacker Perspective" : "Defender Perspective"}
                        </p>
                        <p className="text-lg text-gray-200">
                            {view === "attacker" ? step.attackerView : step.defenderView}
                        </p>
                    </div>
                </motion.div>
                {/* RIGHT — GLOBE */}
                <div className="lg:col-span-1 relative h-[520px] border border-slate-700 rounded-xl overflow-hidden">
                    <GlobeSimulator />
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
