// src/pages/CloudLogin.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useIAM } from "../contexts/IAMContext";

export default function CloudLogin() {
  const { loginIAMUser } = useIAM();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (location.state && location.state.from) || "/cloud/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password.trim()) {
      setErr("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      await loginIAMUser({ email: email.trim(), password });
      navigate(redirectTo);
    } catch (error) {
      setErr(error.message || error.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-6 bg-white/5 border border-slate-800">
          <CardContent>
            <h2 className="text-xl font-semibold text-white mb-4">C3 Cloud Login</h2>

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

              {err && <div className="text-sm text-rose-400">{err}</div>}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>

            <div className="mt-4 text-sm text-slate-400">
              New here?{" "}
              <Link to="/cloud/register" className="text-cyan-300 cursor-pointer">
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
