import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function GoogleLoginButton() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User logged in:", user);
      setUser(user); // ✅ Global state update
      navigate("/dashboard"); // ✅ Redirect to dashboard after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 rounded-lg shadow transition"
    >
      <img src="/src/assets/google.svg" alt="Google" className="w-5 h-5" />
      <span className="text-sm font-medium">Sign in with Google</span>
    </button>
  );
}
