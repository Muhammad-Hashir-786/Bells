import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Profile.css";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="container page-loading">Loading…</div>;
  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="container profile-page">
      <h1>My Account</h1>
      <div className="profile-card">
        <div className="profile-field">
          <span className="profile-label">Name</span>
          <span className="profile-value">{user.name}</span>
        </div>
        <div className="profile-field">
          <span className="profile-label">Email</span>
          <span className="profile-value">{user.email}</span>
        </div>
        <button className="btn btn--secondary" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}