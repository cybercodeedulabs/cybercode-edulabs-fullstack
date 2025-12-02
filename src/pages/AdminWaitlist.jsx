// src/pages/AdminWaitlist.jsx
import React, { useEffect, useState } from "react";
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, provider } from "../firebase";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const USE_FIREBASE = import.meta.env.VITE_USE_FIRESTORE === "true";
const LOCAL_WAITLIST_KEY = "cloud_waitlist_local_v1";
const LOCAL_ADMIN_KEY = "local_admin_user_v1";

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
  const [user, setUser] = useState(
    USE_FIREBASE ? auth.currentUser : JSON.parse(localStorage.getItem(LOCAL_ADMIN_KEY))
  );
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [diagnostic, setDiagnostic] = useState(null);

  const ALLOWED_ADMINS = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // -------------------------------------------------------
  // FIREBASE AUTH LISTENER (disabled in local mode)
  // -------------------------------------------------------
  useEffect(() => {
    if (!USE_FIREBASE) return;

    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, [auth]);

  // -------------------------------------------------------
  // LOCAL MODE: SIGN IN (dummy admin login)
  // -------------------------------------------------------
  const localSignIn = () => {
    const adminUser = {
      email: ALLOWED_ADMINS[0] || "admin@local",
      name: "Local Admin",
      uid: "local-admin",
    };

    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminUser));
    setUser(adminUser);
  };

  const localSignOut = () => {
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setUser(null);
    setRows([]);
    setAuthorized(false);
  };

  // -------------------------------------------------------
  // FIREBASE SIGN-IN / SIGN-OUT
  // -------------------------------------------------------
  async function handleSignIn() {
    try {
      if (USE_FIREBASE) {
        await signInWithPopup(auth, provider);
      } else {
        localSignIn();
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Sign-in failed. Please try again.");
    }
  }

  async function handleSignOut() {
    try {
      if (USE_FIREBASE) {
        await signOut(auth);
      } else {
        localSignOut();
      }
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  }

  // -------------------------------------------------------
  // LOAD WAITLIST
  // -------------------------------------------------------
  async function loadRows() {
    setLoading(true);
    setError(null);
    setDiagnostic(null);

    try {
      if (USE_FIREBASE) {
        // FIREBASE MODE
        const q = query(collection(db, "cloud_waitlist"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);

        if (snap.empty) {
          setRows([]);
          setDiagnostic({
            type: "info",
            title: "No Data",
            message:
              "No waitlist entries found yet. Once users submit the form, data will appear here.",
          });
          setLoading(false);
          return;
        }

        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRows(data);
        setLoading(false);
        return;
      }

      // ---------------------------------------------------
      // LOCAL MODE
      // ---------------------------------------------------
      const local = JSON.parse(localStorage.getItem(LOCAL_WAITLIST_KEY)) || [];

      if (!local.length) {
        setRows([]);
        setDiagnostic({
          type: "info",
          title: "No Data",
          message:
            "No waitlist entries found yet. Once users submit the form, data will appear here.",
        });
        setLoading(false);
        return;
      }

      setRows(local);
    } catch (err) {
      console.error("Read error:", err);

      setDiagnostic({
        type: "error",
        title: "Unknown Error",
        message: "Something went wrong while loading data.",
      });

      setError("Unknown Error");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------
  // CHECK AUTHORIZED ADMIN
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // CSV EXPORT (no change)
  // -------------------------------------------------------
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
                Please sign in with your project’s Google account to access waitlist data.
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

        {/* Diagnostic panel */}
        {diagnostic && (
          <Card
            className={`p-5 mb-6 border-l-4 ${
              diagnostic.type === "warning"
                ? "border-yellow-500 bg-yellow-50 dark:bg-gray-800"
                : diagnostic.type === "error"
                ? "border-red-500 bg-red-50 dark:bg-gray-800"
                : "border-blue-500 bg-blue-50 dark:bg-gray-800"
            }`}
          >
            <CardContent>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                {diagnostic.title}
              </h3>
              <pre className="text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                {diagnostic.message}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Data table */}
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
