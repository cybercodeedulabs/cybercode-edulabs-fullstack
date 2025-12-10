// src/pages/AuthSuccess.jsx
import React, { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { user, hydrated } = useUser();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      navigate("/register?error=no_token", { replace: true });
      return;
    }

    // Save token (UserContext hydration will pick it up)
    try {
      localStorage.setItem("cybercode_token", JSON.stringify(token));
    } catch {}

    // Do NOT redirect yet.
    // Wait for hydration + profile loading.
  }, []);

  // After hydration, if user is ready → go dashboard
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
