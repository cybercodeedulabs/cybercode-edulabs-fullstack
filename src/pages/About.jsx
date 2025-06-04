import React from "react";
import { CheckCircle, Rocket, ShieldCheck } from "lucide-react";

export default function About() {
  const Section = ({ title, emoji, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-3">
      <h2 className="text-xl font-semibold">
        {emoji} {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
        About Cybercode EduLabs
      </h1>

      <Section title="Who We Are" emoji="🚀">
        <p className="text-gray-700 dark:text-gray-300">
          Cybercode EduLabs is a next-generation tech education and development platform
          designed to close the gap between education and employment. We combine
          cutting-edge learning with real-world project exposure, functioning as both a
          skill-building ecosystem for learners and a dedicated IT hub for government
          and corporate clients.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          With a focus on <strong>AI-first</strong>, <strong>cloud-native</strong>, and <strong>job-centric</strong>
          training, we empower learners with the tools, mentorship, and experience they
          need to thrive in the tech workforce of tomorrow.
        </p>
      </Section>

      <Section title="Our Mission" emoji="🎯">
        <p className="text-gray-700 dark:text-gray-300">
          To empower students, job seekers, and aspiring tech professionals with
          future-ready skills, hands-on project experience, and meaningful employment
          opportunities—all while delivering innovative technology solutions to public
          and private sectors.
        </p>
      </Section>

      <Section title="Our Vision" emoji="🌐">
        <p className="text-gray-700 dark:text-gray-300">
          To build a self-sustaining IT ecosystem in India where education, innovation,
          and employment converge. Cybercode EduLabs strives to become the nation’s
          most trusted platform for AI-driven learning, cloud-native development, and
          real-time project delivery.
        </p>
      </Section>

      <Section title="Our Pillars of Impact" emoji="🏗️">
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Job-Focused Learning:</strong> Courses in Programming, Cloud, DevOps,
            Cybersecurity, AI & Data; hands-on sandboxes, GitHub projects, and certification.
          </li>
          <li>
            <strong>Real-Time Server/Lab Access:</strong> 1-year student subscription for deployment,
            enterprise simulation, and DevOps pipelines.
          </li>
          <li>
            <strong>Live Project Hub:</strong> Government & corporate projects turned into real-time learning
            with mentoring and GitHub exposure.
          </li>
          <li>
            <strong>Registered IT Services Provider:</strong> Custom tech solutions & job creation
            through student involvement.
          </li>
          <li>
            <strong>Academic Collaborations:</strong> MoUs with colleges for training, credits,
            placement, and scalable impact.
          </li>
          <li>
            <strong>Startup & Employment Ecosystem:</strong> Mentorship, hackathons, and real jobs
            for top-performing learners.
          </li>
        </ul>
      </Section>

      <Section title="The AI-First Edge" emoji="🤖">
        <p className="text-gray-700 dark:text-gray-300">
          Our platform is evolving with an AI-first approach—integrating machine learning,
          generative AI, RAG-based apps, AI resume builders, and GPT-powered learning tools
          into every stage of education and project delivery.
        </p>
      </Section>

      <Section title="Innovation in Action" emoji="🛠️">
        <p className="text-gray-700 dark:text-gray-300">
          From multilingual government chatbots to healthcare AI assistants and smart
          college tools, we’ve already delivered solutions that combine technical
          excellence with social impact.
        </p>
      </Section>

      <Section title="Our Roadmap" emoji="🗺️">
        <p className="text-gray-700 dark:text-gray-300">
          Over the next 10 years, Cybercode EduLabs aims to become India’s largest tech
          education and delivery hub, generating over 1,000 jobs per year by scaling
          education, partnerships, and client services.
        </p>
      </Section>

      <Section title="Taglines That Define Us" emoji="🔖">
        <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-center">
          <li>“Code. Learn. Build. Empower.”</li>
          <li>“From Classroom to Cloud. From Learner to Leader.”</li>
          <li>“Learn AI. Build Real Solutions. Earn Real Experience.”</li>
        </ul>
      </Section>
    </div>
  );
}
