/* -------------------------------------------------------
   DigitalFort.jsx — Full Vision Marketing Page (Enhanced)
   Written in Cybercode’s voice. Deep narrative, problem,
   mission, solution, and national vision included.
--------------------------------------------------------*/
import React from "react";
import GlobeSimulator from "../components/simulations/GlobeSimulator";
import AgenticAnimation from "../components/simulations/AgenticAnimation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function DigitalFort() {
    return (
        <div className="bg-black text-white">

            {/* ------------------ HERO ------------------ */}
            <section className="relative h-screen w-full overflow-hidden">

                {/* Brighter Globe */}
                <div className="absolute inset-0 opacity-100 scale-[1.05]">
                    <GlobeSimulator />
                </div>

                <div className="absolute inset-0 bg-black/10 backdrop-blur-none"></div>

                <div className="absolute inset-0 flex flex-col justify-center items-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-5xl md:text-7xl font-extrabold text-cyan-300 drop-shadow-lg text-center"
                    >
                        Digital Fort: India’s Cyber Shield
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2 }}
                        className="text-xl md:text-2xl text-cyan-100 max-w-3xl text-center mt-6"
                    >
                        An AI-driven defense ecosystem empowering India to detect,
                        understand, and counter cyber threats — at national scale.
                    </motion.p>
                </div>
            </section>

            {/* ------------------ WHY DIGITAL FORT? ------------------ */}
            <section className="py-24 px-6 md:px-12 bg-black">
                <motion.h2
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-4xl md:text-5xl font-bold text-center text-cyan-300 mb-12"
                >
                    Why Digital Fort Exists
                </motion.h2>

                <div className="max-w-5xl mx-auto space-y-8 text-gray-300 text-lg leading-relaxed">

                    {/* Problem */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        India is advancing rapidly in digital infrastructure — spanning banking,
                        healthcare, defence, smart cities, and citizen services. But with growth
                        comes exposure. Every day, India faces **millions of attempted cyber intrusions** —
                        from phishing networks and ransomware groups to hostile-state cyber units
                        targeting critical sectors.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.9 }}
                    >
                        The biggest gap today isn’t infrastructure — it is <span className="text-cyan-300 font-semibold">
                            skilled defenders, autonomous response systems, real-time situational awareness,
                            and accessible cyber ranges</span>. Traditional cybersecurity education
                        teaches theory, but real threats evolve at machine speed.
                    </motion.p>

                    {/* Vision */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="text-cyan-300 font-semibold">Digital Fort</span> is
                        designed to bridge this gap by building a **national cyber-defense
                        ecosystem** where:
                        <br />• Students learn hands-on cyber warfare
                        <br />• Enterprises test their resilience
                        <br />• Researchers study attack evolution
                        <br />• AI models protect & autonomously respond to threats
                        <br />• India builds its own cybersecurity capability — not relying on foreign systems
                    </motion.p>

                    {/* Mission */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.1 }}
                    >
                        The mission is simple:
                        <span className="text-cyan-300 font-semibold">
                            Equip every Indian institution — from colleges to corporates — with
                            the tools to understand, resist, and defeat cyberattacks.
                        </span>
                    </motion.p>

                </div>
            </section>

            {/* ------------------ WHAT DIGITAL FORT OFFERS ------------------ */}
            <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-black to-slate-900">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold text-center text-cyan-300 mb-12"
                >
                    What Is Digital Fort?
                </motion.h2>

                <div className="max-w-5xl mx-auto space-y-8 text-gray-300 text-lg">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        Digital Fort is a **virtual cyber-defense observatory** capable of
                        simulating real cyberattacks across the globe. It visualizes how threats
                        propagate, how adversaries operate, and how defensive strategies evolve.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.9 }}
                    >
                        Beyond visualization, Digital Fort is built to become an **AI-driven
                        autonomous defense engine** — designed to detect anomalies, correlate
                        threat signals, predict upcoming attacks, and trigger automated countermeasures.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        Students, SOC teams, and enterprises will gain access to:
                        <br />✔ Live cyber range
                        <br />✔ Threat propagation maps
                        <br />✔ Attack & defense simulations
                        <br />✔ AI-guided cybersecurity labs
                        <br />✔ Research-grade attack datasets
                        <br />✔ Hands-on defensive strategy builders
                    </motion.p>

                </div>
            </section>

            {/* ------------------ HOW DIGITAL FORT WORKS (HYBRID EXPLAINER) ------------------ */}
            <section className="py-24 px-6 md:px-12 bg-black">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold text-center text-cyan-300 mb-6"
                >
                    How Digital Fort Works
                </motion.h2>

                <p className="text-gray-300 text-lg max-w-4xl mx-auto mb-14 text-center">
                    See cyberattacks the way a real Security Operations Center (SOC) sees them —
                    from the first scan to final containment.
                </p>

                <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">

                    {/* LEFT — STORY WALKTHROUGH */}
                    <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                        <p>
                            <span className="text-cyan-300 font-semibold">Attack Replay Lab</span> is an
                            interactive cyber-defense simulation that lets you replay real-world
                            cyberattacks step-by-step — exactly as they unfold inside a modern SOC.
                        </p>

                        <p>
                            Instead of reading theory, you observe how attackers move, how anomalies
                            are detected, how risk escalates, and how defenders respond — in real time.
                        </p>

                        <ul className="space-y-2 text-sm">
                            <li>• Reconnaissance → Initial Access → Payload Execution</li>
                            <li>• Lateral Movement → Detection → Isolation & Mitigation</li>
                            <li>• Intelligence stored for future prevention</li>
                        </ul>

                        <p className="text-gray-400 text-sm">
                            Every phase is shown from both perspectives:
                            <br />🟥 Attacker behavior &nbsp;&nbsp; 🟦 Defender (SOC) response
                        </p>

                        <Link
                            to="/digital-fort/labs/attack-replay"
                            className="inline-block mt-6 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-bold shadow-lg"
                        >
                            ▶ Experience the Attack Replay Lab
                        </Link>
                    </div>

                    {/* RIGHT — VISUAL TEASER */}
                    <div className="relative h-[420px] border border-slate-700 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 opacity-80">
                            <GlobeSimulator />
                        </div>
                        <div className="absolute inset-0 bg-black/40"></div>

                        <div className="absolute bottom-6 left-6 right-6 text-sm text-gray-200">
                            Live global threat activity visualization — representing how attacks
                            propagate across regions in real time.
                        </div>
                    </div>

                </div>
            </section>


            {/* ------------------ CTA ------------------ */}
            <section className="py-20 px-6 text-center bg-black">
                <h3 className="text-3xl font-semibold text-cyan-300 mb-6">
                    Enter DigitalFort Labs
                </h3>

                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
                    Access hands-on cyber ranges, attack simulations, defensive AI modules,
                    and real research environments.
                    <br />
                    <span className="text-cyan-300 font-semibold">
                        C3 Cloud IAM login required for secure access.
                    </span>
                </p>

                <Link
                    to="/digital-fort/labs"
                    className="px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-bold text-lg shadow-xl"
                >
                    Go to Labs
                </Link>
            </section>

            {/* ======================================================
         NEW SECTION A — DIGITALFORT HIGHLIGHTS GRID
      ====================================================== */}
            <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-slate-900 to-black">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-bold text-center text-cyan-300 mb-14"
                >
                    What Makes Digital Fort Unique
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">

                    {[
                        {
                            title: "AI Threat Intelligence",
                            desc:
                                "Real-time threat correlation and autonomous pattern detection powered by Cybercode’s AI models.",
                        },
                        {
                            title: "Global Attack Map",
                            desc:
                                "Live visualization of cyber threats propagating across nations, industries, and IP clusters.",
                        },
                        {
                            title: "Autonomous Defense Engine",
                            desc:
                                "AI agents that automatically isolate, block, classify, and counterattack hostile digital signatures.",
                        },
                        {
                            title: "Full Cyber Range",
                            desc:
                                "Hands-on lab environment where students and teams practice real offensive & defensive strategies.",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="p-6 bg-slate-800/40 border border-slate-700 rounded-xl shadow-xl hover:scale-105 transition transform"
                        >
                            <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                                {item.title}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ======================================================
         NEW SECTION B — VIDEO STYLE STORYLINE
      ====================================================== */}
            <section className="py-24 px-6 md:px-12 bg-black">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center text-cyan-300 mb-14"
                >
                    The Digital Fort Story — A Cyber Attack in Motion
                </motion.h2>

                <div className="space-y-10 max-w-5xl mx-auto text-gray-300 text-lg leading-relaxed">

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="text-cyan-300 font-semibold">Scene 1 — Reconnaissance:</span>
                        A hostile group begins scanning India's public infrastructure for vulnerabilities.
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-cyan-300 font-semibold">Scene 2 — Breach Attempt:</span>
                        Automated bots attempt credential stuffing against a financial API gateway.
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.9 }}
                    >
                        <span className="text-cyan-300 font-semibold">Scene 3 — Digital Fort Detects:</span>
                        Threat sensors flag unusual behavior, trigger anomaly checks, and notify the AI engine.
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="text-cyan-300 font-semibold">Scene 4 — Isolation:</span>
                        Suspicious IP ranges are sandboxed. Malicious payloads are captured for AI analysis.
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.1 }}
                    >
                        <span className="text-cyan-300 font-semibold">Scene 5 — Counter Projection:</span>
                        Digital Fort recommends countermeasures and blocks the attack path across all nodes.
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.2 }}
                    >
                        <span className="text-cyan-300 font-semibold">Scene 6 — India Secured:</span>
                        The attack is neutralized, logged, and added to the threat intelligence dataset.
                    </motion.div>

                </div>
            </section>

            {/* ======================================================
         NEW SECTION C — USE CASES SECTION
      ====================================================== */}
            <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-black to-slate-900">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center text-cyan-300 mb-14"
                >
                    Who Is Digital Fort Built For?
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">

                    {[
                        {
                            title: "Engineering Colleges",
                            desc:
                                "Students gain hands-on cyber range access, AI-guided learning, and real attack-defense practice.",
                        },
                        {
                            title: "Enterprise SOC Teams",
                            desc:
                                "SOC analysts get threat simulations, incident playbooks, and attack prediction tools.",
                        },
                        {
                            title: "Startups & Tech Companies",
                            desc:
                                "Build, test, and validate cybersecurity products inside a safe simulated environment.",
                        },
                        {
                            title: "Government Departments",
                            desc:
                                "Secure infrastructure, evaluate risks, and build sovereign defense strategies for India.",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 bg-slate-800/40 border border-slate-700 rounded-xl shadow-xl hover:scale-105 transition transform"
                        >
                            <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                                {item.title}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}

                </div>
            </section>

        </div>
    );
}
