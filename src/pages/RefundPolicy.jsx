import React from 'react';


export default function RefundPolicy() {
return (
<div className="max-w-4xl mx-auto p-6 prose dark:prose-invert">
<h1>Refund & Cancellation Policy</h1>
<p>Last updated: {new Date().toLocaleDateString()}</p>


<h2>Free Content</h2>
<p>Free lessons and trial content are not refundable.</p>


<h2>Paid Courses & Subscriptions</h2>
<p>
For one-time course purchases, request a refund within 7 days of
purchase if you have not consumed more than 20% of the course content.
</p>


<h2>Subscriptions</h2>
<p>
Subscription fees are billed per cycle and are refundable only under
exceptional circumstances. Contact support@cybercodeedulabs.com for
assistance.
</p>


<h2>How to Request</h2>
<p>Email your order details to support@cybercodeedulabs.com and our
team will respond within 5 business days.</p>


</div>
);
}