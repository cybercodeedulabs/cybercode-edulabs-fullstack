// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function EditProfile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    about: "",
    photo: "",
  });

  const [uploading, setUploading] = useState(false);

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
  // UPLOAD PROFILE PHOTO
  // ==========================
  const handlePhotoUpload = async (e) => {
    if (!user) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const storageRef = ref(storage, `profiles/${user.uid}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    setForm((prev) => ({ ...prev, photo: url }));
    setUploading(false);
  };

  // ==========================
  // SAVE PROFILE
  // ==========================
  const saveProfile = async () => {
    if (!user) return;

    const refUser = doc(db, "users", user.uid);

    await updateDoc(refUser, {
      name: form.name,
      phone: form.phone,
      role: form.role,
      about: form.about,
      photo: form.photo,
    });

    setUser({ ...user, ...form });

    navigate("/dashboard");
  };

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

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={form.photo}
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-md"
          />

          <label className="mt-4 text-sm font-medium bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            {uploading ? "Uploading..." : "Change Photo"}
            <input type="file" hidden onChange={handlePhotoUpload} />
          </label>
        </div>

        {/* Form */}
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
