// src/pages/RegisterIAM.jsx
import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useIAM } from "../contexts/IAMContext";
import { motion } from "framer-motion";

const RegisterIAM = () => {
  const navigate = useNavigate();
  const { registerIAMUser } = useIAM();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const user = await registerIAMUser({
        email,
        password,
        phone,
        registrationType: "individual"
      });

      setSuccess("IAM user registered successfully!");
      setTimeout(() => navigate("/cloud/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md text-white"
      >
        <div className="text-center mb-6">
          <img
            src="/images/c3-logo.png"
            alt="C3 Cloud"
            className="mx-auto w-16 mb-3"
          />
          <h1 className="text-2xl font-semibold">Register IAM Account</h1>
          <p className="text-gray-400 text-sm mt-2">
            Create a secure IAM account to access C3 Cloud
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/30 p-2 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-400 text-sm bg-green-900/30 p-2 rounded-md">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-60 font-medium"
          >
            {loading ? "Registering..." : "Register IAM User"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an IAM account?{" "}
          <Link
            to="/cloud/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterIAM;