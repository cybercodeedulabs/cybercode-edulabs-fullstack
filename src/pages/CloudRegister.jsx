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

  const [registrationType, setRegistrationType] = useState("individual");

  // Common
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Location
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");

  // Organization-specific
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("university");
  const [orgEmail, setOrgEmail] = useState("");
  const [requestedUserCount, setRequestedUserCount] = useState(50);
  const [requestedCpuQuota, setRequestedCpuQuota] = useState(20);
  const [requestedStorageQuota, setRequestedStorageQuota] = useState(100);
  const [requestedInstanceQuota, setRequestedInstanceQuota] = useState(50);
  const [requestedSubscriptionMonths, setRequestedSubscriptionMonths] = useState(12);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!password || password.length < 6) {
      return setErr("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      if (registrationType === "individual") {
        if (
          !email || !phone || !city || !state || !country || !pincode
        ) {
          setLoading(false);
          return setErr("All fields are required");
        }

        await registerIAMUser({
          registrationType: "individual",
          email: email.toLowerCase().trim(),
          password,
          phone,
          city,
          state,
          country,
          pincode,
        });
      } else {
        if (
          !organizationName ||
          !orgEmail ||
          !email ||
          !phone ||
          !city ||
          !state ||
          !country ||
          !pincode ||
          !requestedSubscriptionMonths
        ) {
          setLoading(false);
          return setErr("All fields are required");
        }

        await registerIAMUser({
          registrationType: "organization",
          organizationName,
          organizationType,
          orgEmail,
          phone,
          city,
          state,
          country,
          pincode,
          requested_user_count: Number(requestedUserCount),
          requested_cpu_quota: Number(requestedCpuQuota),
          requested_storage_quota: Number(requestedStorageQuota),
          requested_instance_quota: Number(requestedInstanceQuota),
          requested_subscription_months: Number(requestedSubscriptionMonths),
          email: email.toLowerCase().trim(), // admin email
          password,
        });
      }

      navigate("/cloud/dashboard");
    } catch (error) {
      setErr(error.message || error.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Card className="p-6 bg-white/5 border border-slate-800">
          <CardContent>
            <h2 className="text-xl font-semibold text-white mb-6">
              Create Cloud Account
            </h2>

            {/* Toggle */}
            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                variant={registrationType === "individual" ? "default" : "ghost"}
                onClick={() => setRegistrationType("individual")}
              >
                Individual
              </Button>
              <Button
                type="button"
                variant={registrationType === "organization" ? "default" : "ghost"}
                onClick={() => setRegistrationType("organization")}
              >
                Organization
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {registrationType === "organization" && (
                <>
                  <Input
                    placeholder="Organization Name"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                  <select
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                    value={organizationType}
                    onChange={(e) => setOrganizationType(e.target.value)}
                  >
                    <option value="university">University</option>
                    <option value="college">College</option>
                    <option value="startup">Startup</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                  <Input
                    placeholder="Organization Email (professional)"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                  />

                  {/* NEW: Subscription Duration */}
                  <select
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
                    value={requestedSubscriptionMonths}
                    onChange={(e) => setRequestedSubscriptionMonths(e.target.value)}
                  >
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                    <option value={24}>24 Months</option>
                  </select>
                </>
              )}

              <Input
                placeholder={registrationType === "organization" ? "Admin Email" : "Email"}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
              <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
              <Input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />

              {registrationType === "organization" && (
                <>
                  <Input
                    type="number"
                    placeholder="Requested User Count"
                    value={requestedUserCount}
                    onChange={(e) => setRequestedUserCount(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Requested CPU Quota"
                    value={requestedCpuQuota}
                    onChange={(e) => setRequestedCpuQuota(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Requested Storage Quota (GB)"
                    value={requestedStorageQuota}
                    onChange={(e) => setRequestedStorageQuota(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Requested Instance Quota"
                    value={requestedInstanceQuota}
                    onChange={(e) => setRequestedInstanceQuota(e.target.value)}
                  />
                </>
              )}

              {err && <div className="text-sm text-rose-400">{err}</div>}

              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
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