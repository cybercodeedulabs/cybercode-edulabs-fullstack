// src/pages/Payment.jsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import useUserData from "../hooks/useUserData";
import { motion } from "framer-motion";

export default function Payment() {
  const { user } = useUser();
  const { grantCertificationAccess, grantServerAccess } = useUserData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paymentType = searchParams.get("type"); // "certification" or "server"

  const handlePaymentSuccess = async () => {
    if (!user) return;

    try {
      if (paymentType === "certification") {
        await grantCertificationAccess();
        alert("✅ Certification access unlocked!");
      } else if (paymentType === "server") {
        await grantServerAccess();
        alert("✅ Server access activated!");
      } else {
        alert("❌ Unknown payment type.");
      }

      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      console.error(err);
      alert("❌ Payment processing failed. Try again.");
    }
  };

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

  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-20 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">
        {paymentType === "certification"
          ? "Certification Payment"
          : "Server Access Payment"}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        Click below to simulate a successful payment for{" "}
        <strong>
          {paymentType === "certification"
            ? "Certification Access"
            : "1-Year Server Access"}
        </strong>.
      </p>

      <button
        onClick={handlePaymentSuccess}
        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow transition"
      >
        ✅ Complete Payment
      </button>
    </motion.div>
  );
}
