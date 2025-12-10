// src/pages/AuthCallback.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useUser();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const credential = params.get("credential"); // Google Identity redirect token
        const state = params.get("state");

        // Default redirect target
        let redirectTo = "/dashboard";

        // Priority 1: state param (if any and valid JSON)
        if (state) {
          try {
            // Some flows may encode state as base64; try both JSON and base64 JSON
            try {
              const parsed = JSON.parse(state);
              if (parsed?.redirect) redirectTo = parsed.redirect;
            } catch {
              // try base64 decode then parse
              const b = atob(state);
              const parsed = JSON.parse(b);
              if (parsed?.redirect) redirectTo = parsed.redirect;
            }
          } catch (_) {
            // ignore parse errors
          }
        }

        // Priority 2: sessionStorage fallback
        const fallback = sessionStorage.getItem("redirectAfterLogin");
        if (fallback) {
          try {
            redirectTo = fallback;
            // clear it so it doesn't persist
            sessionStorage.removeItem("redirectAfterLogin");
          } catch {}
        }

        // No credential — cannot log in
        if (!credential) {
          console.error("No Google credential found in redirect.");
          navigate("/register");
          return;
        }

        // Robust JWT decode with padding
        const decodeJwt = (token) => {
          try {
            if (!token || typeof token !== "string") return {};
            const parts = token.split(".");
            if (parts.length < 2) return {};
            let base64Url = parts[1];
            base64Url = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const pad = base64Url.length % 4 === 0 ? "" : "=".repeat(4 - (base64Url.length % 4));
            const base64 = base64Url + pad;
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
            );
            return JSON.parse(jsonPayload);
          } catch (err) {
            console.error("decodeJwt failed:", err);
            return {};
          }
        };

        const payload = decodeJwt(credential);

        const userData = {
          uid: payload.sub ? `google-${payload.sub}` : `local-${Date.now()}`,
          name: payload.name || "",
          email: payload.email || "",
          photo: payload.picture || "/images/default-avatar.png",
          googleToken: credential,
        };

        // Complete login → backend issues JWT → UserContext hydrates
        await loginWithGoogle(userData);

        // Redirect after successful login
        navigate(redirectTo, { replace: true });
      } catch (err) {
        console.error("AuthCallback error:", err);
        navigate("/register");
      }
    };

    run();
  }, [loginWithGoogle, navigate]);

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
      <h2 className="text-xl font-semibold mb-4">Signing you in…</h2>
      <p className="text-sm opacity-80">Please wait while we complete your login.</p>
    </section>
  );
}
