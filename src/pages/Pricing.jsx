// src/pages/Pricing.jsx
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

/* ===========================================================================
   Nebula Background (same family as C3 Cloud, reused for brand consistency)
   =========================================================================== */
function NebulaBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/c3-nebula-bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
    </div>
  );
}

/* ===========================================================================
   PRICING PAGE
   =========================================================================== */
export default function Pricing() {
  const tiers = [
    {
      name: "Student",
      price: "Free",
      priceSub: "for individual learners",
      badge: "Best for learners",
      description:
        "Perfect for students exploring cloud, DevOps, and programming with guided labs.",
      features: [
        "1 vCPU sandbox",
        "512 MB RAM",
        "5 GB storage",
        "1 active workspace",
        "Git auto-deploy (basic)",
        "Community support",
      ],
      cta: "Start with Student",
      highlight: false,
    },
    {
      name: "Edu+",
      price: "₹499 / month",
      priceSub: "for classes & cohorts",
      badge: "Most Popular",
      description:
        "For serious learners, instructors, and small cohorts who need stable cloud labs.",
      features: [
        "2 vCPU sandbox",
        "2 GB RAM",
        "25 GB storage",
        "Up to 5 active workspaces",
        "Git auto-deploy with branches",
        "Priority support (email)",
        "Custom lab templates (coming soon)",
      ],
      cta: "Get Edu+ Access",
      highlight: true,
    },
    {
      name: "Startup / Campus",
      price: "Talk to us",
      priceSub: "custom for institutes & teams",
      badge: "For colleges & teams",
      description:
        "Tailored C3 Cloud environments for colleges, training companies, and startups.",
      features: [
        "Custom vCPU & RAM limits",
        "Larger storage quotas",
        "Multi-user classrooms",
        "Private labs & VPC-style isolation",
        "Custom domains & SSO (roadmap)",
        "Onboarding & training sessions",
      ],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-50 relative">
      <NebulaBackground />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* HERO */}
        <section className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-cyan-300/80 mb-3">
              C3 CLOUD PRICING
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              <span className="text-white">Choose the right plan</span>{" "}
              <span className="block md:inline bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                for your cloud journey
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
              From individual learners to colleges and startup teams, C3 Cloud
              gives you education-first cloud workspaces, predictable billing,
              and secure sandboxes — hosted in India.
            </p>
          </motion.div>
        </section>

        {/* TIERS GRID */}
        <section className="mb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -6 }}
                className={
                  tier.highlight
                    ? "md:-mt-4 md:mb-4" // subtle elevation for middle card
                    : ""
                }
              >
                <Card
                  className={`h-full bg-white/5 backdrop-blur-xl border ${
                    tier.highlight
                      ? "border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
                      : "border-white/10"
                  }`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-semibold text-white">
                        {tier.name}
                      </h2>
                      {tier.badge && (
                        <span
                          className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full ${
                            tier.highlight
                              ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/40"
                              : "bg-slate-800 text-slate-200 border border-slate-600"
                          }`}
                        >
                          {tier.badge}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="text-2xl font-bold text-cyan-300">
                        {tier.price}
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        {tier.priceSub}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 mb-4">
                      {tier.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span className="mt-[3px] text-cyan-300">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-6">
                      <Button
                        className="w-full text-sm"
                        variant={tier.highlight ? "default" : "secondary"}
                      >
                        {tier.cta}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">
            Compare plans at a glance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 text-center mb-6 max-w-2xl mx-auto">
            Start free with Student, upgrade to Edu+ when you want more
            workspaces and resources, or talk to us for campus / startup needs.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-300">
                    Feature
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-100">
                    Student
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-100">
                    Edu+
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-100">
                    Startup / Campus
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  {
                    label: "vCPU per sandbox",
                    student: "1 vCPU",
                    edu: "2 vCPU",
                    startup: "Custom",
                  },
                  {
                    label: "RAM per sandbox",
                    student: "512 MB",
                    edu: "2 GB",
                    startup: "Custom",
                  },
                  {
                    label: "Storage",
                    student: "5 GB",
                    edu: "25 GB",
                    startup: "Custom / higher",
                  },
                  {
                    label: "Active workspaces",
                    student: "1",
                    edu: "Up to 5",
                    startup: "Custom per team",
                  },
                  {
                    label: "Git auto-deploy",
                    student: "Basic (main branch)",
                    edu: "Branches + rebuilds",
                    startup: "Advanced workflows",
                  },
                  {
                    label: "Ideal for",
                    student: "Self-paced learners",
                    edu: "Bootcamps / classes",
                    startup: "Colleges & teams",
                  },
                  {
                    label: "Support",
                    student: "Community",
                    edu: "Priority email",
                    startup: "Priority + onboarding",
                  },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-200">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-300">
                      {row.student}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-300">
                      {row.edu}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-300">
                      {row.startup}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ / CTA FOOTER */}
        <section className="mt-10 border-t border-white/10 pt-8">
          <div className="grid gap-8 md:grid-cols-[1.2fr,1fr] items-start">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Not sure which plan fits your use case?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-3">
                If you&apos;re a single learner, start with the Student plan. If
                you&apos;re running classes, labs, or bootcamps, Edu+ gives you
                better resources and more workspaces.
              </p>
              <p className="text-xs sm:text-sm text-slate-300">
                For colleges, training institutes or startup teams, we can shape
                a custom C3 Cloud environment aligned with your syllabus, tools,
                and security requirements.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <h4 className="text-sm font-semibold text-white mb-2">
                Talk to us for campus / startup pricing
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mb-4">
                Share your use case (number of learners, type of labs, duration)
                and we&apos;ll respond with a tailored plan.
              </p>
              <Button
                className="w-full text-sm"
                onClick={() => (window.location.href = "/contact")}
              >
                Contact Cybercode EduLabs
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
