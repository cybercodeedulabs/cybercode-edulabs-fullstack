import React, { useEffect, useState } from 'react';


export default function CookieBanner(){
const [accepted, setAccepted] = useState(localStorage.getItem('cc_cookies') === '1');
useEffect(()=>{
if(!accepted) return;
localStorage.setItem('cc_cookies','1');
},[accepted]);


if(accepted) return null;
return (
<div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 z-50">
<div className="bg-white dark:bg-gray-800 border p-4 rounded shadow flex items-center justify-between">
<div className="max-w-lg text-sm">We use cookies for analytics and to improve your experience. By continuing you agree to our <a className="underline" href="/privacy">Privacy Policy</a>.</div>
<div className="ml-4">
<button className="px-4 py-1 bg-indigo-600 text-white rounded" onClick={()=>setAccepted(true)}>Accept</button>
</div>
</div>
</div>
);
}