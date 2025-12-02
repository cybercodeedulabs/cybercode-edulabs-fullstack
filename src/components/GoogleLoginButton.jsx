// src/components/GoogleLoginButton.jsx
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";

const USE_FIREBASE = import.meta.env.VITE_USE_FIRESTORE === "true";

export default function GoogleLoginButton() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // -------------------------------------------------------
      // FIREBASE MODE
      // -------------------------------------------------------
      if (USE_FIREBASE) {
        const result = await signInWithPopup(auth, provider);
        const u = result.user;

        const userData = {
          name: u.displayName,
          email: u.email,
          photo: u.photoURL,
          uid: u.uid,
        };

        localStorage.setItem("cybercodeUser", JSON.stringify(userData));
        setUser(userData);

        const redirectPath =
          sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
        sessionStorage.removeItem("redirectAfterLogin");

        return navigate(redirectPath);
      }

      // -------------------------------------------------------
      // LOCAL MODE (FIREBASE OFF)
      // Create local “fake Google user”
      // -------------------------------------------------------
      const dummyUser = {
        name: "Google User",
        email: "google-user@example.com",
        photo: "/images/google.svg", // keep your image
        uid: `local-google-${Date.now()}`,
      };

      localStorage.setItem("cybercodeUser", JSON.stringify(dummyUser));
      setUser(dummyUser);

      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");

      return navigate(redirectPath);
    } catch (error) {
      console.error("Google Login Failed:", error);
      alert("Google Sign-In is temporarily unavailable.");
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
