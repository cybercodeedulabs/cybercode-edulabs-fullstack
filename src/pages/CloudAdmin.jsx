import React, { useEffect, useState } from "react";
import { useIAM } from "../contexts/IAMContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export default function CloudAdmin() {
    const { iamUser, getToken } = useIAM();
    const navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_URL || "";

    const [organizations, setOrganizations] = useState([]);
    const [statusFilter, setStatusFilter] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState(null);

    // Edit state per organization
    const [editValues, setEditValues] = useState({});

    // 🔐 Role Guard
    useEffect(() => {
        if (!iamUser) return;
        if (iamUser.role !== "admin") {
            navigate("/cloud/dashboard");
        }
    }, [iamUser, navigate]);

    useEffect(() => {
        if (iamUser?.role === "admin") {
            fetchOrganizations();
        }
    }, [statusFilter, iamUser]);

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
    });

    async function fetchOrganizations() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${API_BASE}/api/admin/organizations?status=${statusFilter}`,
                { headers: authHeaders() }
            );

            if (!res.ok) throw new Error("Failed to fetch organizations");

            const js = await res.json();
            setOrganizations(js.organizations || []);

            // Initialize edit values
            const initialEdits = {};
            (js.organizations || []).forEach((org) => {
                initialEdits[org.id] = {
                    cpu: org.cpu_quota || 0,
                    storage: org.storage_quota || 0,
                    instances: org.instance_quota || 0,
                    extend: 0,
                };
            });
            setEditValues(initialEdits);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function approveOrg(id) {
        setProcessingId(id);
        setError("");

        try {
            const res = await fetch(
                `${API_BASE}/api/admin/organizations/${id}/approve`,
                {
                    method: "POST",
                    headers: authHeaders(),
                }
            );

            if (!res.ok) {
                const js = await res.json();
                throw new Error(js.error || "Approval failed");
            }

            await fetchOrganizations();
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessingId(null);
        }
    }

    async function updateOrg(id) {
        const values = editValues[id];

        try {
            const res = await fetch(
                `${API_BASE}/api/admin/organizations/${id}/update`,
                {
                    method: "POST",
                    headers: authHeaders(),
                    body: JSON.stringify({
                        cpu_quota: Number(values.cpu),
                        storage_quota: Number(values.storage),
                        instance_quota: Number(values.instances),
                        extend_months: Number(values.extend) || undefined,
                    }),
                }
            );

            if (!res.ok) {
                const js = await res.json();
                throw new Error(js.error || "Update failed");
            }

            await fetchOrganizations();
        } catch (err) {
            setError(err.message);
        }
    }

    async function suspendOrg(id) {
        try {
            const res = await fetch(
                `${API_BASE}/api/admin/organizations/${id}/suspend`,
                {
                    method: "POST",
                    headers: authHeaders(),
                }
            );

            if (!res.ok) {
                const js = await res.json();
                throw new Error(js.error || "Suspend failed");
            }

            await fetchOrganizations();
        } catch (err) {
            setError(err.message);
        }
    }

    async function reactivateOrg(id) {
        try {
            const res = await fetch(
                `${API_BASE}/api/admin/organizations/${id}/reactivate`,
                {
                    method: "POST",
                    headers: authHeaders(),
                }
            );

            if (!res.ok) {
                const js = await res.json();
                throw new Error(js.error || "Reactivate failed");
            }

            await fetchOrganizations();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">

            <header className="backdrop-blur-lg bg-slate-900/90 border-b border-slate-800 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold tracking-wide text-cyan-400">
                            C3 Super Admin Panel
                        </div>
                        <div className="text-xs text-slate-400">
                            Organization Governance & Control
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => navigate("/cloud/dashboard")}>
                        Back to Dashboard
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">

                {/* Filter Tabs */}
                <div className="flex gap-3">
                    {["pending", "approved"].map((s) => (
                        <Button
                            key={s}
                            variant={statusFilter === s ? "default" : "ghost"}
                            onClick={() => setStatusFilter(s)}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Button>
                    ))}
                </div>

                {loading && (
                    <Card className="p-6 bg-white/10 text-center">
                        Loading organizations...
                    </Card>
                )}

                {error && (
                    <div className="text-rose-400 text-sm">{error}</div>
                )}

                {!loading && organizations.length === 0 && (
                    <Card className="p-6 bg-white/10 text-center">
                        No organizations found.
                    </Card>
                )}

                <div className="grid gap-6">
                    {organizations.map((org) => (
                        <motion.div
                            key={org.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-6 bg-white/10 border border-slate-800">
                                <CardContent>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-cyan-300">
                                                {org.name}
                                            </h3>
                                            <div className="text-xs text-slate-400">
                                                Type: {org.type}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Status: {org.status}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Payment: {org.payment_status}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Subscription Ends: {org.subscription_end}
                                            </div>
                                        </div>

                                        {org.status === "pending" && (
                                            <Button
                                                disabled={processingId === org.id}
                                                onClick={() => approveOrg(org.id)}
                                            >
                                                {processingId === org.id ? "Approving..." : "Approve"}
                                            </Button>
                                        )}
                                    </div>

                                    {/* Editable Section for Approved Orgs */}
                                    {(org.status === "approved" || org.status === "suspended") && (
                                        <div className="mt-6 border-t border-slate-700 pt-4 space-y-4">

                                            <div className="grid grid-cols-4 gap-3">
                                                <input
                                                    type="number"
                                                    value={editValues[org.id]?.cpu ?? 0}
                                                    onChange={(e) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            [org.id]: {
                                                                ...prev[org.id],
                                                                cpu: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    className="p-2 bg-slate-900 border border-slate-700 rounded text-sm"
                                                    placeholder="CPU"
                                                />

                                                <input
                                                    type="number"
                                                    value={editValues[org.id]?.storage ?? 0}
                                                    onChange={(e) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            [org.id]: {
                                                                ...prev[org.id],
                                                                storage: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    className="p-2 bg-slate-900 border border-slate-700 rounded text-sm"
                                                    placeholder="Storage"
                                                />

                                                <input
                                                    type="number"
                                                    value={editValues[org.id]?.instances ?? 0}
                                                    onChange={(e) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            [org.id]: {
                                                                ...prev[org.id],
                                                                instances: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    className="p-2 bg-slate-900 border border-slate-700 rounded text-sm"
                                                    placeholder="Instances"
                                                />

                                                <input
                                                    type="number"
                                                    value={editValues[org.id]?.extend ?? 0}
                                                    onChange={(e) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            [org.id]: {
                                                                ...prev[org.id],
                                                                extend: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    className="p-2 bg-slate-900 border border-slate-700 rounded text-sm"
                                                    placeholder="Extend (months)"
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <Button onClick={() => updateOrg(org.id)}>
                                                    Update
                                                </Button>

                                                {org.status === "approved" && (
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => suspendOrg(org.id)}
                                                    >
                                                        Suspend
                                                    </Button>
                                                )}

                                                {org.status === "suspended" && (
                                                    <Button
                                                        onClick={() => reactivateOrg(org.id)}
                                                    >
                                                        Reactivate
                                                    </Button>
                                                )}
                                            </div>

                                        </div>
                                    )}

                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}