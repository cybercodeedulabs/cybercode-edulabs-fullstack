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
      const user = result.user;
      console.log("User logged in:", user);
      setUser(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
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
      <img
        src="/src/assets/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span className="text-sm md:text-base font-medium">
        Sign in with Google
      </span>
    </motion.button>
  );
}
