// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PERSONAS_LIST } from "../utils/personaEngine";

export default function EditProfile() {
  const { user, setUser, getTopPersona } = useUser();
  const navigate = useNavigate();

  const topPersona =
    typeof getTopPersona === "function" ? getTopPersona() : null;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    about: "",
    photo: "",
  });

  const [uploading, setUploading] = useState(false);

  // Prefill form with existing user data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        role: user.role || "",
        about: user.about || "",
        photo: user.photo || "/images/default-avatar.png",
      });
    }
  }, [user]);

  const updateField = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ==========================
  // 📌 Upload Profile Photo
  // ==========================
  const handlePhotoUpload = async (e) => {
    if (!user) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const storageRef = ref(storage, `profiles/${user.uid}.jpg`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Update local form
      setForm((prev) => ({ ...prev, photo: url }));

      // Update Firestore immediately
      await setDoc(
        doc(db, "users", user.uid),
        { photo: url, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (error) {
      console.error("Photo upload failed:", error);
    }

    setUploading(false);
  };

  // ==========================
  // 📌 Save Profile
  // ==========================
  const saveProfile = async () => {
    if (!user) return;

    const refUser = doc(db, "users", user.uid);

    try {
      await setDoc(
        refUser,
        {
          name: form.name,
          phone: form.phone,
          role: form.role,
          about: form.about,
          photo: form.photo,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // Update local context
      setUser({ ...user, ...form });

      navigate("/dashboard");
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  // Profile Completion %
  const fields = ["name", "phone", "role", "about", "photo"];
  const filled = fields.filter((f) => form[f] && form[f] !== "").length;
  const percent = Math.round((filled / fields.length) * 100);

  return (
    <motion.div
      className="min-h-screen px-6 py-14 bg-gray-100 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">

        {/* Header */}
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
          Edit Your Profile
        </h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={form.photo}
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 dark:border-indigo-400 shadow-md"
          />

          <label className="mt-4 text-sm font-medium bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            {uploading ? "Uploading..." : "Change Photo"}
            <input type="file" hidden onChange={handlePhotoUpload} />
          </label>
        </div>

        {/* Persona Block */}
        {topPersona && (
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-4 rounded-xl mb-8">
            <p className="text-sm text-indigo-500 font-semibold">
              Your Learning Persona
            </p>
            <p className="text-lg font-bold mt-1 text-gray-900 dark:text-gray-100">
              {PERSONAS_LIST[topPersona.persona]}
            </p>
          </div>
        )}

        {/* FORM FIELDS */}
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={updateField}
              className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Role / Profession</label>
            <input
              name="role"
              value={form.role}
              onChange={updateField}
              className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium">About You</label>
            <textarea
              name="about"
              value={form.about}
              onChange={updateField}
              className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-md min-h-[120px]"
            />
          </div>
        </div>

        {/* Profile Meter */}
        <div className="mt-6">
          <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
            Profile Completion
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 font-semibold">{percent}% Completed</p>
        </div>

        {/* Save Button */}
        <button
          onClick={saveProfile}
          className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg text-lg font-semibold transition"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}
