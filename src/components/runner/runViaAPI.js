export default async function runViaAPI(language, code) {
  const api = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const res = await fetch(`${api}/api/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code }),
  });
  if (!res.ok) throw new Error("Backend error");
  return await res.json();
}
