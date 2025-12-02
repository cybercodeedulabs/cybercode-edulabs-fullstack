// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PERSONAS_LIST } from "../utils/personaEngine";

// 🔄 REPLACED lucide-react with Iconify
import { Icon } from "@iconify/react";

const USE_FIREBASE = import.meta.env.VITE_USE_FIRESTORE === "true";

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
  const [saving, setSaving] = useState(false);

  // Prefill existing user data
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
  // 📸 Upload Profile Photo
  // ==========================
  const handlePhotoUpload = async (e) => {
    if (!user) return;
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // -------------------------------------------------------
      // FIREBASE MODE
      // -------------------------------------------------------
      if (USE_FIREBASE) {
        const storageRef = ref(storage, `profiles/${user.uid}.jpg`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        setForm((prev) => ({ ...prev, photo: url }));

        await setDoc(
          doc(db, "users", user.uid),
          { photo: url, updatedAt: new Date().toISOString() },
          { merge: true }
        );

        setUploading(false);
        return;
      }

      // -------------------------------------------------------
      // LOCAL MODE (Firebase disabled)
      // -------------------------------------------------------
      const localUrl = URL.createObjectURL(file);

      setForm((prev) => ({ ...prev, photo: localUrl }));

      const updated = { ...user, photo: localUrl };
      setUser(updated);
      localStorage.setItem("cybercodeUser", JSON.stringify(updated));
    } catch (err) {
      console.error("Photo upload failed:", err);
    }

    setUploading(false);
  };

  // ==========================
  // 💾 SAVE PROFILE
  // ==========================
  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);

    try {
      if (USE_FIREBASE) {
        const refUser = doc(db, "users", user.uid);

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

        setUser({ ...user, ...form });

        setTimeout(() => navigate("/dashboard"), 500);
        setSaving(false);
        return;
      }

      // LOCAL MODE
      const updated = {
        ...user,
        name: form.name,
        phone: form.phone,
        role: form.role,
        about: form.about,
        photo: form.photo,
        updatedAt: new Date().toISOString(),
      };

      setUser(updated);
      localStorage.setItem("cybercodeUser", JSON.stringify(updated));

      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      console.error("Profile update failed:", err);
    }

    setSaving(false);
  };

  // Completion %
  const fields = ["name", "phone", "role", "about", "photo"];
  const filled = fields.filter((f) => form[f] && form[f] !== "").length;
  const percent = Math.round((filled / fields.length) * 100);

  return (
    <motion.div
      className="min-h-screen px-6 py-14 bg-gray-100 dark:bg-gray-900 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl">

        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">
          Edit Your Profile
        </h1>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <img
              src={form.photo}
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 dark:border-indigo-400 shadow-lg"
            />

            {/* UPDATED ICON HERE */}
            <label
              className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition"
              title="Upload new photo"
            >
              <Icon icon="mdi:camera" width="18" height="18" />
              <input type="file" hidden onChange={handlePhotoUpload} />
            </label>
          </div>

          {uploading && (
            <p className="text-sm text-indigo-500 mt-3">Uploading...</p>
          )}
        </div>

        {/* Persona Display */}
        {topPersona && (
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-4 rounded-xl mb-8 text-center">
            <p className="text-sm text-indigo-500 font-semibold">
              Your Learning Persona
            </p>
            <p className="text-xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {PERSONAS_LIST[topPersona.persona]}
            </p>
          </div>
        )}

        {/* FORM */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={updateField}
              className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Role / Profession</label>
            <input
              name="role"
              value={form.role}
              onChange={updateField}
              className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">About You</label>
            <textarea
              name="about"
              value={form.about}
              onChange={updateField}
              className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg min-h-[120px] focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Completion Meter */}
        <div className="mt-8">
          <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
            Profile Completion
          </p>

          <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          <p className="text-sm mt-2 font-semibold">{percent}% Completed</p>
        </div>

        {/* Save Button */}
        <button
          onClick={saveProfile}
          disabled={saving}
          className="mt-10 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg text-lg font-semibold transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}
