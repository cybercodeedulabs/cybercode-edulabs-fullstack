import React from "react";
import { Link } from "react-router-dom";
import { FileText, ShieldCheck, RotateCcw } from "lucide-react";

export default function LegalIndex() {
  const policies = [
    {
      title: "Privacy Policy",
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      path: "/privacy",
      desc: "Learn how we collect, use, and protect your personal information.",
    },
    {
      title: "Terms of Use",
      icon: <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      path: "/terms",
      desc: "Understand your rights and obligations while using our platform.",
    },
    {
      title: "Refund Policy",
      icon: <RotateCcw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      path: "/refund",
      desc: "Read our policy regarding payments, cancellations, and refunds.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">
        Legal & Policies
      </h1>

      <div className="space-y-6">
        {policies.map((policy, index) => (
          <Link
            key={index}
            to={policy.path}
            className="block p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-4 mb-2">
              {policy.icon}
              <h2 className="text-xl font-semibold">{policy.title}</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {policy.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
