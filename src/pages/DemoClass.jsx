// src/pages/DemoClass.jsx
import React, { useState } from "react";

/**
 * DemoClass page
 * - Sends booking to Google Apps Script webhook (with secret token)
 * - Shows a professional confirmation UI
 * - Includes an intro video (YouTube iframe)
 *
 * IMPORTANT:
 * 1) Replace WEBHOOK_URL and SECRET_TOKEN with your values.
 * 2) Deploy your Apps Script as Web App (Anyone) and use that URL.
 */

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwWsG2iB3Uvp3HC5sXUFaMiVG-50sauCUohX0h85OeI6k0BB35UYThlj_YCk1y5fPpn5A/exec"; // << REPLACE
const SECRET_TOKEN = "cybercode-secret-123"; // << REPLACE

export default function DemoClass() {
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  // For small UX nicety
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    slot: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", course: "", slot: "" });
  };

  const submitToWebhook = async (payload) => {
    // Try normal POST first (modern Apps Script supports CORS for web apps deployed as "Anyone")
    try {
      const resp = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // If response is ok or text returned, treat as success.
      if (resp.ok || resp.status === 0 || resp.type === "opaque") {
        return true;
      }

      // If not ok, try fallback (no-cors) -- this will be opaque but often still succeeds server-side
      console.warn("Webhook returned non-OK status", resp.status);
      return false;
    } catch (err) {
      console.warn("Primary POST failed, trying no-cors fallback", err);
      // fallback (some Apps Script configs need this)
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        // no-cors gives opaque response — assume success
        return true;
      } catch (err2) {
        console.error("Fallback failed", err2);
        return false;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      course: formData.course,
      slot: formData.slot,
      token: SECRET_TOKEN,
    };

    // Basic validation
    if (!payload.name || !payload.email || !payload.phone || !payload.course || !payload.slot) {
      setErrorMsg("Please fill all fields before submitting.");
      setStatus("error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const ok = await submitToWebhook(payload);

    if (ok) {
      setStatus("success");
      resetForm();
    } else {
      setStatus("error");
      setErrorMsg("Failed to contact the server. Please try again in a moment.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-12 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">Book Your Free Demo Class</h1>
          <p className="mt-3 text-gray-700 dark:text-gray-300">See our simulators, meet trainers, and judge the teaching style before enrolling.</p>
        </div>

        {/* Video + benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
          <div>
            <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden shadow-lg">
              {/* Replace with your own video ID */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Cybercode Demo Intro"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Hands-on simulators and real projects</li>
              <li>• Job-focused curriculum and mentorship</li>
              <li>• Q&A session with trainers</li>
            </ul>
          </div>

          {/* Form card */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">WhatsApp / Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select a course</option>
                  <option>Golang</option>
                  <option>AWS</option>
                  <option>DevOps</option>
                  <option>Python Programming</option>
                  <option>Data Science & AI</option>
                  <option>Cloud Security</option>
                  <option>Terraform IaC</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Preferred slot</label>
                <select
                  name="slot"
                  value={formData.slot}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Choose a slot</option>
                  <option>Today - 7 PM</option>
                  <option>Tomorrow - 7 PM</option>
                  <option>Weekend - 11 AM</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full inline-flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow"
              >
                {status === "loading" ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : (
                  "Book Free Demo"
                )}
              </button>

              {status === "success" && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <h4 className="text-green-700 font-semibold">Booked — Check your email</h4>
                  <p className="text-sm text-gray-700">We've sent a confirmation to your email with next steps.</p>
                </div>
              )}

              {status === "error" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <h4 className="text-red-700 font-semibold">Something went wrong</h4>
                  <p className="text-sm text-gray-700">{errorMsg || "Please try again later."}</p>
                </div>
              )}
            </form>

            <div className="mt-6 text-xs text-gray-500">
              By booking you agree to receive emails related to the demo. We respect your privacy.
            </div>
          </div>
        </div>

        {/* FAQs or small footer */}
        <div className="max-w-3xl mx-auto text-sm text-gray-600 dark:text-gray-300">
          <h3 className="font-semibold mb-2">FAQ</h3>
          <p><strong>Q:</strong> Is the demo free? <br /><strong>A:</strong> Yes — completely free.</p>
          <p className="mt-2"><strong>Q:</strong> Will I receive a recording? <br /><strong>A:</strong> Yes, recordings are shared on request.</p>
        </div>
      </div>
    </div>
  );
}
