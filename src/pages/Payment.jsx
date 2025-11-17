// src/pages/Payment.jsx
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function Payment() {
  const { user, activatePremium } = useUser();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-6">Please login to make payments.</p>
        <button
          onClick={() => navigate("/register")}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleFakeRazorpayPayment = () => {
    // 🔥 TEST MODE: No money, no real Razorpay needed
    alert("🧪 Simulated Razorpay Test Payment Successful!");
    activatePremium(); // ⭐ unlock premium
    navigate("/dashboard");
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-20 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">Premium Upgrade</h1>

      <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
        Upgrade to <strong>Premium</strong> and unlock certificates, cloud labs,
        server access, and exclusive project resources.
      </p>

      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-3">₹499 / One-Time</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          (This is a test payment page — no money will be deducted)
        </p>
      </div>

      <button
        onClick={handleFakeRazorpayPayment}
        className="px-10 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg transition"
      >
        🚀 Simulate Razorpay Payment
      </button>
    </motion.div>
  );
}
