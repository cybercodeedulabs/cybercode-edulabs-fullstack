// src/components/DashboardHome.jsx
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Server, Cloud, Layers, Shield } from "lucide-react";

const DashboardHome = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="p-6 text-gray-200">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-2">
          Welcome back, {user?.iamUsername || user?.name || "Cloud User"} 👋
        </h2>
        <p className="text-slate-400">
          Manage your Cybercode Cloud resources and explore real-time learning environments.
        </p>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="panel p-6 hover:scale-[1.02] transition">
          <Cloud className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Compute</h3>
          <p className="text-sm text-slate-400">
            Launch and manage your virtual cloud instances.
          </p>
        </div>

        <div className="panel p-6 hover:scale-[1.02] transition">
          <Layers className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Storage</h3>
          <p className="text-sm text-slate-400">
            Manage object storage and persistent volumes.
          </p>
        </div>

        <div className="panel p-6 hover:scale-[1.02] transition">
          <Server className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Database</h3>
          <p className="text-sm text-slate-400">
            Explore scalable database services with monitoring tools.
          </p>
        </div>

        <div className="panel p-6 hover:scale-[1.02] transition">
          <Shield className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
          <p className="text-sm text-slate-400">
            Configure IAM roles, policies, and secure environments.
          </p>
        </div>
      </div>

      {/* Quick Stats (placeholder for later analytics) */}
      <div className="panel p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">
          Cloud Resource Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-white">03</p>
            <p className="text-sm text-slate-400">Active Instances</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">1.2 TB</p>
            <p className="text-sm text-slate-400">Storage Used</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">05</p>
            <p className="text-sm text-slate-400">Databases</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">98 %</p>
            <p className="text-sm text-slate-400">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
