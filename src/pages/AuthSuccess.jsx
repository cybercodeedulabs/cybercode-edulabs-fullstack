import React, { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { applyToken } = useUser();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      navigate("/register?error=no_token", { replace: true });
      return;
    }

    // 1️⃣ Save token (state + localStorage)
    applyToken(token);

    // 2️⃣ Clean URL (remove token from address bar)
    window.history.replaceState({}, document.title, "/dashboard");

    // 3️⃣ Redirect immediately
    navigate("/dashboard", { replace: true });
  }, [applyToken, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center text-gray-500 text-lg">
      Finalizing login…
    </div>
  );
}
