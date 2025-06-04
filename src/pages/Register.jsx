import GoogleLoginButton from "../components/GoogleLoginButton";
import { useState } from "react";

export default function Register() {
  const [user, setUser] = useState(null);

  return (
    <div className="max-w-xl mx-auto mt-20 text-center space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Register with Cybercode EduLabs
      </h1>

      {user ? (
        <p className="text-lg text-green-600 dark:text-green-400">
          ✅ Welcome, {user.displayName}!
        </p>
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-300">
            Sign up using your Google account to access courses and your dashboard.
          </p>
          <GoogleLoginButton onLogin={setUser} />
        </>
      )}
    </div>
  );
}
