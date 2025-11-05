// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";

export default function About() {
  const Section = ({ title, emoji, children, delay = 0 }) => (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{children}</div>
    </motion.div>
  );

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About Cybercode EduLabs
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Empowering learners, developers, and innovators through AI-first education, 
            real-world projects, and scalable digital transformation.
          </motion.p>
        </div>

        {/* Sections */}
        <Section title="Who We Are" emoji="🚀">
          <p>
            <strong>Cybercode EduLabs</strong> is a next-generation tech education and
            development platform designed to close the gap between education and
            employment. We merge cutting-edge learning with real-world project experience,
            operating as both a skill-building ecosystem and a dedicated IT hub for
            government and corporate clients.
          </p>
          <p>
            With a focus on <strong>AI-first</strong>, <strong>cloud-native</strong>, and{" "}
            <strong>job-centric</strong> training, we empower learners with the mentorship,
            tools, and experience needed to thrive in tomorrow’s workforce.
          </p>
        </Section>

        <Section title="Our Mission" emoji="🎯" delay={0.1}>
          <p>
            To empower students, job seekers, and professionals with future-ready skills,
            hands-on project experience, and employment opportunities — while delivering
            innovative tech solutions to both public and private sectors.
          </p>
        </Section>

        <Section title="Our Vision" emoji="🌐" delay={0.2}>
          <p>
            To build a self-sustaining IT ecosystem where education, innovation, and
            employment converge. We aim to become India’s most trusted platform for
            AI-driven learning, cloud-native development, and live project delivery.
          </p>
        </Section>

        <Section title="Our Pillars of Impact" emoji="🏗️" delay={0.3}>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Job-Focused Learning:</strong> Hands-on courses in Programming, Cloud,
              DevOps, AI & Cybersecurity with GitHub-based projects.
            </li>
            <li>
              <strong>Real-Time Lab Access:</strong> 1-year subscriptions for deployment,
              enterprise simulation, and DevOps pipelines.
            </li>
            <li>
              <strong>Live Project Hub:</strong> Government & corporate projects turned into
              real-time learning experiences.
            </li>
            <li>
              <strong>Registered IT Services Provider:</strong> Custom tech solutions &
              employment through student involvement.
            </li>
            <li>
              <strong>Academic Collaborations:</strong> MoUs with colleges for training,
              placement, and academic credits.
            </li>
            <li>
              <strong>Startup & Employment Ecosystem:</strong> Hackathons, mentorship, and
              job creation for top-performing learners.
            </li>
          </ul>
        </Section>

        <Section title="The AI-First Edge" emoji="🤖" delay={0.4}>
          <p>
            Our platform evolves with an AI-first approach — integrating generative AI,
            RAG-based apps, machine learning models, and GPT-powered learning tools across
            every course and project.
          </p>
        </Section>

        <Section title="Innovation in Action" emoji="🛠️" delay={0.5}>
          <p>
            From multilingual chatbots to AI-driven healthcare assistants and smart campus
            tools, Cybercode EduLabs continuously delivers impactful real-world solutions.
          </p>
        </Section>

        <Section title="Our Roadmap" emoji="🗺️" delay={0.6}>
          <p>
            Over the next decade, we aim to become India’s largest tech education and
            delivery hub — generating 1,000+ jobs annually through scalable training and
            partnerships.
          </p>
        </Section>

        <Section title="Taglines That Define Us" emoji="🔖" delay={0.7}>
          <ul className="text-center space-y-1">
            <li>“Code. Learn. Build. Empower.”</li>
            <li>“From Classroom to Cloud. From Learner to Leader.”</li>
            <li>“Learn AI. Build Real Solutions. Earn Real Experience.”</li>
          </ul>
        </Section>
      </div>
    </section>
  );
}
