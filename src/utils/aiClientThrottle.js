// src/utils/aiClientThrottle.js
// Simple client-side throttle: allow 1 send per 1200ms
let lastSend = 0;
export function canSendNow() {
  const now = Date.now();
  if (now - lastSend < 1200) return false;
  lastSend = now;
  return true;
}
