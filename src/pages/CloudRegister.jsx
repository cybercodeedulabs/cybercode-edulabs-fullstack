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

  // 🔹 NEW FIELDS
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (
      !email.trim() ||
      !password.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !state.trim() ||
      !country.trim() ||
      !pincode.trim()
    ) {
      return setErr("All fields are required");
    }

    if (password.length < 6) {
      return setErr("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      await registerIAMUser({
        registrationType: "individual",
        email: email.trim().toLowerCase(),
        password,
        phone,
        city,
        state,
        country,
        pincode,
      });

      navigate("/cloud/dashboard");
    } catch (error) {
      setErr(error.message || error.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Card className="p-6 bg-white/5 border border-slate-800">
          <CardContent>
            <h2 className="text-xl font-semibold text-white mb-4">
              Create Cloud Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm text-slate-300">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-slate-300">Password</label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-slate-300">Phone</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="text-sm text-slate-300">City</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  type="text"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="text-sm text-slate-300">State</label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  type="text"
                  required
                />
              </div>

              {/* Country */}
              <div>
                <label className="text-sm text-slate-300">Country</label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  type="text"
                  required
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="text-sm text-slate-300">Pincode</label>
                <Input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  type="text"
                  required
                />
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
                    setPhone("");
                    setCity("");
                    setState("");
                    setCountry("");
                    setPincode("");
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
