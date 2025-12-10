import React, { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { user, hydrated, applyToken } = useUser();

  // STEP 1: Save token using applyToken()
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      navigate("/register?error=no_token", { replace: true });
      return;
    }

    applyToken(token); // ✅ This updates state + localStorage correctly
  }, []);

  // STEP 2: Redirect only AFTER hydration + user load
  useEffect(() => {
    if (!hydrated) return;

    if (user && user.uid) {
      navigate("/dashboard", { replace: true });
    }
  }, [hydrated, user]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center text-gray-500 text-lg">
      Finalizing login…
    </div>
  );
}
