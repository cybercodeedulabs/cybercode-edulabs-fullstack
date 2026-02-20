// src/contexts/IAMContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * IAMContext — Cloud IAM Authentication (Postgres + JWT)
 * Backend routes:
 *   POST /api/iam/register
 *   POST /api/iam/login
 *   GET  /api/iam/me
 */

const IAMContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "c3_iam_token";
const USER_KEY = "c3_iam_user";

export const IAMProvider = ({ children }) => {
  const [iamUser, setIamUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  /** Load token + cached user on mount */
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);

    if (!token || !rawUser) {
      setIamUser(null);
      setLoading(false);
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(rawUser);
      setIamUser(parsed);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setIamUser(null);
      setLoading(false);
      setHydrated(true);
      return;
    }

    // Validate token with backend
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/iam/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const js = await res.json();
          const safeUser = {
            ...js.user,
            role: js.user?.role || "developer",
          };

          localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
          setIamUser(safeUser);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setIamUser(null);
        }
      } catch (e) {
        console.error("IAM /me error:", e);
      } finally {
        setLoading(false);
        setHydrated(true);
      }
    })();
  }, []);

  /** REGISTER */
/** REGISTER */
const registerIAMUser = async (payload) => {
  const res = await fetch(`${API_BASE}/api/iam/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // 🔥 send full payload
  });

  const js = await res.json();
  if (!res.ok) throw new Error(js.error || "Registration failed");

  const safeUser = {
    ...js.user,
    role: js.user?.role || payload.role || "developer",
  };

  localStorage.setItem(TOKEN_KEY, js.token);
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
  setIamUser(safeUser);

  return safeUser;
};


  /** LOGIN */
  const loginIAMUser = async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/api/iam/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const js = await res.json();
    if (!res.ok) throw new Error(js.error || "Login failed");

    const safeUser = {
      ...js.user,
      role: js.user?.role || "developer",
    };

    localStorage.setItem(TOKEN_KEY, js.token);
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
    setIamUser(safeUser);

    return safeUser;
  };

  /** LOGOUT */
  const logoutIAM = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setIamUser(null);
  };

  /** Get token for API calls */
  const getToken = () => localStorage.getItem(TOKEN_KEY);

  return (
    <IAMContext.Provider
      value={{
        iamUser,
        loading,
        hydrated,
        loginIAMUser,
        registerIAMUser,
        logoutIAM,
        getToken,
      }}
    >
      {children}
    </IAMContext.Provider>
  );
};

export const useIAM = () => useContext(IAMContext);
