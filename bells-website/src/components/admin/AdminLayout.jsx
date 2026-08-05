import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BellMark, IconPlus, IconUser } from "../Icons.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <BellMark size={24} />
          <span className="admin-brand-word">Bells</span>
          <span className="admin-brand-tag">Admin</span>
        </div>

        <nav className="admin-nav" aria-label="Admin">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : undefined)}>
            Products
          </NavLink>
          <NavLink to="/admin/products/new" className={({ isActive }) => (isActive ? "active" : undefined)}>
            <IconPlus /> Add Product
          </NavLink>
        </nav>

        <div className="admin-sidebar-foot">
          <div className="admin-account">
            <span className="admin-account-icon"><IconUser /></span>
            <span className="admin-account-email">{admin?.email}</span>
          </div>
          <button className="btn btn--outline-light btn--sm btn--block" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
