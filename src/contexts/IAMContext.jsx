// src/contexts/IAMContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";

const IAMContext = createContext();

const USE_FIREBASE = import.meta.env.VITE_USE_FIRESTORE === "true";

export const IAMProvider = ({ children }) => {
  const [iamUser, setIamUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("iamUser");
    if (storedUser) {
      setIamUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // -------------------------------------------------------
  // LOCAL FALLBACK STORAGE KEY
  // -------------------------------------------------------
  const LOCAL_IAM_KEY = "iam_users_local_v1";

  const loadLocalUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_IAM_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveLocalUsers = (users) => {
    localStorage.setItem(LOCAL_IAM_KEY, JSON.stringify(users));
  };

  // -------------------------------------------------------
  // REGISTER IAM USER
  // -------------------------------------------------------
  const registerIAMUser = async ({ email, password, role }) => {
    try {
      if (USE_FIREBASE) {
        // FIREBASE MODE (original logic)
        const q = query(collection(db, "iam_users"), where("email", "==", email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          throw new Error("User already exists with this email.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRef = await addDoc(collection(db, "iam_users"), {
          email,
          password: hashedPassword,
          role: role || "developer",
          createdAt: new Date(),
        });

        return { id: userRef.id, email, role };
      }

      // ---------------------------------------------------
      // LOCAL MODE (Firestore disabled)
      // ---------------------------------------------------
      const users = loadLocalUsers();
      const exists = users.find((u) => u.email === email);
      if (exists) {
        throw new Error("User already exists with this email.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        id: `${Date.now()}-${Math.random()}`,
        email,
        password: hashedPassword,
        role: role || "developer",
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveLocalUsers(users);

      return { id: newUser.id, email, role: newUser.role };
    } catch (error) {
      console.error("IAM registration error:", error);
      throw error;
    }
  };

  // -------------------------------------------------------
  // LOGIN IAM USER
  // -------------------------------------------------------
  const loginIAMUser = async ({ email, password }) => {
    try {
      if (USE_FIREBASE) {
        // FIREBASE MODE (original logic)
        const q = query(collection(db, "iam_users"), where("email", "==", email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          throw new Error("Invalid email or password.");
        }

        const userData = snapshot.docs[0].data();
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
          throw new Error("Invalid email or password.");
        }

        const user = {
          id: snapshot.docs[0].id,
          email: userData.email,
          role: userData.role,
        };

        setIamUser(user);
        localStorage.setItem("iamUser", JSON.stringify(user));
        return user;
      }

      // ---------------------------------------------------
      // LOCAL MODE (Firestore disabled)
      // ---------------------------------------------------
      const users = loadLocalUsers();
      const found = users.find((u) => u.email === email);

      if (!found) {
        throw new Error("Invalid email or password.");
      }

      const passwordMatch = await bcrypt.compare(password, found.password);
      if (!passwordMatch) {
        throw new Error("Invalid email or password.");
      }

      const user = {
        id: found.id,
        email: found.email,
        role: found.role,
      };

      setIamUser(user);
      localStorage.setItem("iamUser", JSON.stringify(user));

      return user;
    } catch (error) {
      console.error("IAM login error:", error);
      throw error;
    }
  };

  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------
  const logoutIAM = () => {
    setIamUser(null);
    localStorage.removeItem("iamUser");
  };

  // -------------------------------------------------------
  // GET USER ROLE BY ID
  // -------------------------------------------------------
  const getUserRole = async (userId) => {
    try {
      if (USE_FIREBASE) {
        // FIREBASE MODE
        const docRef = doc(db, "iam_users", userId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          return snapshot.data().role;
        }
        return null;
      }

      // LOCAL MODE
      const users = loadLocalUsers();
      const found = users.find((u) => u.id === userId);
      return found?.role || null;
    } catch (error) {
      console.error("Error fetching role:", error);
      return null;
    }
  };

  return (
    <IAMContext.Provider
      value={{
        iamUser,
        loading,
        registerIAMUser,
        loginIAMUser,
        logoutIAM,
        getUserRole,
      }}
    >
      {children}
    </IAMContext.Provider>
  );
};

export const useIAM = () => useContext(IAMContext);
