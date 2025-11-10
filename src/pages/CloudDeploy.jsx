// src/pages/CloudDeploy.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAPI } from "../api/mockCloudAPI";

export default function CloudDeploy() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    plan: "student",
    image: "ubuntu",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Creating instance...");
    try {
      await mockAPI.createInstance(form);
      setMessage("Instance created successfully!");
      setTimeout(() => navigate("/cloud/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create instance. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          🚀 Deploy New Cloud Instance
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Instance Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., My DevOps Lab"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select Plan
            </label>
            <select
              name="plan"
              value={form.plan}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            >
              <option value="student">Student (Free)</option>
              <option value="edu">Edu Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Choose Image
            </label>
            <select
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            >
              <option value="ubuntu">Ubuntu</option>
              <option value="python">Python Environment</option>
              <option value="golang">Golang Workspace</option>
              <option value="devops">DevOps Toolkit</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Deploying..." : "Create Instance"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}

        <button
          onClick={() => navigate("/cloud/dashboard")}
          className="mt-6 w-full text-blue-600 hover:underline text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
