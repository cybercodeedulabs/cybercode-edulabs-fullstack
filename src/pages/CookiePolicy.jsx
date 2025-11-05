function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        Cookie Policy
      </h1>
      <p className="mb-4">
        At <strong>Cybercode EduLabs</strong>, we use cookies and similar technologies to enhance
        your browsing experience, analyze site traffic, and provide personalized
        content. This Cookie Policy explains what cookies are, how we use them, and
        how you can manage your preferences.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies?</h2>
      <p className="mb-4">
        Cookies are small text files stored on your device when you visit a website.
        They help remember your preferences, login status, and site activity to
        improve your experience.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Cookies</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>To remember your dark/light mode and user preferences.</li>
        <li>To improve site performance and functionality.</li>
        <li>To analyze how users interact with our content.</li>
        <li>To support secure authentication and user sessions.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Managing Cookies</h2>
      <p className="mb-4">
        You can accept, reject, or delete cookies through your browser settings.
        However, disabling cookies may affect the functionality of certain parts of
        our website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Updates to This Policy</h2>
      <p className="mb-4">
        We may update this Cookie Policy periodically to reflect changes in our
        practices. Please check this page regularly for updates.
      </p>

      <p className="mt-8 text-sm opacity-80">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}

export default CookiePolicy;
