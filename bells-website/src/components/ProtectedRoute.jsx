import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

export default function ProtectedRoute() {
  const { admin, loading } = useAdminAuth();

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