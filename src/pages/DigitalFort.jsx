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
        <div className="absolute inset-0 opacity-80 scale-[1.35]">
          <GlobeSimulator />
        </div>

        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

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

      {/* ------------------ HOW IT WORKS (Cinematic Animation) ------------------ */}
      <section className="py-24 px-6 md:px-12 bg-black">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center text-cyan-300 mb-8"
        >
          How Digital Fort Works
        </motion.h2>

        <p className="text-gray-300 text-lg max-w-4xl mx-auto mb-10 text-center">
          This cinematic simulation demonstrates how Digital Fort detects, isolates,
          blocks, and counteracts global cyber threats using advanced AI-driven
          autonomous defense engines.
        </p>

        <div className="max-w-5xl mx-auto">
          <AgenticAnimation autoRun={true} />
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
    </div>
  );
}
