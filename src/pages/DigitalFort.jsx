/* -------------------------------------------------------
   DigitalFort.jsx — Public Page for Cyber Defense Vision
--------------------------------------------------------*/
import React from "react";
import GlobeSimulator from "../components/simulations/GlobeSimulator";
import { motion } from "framer-motion";

export default function DigitalFort() {
  return (
    <div className="bg-black text-white">
      {/* ------------------ HERO ------------------ */}
      <section className="relative h-screen w-full overflow-hidden">
        <GlobeSimulator />

        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center">
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
            transition={{ duration: 1.3 }}
            className="text-xl md:text-2xl text-cyan-100 max-w-3xl text-center mt-6"
          >
            A national-scale AI-powered cyber defense simulation lab built for
            students, engineers, researchers, and enterprises.
          </motion.p>
        </div>
      </section>

      {/* ------------------ VISION ------------------ */}
      <section className="py-20 px-6 md:px-12 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-6">
            Our Vision
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed">
            Digital Fort aims to become India’s **largest open cyber-defense
            ecosystem**, empowering students and researchers to understand global
            threat patterns, simulate attack surfaces, and build resilient
            defensive strategies — all through an AI-guided platform.
          </p>
        </motion.div>
      </section>

      {/* ------------------ DESCRIPTION ------------------ */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto space-y-6 text-gray-300 text-lg"
        >
          <h3 className="text-3xl font-semibold text-cyan-300 mb-4">
            What is Digital Fort?
          </h3>

          <p>
            Digital Fort is a **virtual cyber-defense observatory** that shows
            simulated global cyberattacks in real time. It educates users on how
            threats move geographically and how attack vectors evolve.
          </p>

          <p>
            It will integrate AI-driven detection, prediction, and automated
            response models — turning every user into a capable cyber defender.
          </p>

          <p>
            This initiative supports:
            <br />✔ Students & engineering colleges  
            ✔ Government cyber cells  
            ✔ Startups building defense tools  
            ✔ SOC teams testing scenarios  
            ✔ Citizens learning cyber hygiene
          </p>
        </motion.div>
      </section>

      {/* ------------------ SIMULATOR CTA ------------------ */}
      <section className="py-20 px-6 bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h3 className="text-3xl font-semibold text-cyan-300 mb-6">
            Global Threat Simulator
          </h3>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-10">
            Experience a mini cyber-attack simulation powered by AI.  
            Observe global threat flows and understand how cyberattacks propagate.
          </p>

          <a
            href="#"
            className="px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-bold text-lg shadow-xl"
          >
            Launch Simulation
          </a>
        </motion.div>
      </section>
    </div>
  );
}
