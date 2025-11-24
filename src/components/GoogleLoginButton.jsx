// src/components/GoogleLoginButton.jsx
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

export default function GoogleLoginButton() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const gUser = result.user;

      console.log("✅ Google Login Successful:", gUser);

      const userData = {
        name: gUser.displayName,
        email: gUser.email,
        photo: gUser.photoURL,
        uid: gUser.uid,
      };

      // Store locally
      localStorage.setItem("cybercodeUser", JSON.stringify(userData));
      setUser(userData);

      // Redirect if something previously stored wanted login
      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/dashboard";

      sessionStorage.removeItem("redirectAfterLogin");

      navigate(redirectPath);
    } catch (error) {
      // Prevent false login-failed alerts
      console.warn("⚠ Google login popup warning (ignored):", error.message);

      // Real failure detection
      if (
        !auth.currentUser &&                     // No user authenticated
        !localStorage.getItem("cybercodeUser")   // Nothing saved
      ) {
        console.error("❌ REAL Google Login Failure:", error);
        alert("Google Sign-In failed. Please try again.");
      }
    }
  };

  return (
    <motion.button
      onClick={handleLogin}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center justify-center gap-3 px-6 py-3 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                 border border-gray-300 dark:border-gray-700 
                 rounded-xl shadow-md hover:shadow-lg 
                 hover:bg-gray-50 dark:hover:bg-gray-700 
                 transition-all duration-200"
    >
      <img src="/images/google.svg" alt="Google" className="w-5 h-5" />
      <span className="text-sm md:text-base font-medium">
        Sign in with Google
      </span>
    </motion.button>
  );
}
