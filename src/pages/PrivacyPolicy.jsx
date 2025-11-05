import React from 'react';


export default function PrivacyPolicy() {
return (
<div className="max-w-4xl mx-auto p-6 prose dark:prose-invert">
<h1>Privacy Policy</h1>
<p>Last updated: {new Date().toLocaleDateString()}</p>


<h2>Introduction</h2>
<p>
Cybercode EduLabs ("we", "our", "us") respects your privacy. This
policy explains what personal data we collect, why we collect it, and
how you can manage it.
</p>


<h2>Data We Collect</h2>
<ul>
<li>Account information: name, email (via Google Sign-In).</li>
<li>Usage data: pages visited, features used, timestamps.</li>
<li>Payment & billing details: stored by our payment processor.</li>
</ul>


<h2>How We Use Data</h2>
<p>We use data to provide the service, manage subscriptions, and improve
the platform. We never sell personal data to third parties.</p>


<h2>Third-Party Services</h2>
<p>We use Firebase, Netlify, and a payment processor (e.g., Razorpay or
Stripe) — each has its own privacy policies.</p>


<h2>Security</h2>
<p>We use standard measures to protect data in transit and at rest. For
production secrets we use environment variables (Netlify / Vercel /
Render secrets manager).</p>


<h2>Your Rights</h2>
<p>You can request export or deletion of your personal data by emailing
support@cybercodeedulabs.com.</p>


<h2>Contact</h2>
<p>For privacy questions, email: support@cybercodeedulabs.com</p>
</div>
);
}