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

// Create context
const IAMContext = createContext();

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

  // ✅ Register new IAM user
  const registerIAMUser = async ({ email, password, role }) => {
    try {
      // Check if user already exists
      const q = query(collection(db, "iam_users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        throw new Error("User already exists with this email.");
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      // Store in Firestore
      const userRef = await addDoc(collection(db, "iam_users"), {
        email,
        password: hashedPassword,
        role: role || "developer", // default role
        createdAt: new Date(),
      });

      return { id: userRef.id, email, role };
    } catch (error) {
      console.error("IAM registration error:", error);
      throw error;
    }
  };

  // ✅ Login IAM user
  const loginIAMUser = async ({ email, password }) => {
    try {
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
    } catch (error) {
      console.error("IAM login error:", error);
      throw error;
    }
  };

  // ✅ Logout IAM user
  const logoutIAM = () => {
    setIamUser(null);
    localStorage.removeItem("iamUser");
  };

  // ✅ Get user role info (useful for protected routes)
  const getUserRole = async (userId) => {
    try {
      const docRef = doc(db, "iam_users", userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data().role;
      } else {
        return null;
      }
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

// ✅ Custom hook for easier access
export const useIAM = () => useContext(IAMContext);
