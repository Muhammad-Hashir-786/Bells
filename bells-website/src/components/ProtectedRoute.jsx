import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", color: "var(--text-on-navy-muted)" }}>
        Loading…
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin/login" replace />;

  return <Outlet />; // renders whatever nested admin route matched
}