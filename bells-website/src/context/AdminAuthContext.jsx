import { createContext, useContext, useEffect, useState } from "react";
const AdminAuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Separate from AuthContext on purpose: admins and customers are different
// principals (different Mongo collections, different cookies — "token" vs
// "userToken", different endpoints — /api/auth/* vs /api/auth/user/*).
// Reusing the customer context here was the bug: it meant admin login was
// silently calling the customer login endpoint and admin state never existed.
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    setAdmin(data.admin);
    return data;
  }

  async function logout() {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAdmin(null);
  }

  const value = { admin, loading, login, logout, checkAuth };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
