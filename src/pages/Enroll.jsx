// src/pages/Enroll.jsx
import React from "react";

export default function Enroll() {
  return (
    <div className="max-w-3xl mx-auto p-10 text-center">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Deep Dive Enrollment</h1>
      <p className="text-gray-600 mb-6">
        Unlock premium access to mentor-led classes, certification exams, and real cloud labs.
      </p>

      <ul className="text-left space-y-3 mb-6">
        <li>✅ Instructor-led live sessions</li>
        <li>✅ Guided labs & virtual machines</li>
        <li>✅ Certification upon completion</li>
        <li>✅ 1-on-1 mentorship support</li>
      </ul>

      <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Join Premium Program
      </button>
    </div>
  );
}
