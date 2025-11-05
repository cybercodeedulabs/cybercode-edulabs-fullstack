import React from 'react';
import { Link } from 'react-router-dom';


export default function LegalIndex() {
return (
<div className="max-w-3xl mx-auto p-6">
<h1 className="text-2xl font-semibold mb-4">Legal & Policies</h1>
<ul className="list-disc pl-6 space-y-2">
<li><Link to="/privacy">Privacy Policy</Link></li>
<li><Link to="/terms">Terms of Use</Link></li>
<li><Link to="/refund">Refund Policy</Link></li>
</ul>
</div>
);
}