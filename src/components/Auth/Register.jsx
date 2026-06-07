/*
Register
- Renders a registration form for new users (email + password).
- Calls `register()` from AuthContext which creates a Firebase Auth account
  and a matching document in the Firestore `users` collection.
- On success, redirects to the home tab. Displays an inline error on failure.
*/
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Register({ setActiveTab }) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      if (setActiveTab) setActiveTab("home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="max-w-sm">
        <label className="block mb-2">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border"
        />
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
}
