// src/pages/CloudRegister.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useIAM } from "../contexts/IAMContext";

export default function CloudRegister() {
  const { registerIAMUser } = useIAM();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("developer");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password.trim()) return setErr("All fields required");
    if (password.length < 6) return setErr("Password must be at least 6 characters");

    setLoading(true);
    try {
      await registerIAMUser({ email: email.trim(), password, role });
      navigate("/cloud/dashboard");
    } catch (error) {
      setErr(error.message || error.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-6 bg-white/5 border border-slate-800">
          <CardContent>
            <h2 className="text-xl font-semibold text-white mb-4">
              Create Cloud Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-300">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Password</label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Role</label>
                <select
                  className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="developer">Developer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              {err && <div className="text-sm text-rose-400">{err}</div>}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create account"}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                    setRole("developer");
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>

            <div className="mt-4 text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/cloud/login" className="text-cyan-300 cursor-pointer">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
