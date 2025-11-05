import React from 'react';


export default function TermsOfUse() {
return (
<div className="max-w-4xl mx-auto p-6 prose dark:prose-invert">
<h1>Terms of Use</h1>
<p>Last updated: {new Date().toLocaleDateString()}</p>


<h2>Acceptance</h2>
<p>By using Cybercode EduLabs you agree to these terms. If you do not
agree, do not use the service.</p>


<h2>Service Description</h2>
<p>We provide educational content, project mentorship, and a hosted
developer environment (subject to subscription plans).</p>


<h2>User Accounts</h2>
<p>Accounts are created via Google Sign-In. You are responsible for
any activity on your account.</p>


<h2>Payments & Subscriptions</h2>
<p>Paid features are billed through our payment partner. Refunds are
handled according to our Refund Policy.</p>


<h2>Termination</h2>
<p>We may suspend or terminate accounts for TOS violations or unpaid
subscriptions.</p>


<h2>Limitation of Liability</h2>
<p>To the maximum extent permitted by law, Cybercode EduLabs is not
liable for indirect or consequential damages.</p>


<h2>Contact</h2>
<p>support@cybercodeedulabs.com</p>
</div>
);
}