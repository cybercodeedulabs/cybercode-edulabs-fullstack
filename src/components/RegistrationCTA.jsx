// src/components/RegistrationCTA.jsx
import { Link } from "react-router-dom";

function RegistrationCTA() {
  return (
    <section className="bg-indigo-600 dark:bg-indigo-700 py-16 px-6 text-center text-white rounded-2xl shadow-xl mt-16 mx-auto max-w-5xl">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Upskill?</h2>
      <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
        Join <strong>Cybercode EduLabs</strong> today and gain real-time project experience, corporate exposure, and industry-recognized certifications.
      </p>
      <Link
        to="/register"
        className="inline-block bg-white text-indigo-700 font-semibold text-base px-8 py-3 rounded-xl shadow hover:bg-gray-100 transition"
      >
        🚀 Register Now
      </Link>
    </section>
  );
}

export default RegistrationCTA;
