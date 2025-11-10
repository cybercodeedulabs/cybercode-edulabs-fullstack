// src/pages/AdminWaitlist.jsx
import React, { useEffect, useState } from "react";
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, provider } from "../firebase";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

function formatDate(ts) {
  try {
    if (!ts) return "";
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString();
    return new Date(ts).toLocaleString();
  } catch (e) {
    return "";
  }
}

export default function AdminWaitlist() {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  // ✅ Allowed admin emails from .env file
  const ALLOWED_ADMINS = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // Track auth state
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, [auth]);

  async function handleSignIn() {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Sign-in failed. Please try again.");
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
      setRows([]);
      setAuthorized(false);
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  }

  async function loadRows() {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "cloud_waitlist"), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRows(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load waitlist data.");
    } finally {
      setLoading(false);
    }
  }

  // 🔐 Authorization check
  useEffect(() => {
    if (!user) return;

    const email = user.email?.toLowerCase() || "";
    if (ALLOWED_ADMINS.length && !ALLOWED_ADMINS.includes(email)) {
      setAuthorized(false);
      setError("Access denied — this account is not authorized.");
      return;
    }

    setAuthorized(true);
    loadRows();
  }, [user]);

  // 🧾 Export waitlist as CSV
  function exportCSV() {
    if (!rows.length) return;

    const headers = ["id", "name", "email", "organization", "interest", "timestamp"];
    let csv = headers.join(",") + "\n";

    rows.forEach((r) => {
      const line = headers
        .map((h) => {
          let v = r[h];
          if (h === "timestamp") v = formatDate(v);
          if (v === undefined || v === null) v = "";
          v = String(v).replace(/"/g, '""');
          if (v.includes(",") || v.includes("\n")) v = `"${v}"`;
          return v;
        })
        .join(",");
      csv += line + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cloud_waitlist.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Admin — Cloud Waitlist
          </h1>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {user.email}
                </span>
                <Button variant="secondary" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={handleSignIn}>Sign in with Google</Button>
            )}
          </div>
        </div>

        {/* Not signed in */}
        {!user && (
          <Card className="p-6">
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Please sign in with your project’s Google account to access
                waitlist data.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Access denied */}
        {user && !authorized && (
          <Card className="p-6 border-red-300 bg-red-50 dark:bg-gray-800">
            <CardContent>
              <p className="text-sm text-red-600 dark:text-red-400">
                {error || "Access denied. Only authorized admins may view this page."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Waitlist data */}
        {user && authorized && (
          <>
            <div className="flex gap-2 mb-4">
              <Button onClick={loadRows} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
              <Button
                variant="secondary"
                onClick={exportCSV}
                disabled={!rows.length}
              >
                Export CSV
              </Button>
            </div>

            {error && (
              <div className="text-red-500 mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="overflow-x-auto rounded shadow-sm">
              <table className="min-w-full table-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <thead className="bg-indigo-50 dark:bg-gray-800">
                  <tr className="text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Organization</th>
                    <th className="px-4 py-3">Interest</th>
                    <th className="px-4 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-indigo-50/30 dark:hover:bg-gray-800/60 transition"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {r.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {r.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {r.organization || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {r.interest || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {formatDate(r.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
