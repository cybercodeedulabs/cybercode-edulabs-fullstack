// src/pages/PodcastEpisode.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

export default function PodcastEpisode() {
  const { id } = useParams(); // episode id from the URL

  // This will later come from API or JSON
  const episode = {
    title: "Exclusive: How Warner Bros Protects Hollywood from Cyber Attacks",
    description:
      "A deep dive into entertainment cybersecurity with the Director of Cybersecurity at Warner Bros. We discuss content leaks, insider threats, cloud production security, Zero Trust, and what it takes to secure billion-dollar film projects.",
    guest: "Director, Cybersecurity – Warner Bros",
    duration: "42 minutes",
    releaseDate: "2025-01-10",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link
        to="/podcast"
        className="text-indigo-600 hover:text-indigo-800 text-sm mb-6 inline-block"
      >
        ← Back to Episodes
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {episode.title}
      </h1>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
        <strong>Guest:</strong> {episode.guest}
      </p>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
        <strong>Duration:</strong> {episode.duration} •{" "}
        <strong>Released:</strong> {episode.releaseDate}
      </p>

      {/* Placeholder video / audio embed */}
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Podcast Player / Video Embed Coming Soon
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
        {episode.description}
      </p>

      {/* Call to Action */}
      <div className="mt-10 p-6 bg-indigo-50 dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Join Cybercode Research Lab
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Explore more deep tech conversations, hands-on labs, and research insights.
        </p>
        <Link
          to="/register"
          className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
        >
          Register & Start Learning
        </Link>
      </div>
    </div>
  );
}
