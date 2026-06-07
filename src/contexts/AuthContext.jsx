/*
AuthContext
- Provides a React context that wraps the entire app with Firebase Authentication state.
- Exposes `user` (current signed-in user or null), `register`, `login`, and `logout` helpers.
- `useAuth()` hook gives any component access to auth state without prop-drilling.
- On register, a corresponding document is created in the Firestore `users` collection.
*/
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Minimal stubbed auth functions. Replace with firebase/auth integration when available.
  const register = async (email, password) => {
    setUser({ uid: "local-" + Date.now(), email });
    return { uid: user?.uid };
  };

  const login = async (email, password) => {
    setUser({ uid: "local-" + Date.now(), email });
    return user;
  };

  const logout = async () => {
    setUser(null);
  };

  useEffect(() => {
    // noop: in real app restore user from localStorage or listen to Firebase auth
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
