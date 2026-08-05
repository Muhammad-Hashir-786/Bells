import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BellMark, IconBag, IconClose, IconMenu, IconSearch, IconUser } from "./Icons.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { CATEGORY_META } from "../data/categories.js";
import "./Header.css";

const NAV_LINKS = [
  { to: "/shop", label: "Shop" },
  ...CATEGORY_META.map((c) => ({ to: `/shop?category=${c.slug}`, label: c.name })),
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [navigate]);

  function handleSearch(e) {
    e.preventDefault();
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
    setSearchOpen(false);
    setQuery("");
  }

  async function handleLogout() {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="announce-bar">
        Free shipping on orders over $75 &nbsp;·&nbsp; Ends of season sale, up to 25% off
      </div>

      <div className="container header-row">
        <button
          className="header-icon-btn nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>

        <NavLink to="/" className="brand" aria-label="Bells home">
          <BellMark size={26} />
          <span className="brand-word">Bells</span>
        </NavLink>

        <nav className={`main-nav ${open ? "main-nav--open" : ""}`} aria-label="Primary">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink to={link.to} className={({ isActive }) => (isActive ? "active" : undefined)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="header-icon-btn" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
            <IconSearch />
          </button>

          {user ? (
            <div className="user-menu-wrapper">
              <button
                className="header-icon-btn user-menu-toggle"
                aria-label={`Account: ${user.name}`}
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((v) => !v)}
              >
                <IconUser />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-name">{user.name}</div>
                  <NavLink to="/profile" onClick={() => setUserMenuOpen(false)}>
                    My Account
                  </NavLink>
                  <button className="user-dropdown-logout" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="header-icon-btn" aria-label="Sign in">
              <IconUser />
            </NavLink>
          )}

          <NavLink to="/cart" className="header-icon-btn cart-btn" aria-label={`Cart, ${count} items`}>
            <IconBag />
            {count > 0 && <span className="cart-count">{count}</span>}
          </NavLink>
        </div>
      </div>

      {searchOpen && (
        <div className="search-panel">
          <form className="container search-form" onSubmit={handleSearch}>
            <IconSearch />
            <input
              autoFocus
              type="search"
              placeholder="Search clothes, gym gear, furniture…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn--primary btn--sm">Search</button>
          </form>
        </div>
      )}
    </header>
  );
}