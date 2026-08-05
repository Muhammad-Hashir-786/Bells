import { useState } from "react";
import { Link } from "react-router-dom";
import { BellMark } from "./Icons.jsx";
import { CATEGORY_META } from "../data/categories.js";
import "./Footer.css";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-brand-mark">
            <BellMark size={26} />
            <span>Bells</span>
          </Link>
          <p>Considered clothing, gear, and furnishings for a life that rings true. Small-batch, built to keep.</p>

          <form className="newsletter" onSubmit={handleSubscribe}>
            <label htmlFor="footer-email" className="visually-hidden">Email address</label>
            {subscribed ? (
              <p className="newsletter-success">You're on the list — welcome to Bells.</p>
            ) : (
              <>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn--primary btn--sm">Join</button>
              </>
            )}
          </form>
        </div>

        <div className="footer-col">
          <h3>Shop</h3>
          <ul>
            {CATEGORY_META.map((c) => (
              <li key={c.slug}><Link to={`/shop?category=${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/contact">Store Locations</Link></li>
            <li><Link to="/contact">Trade Program</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Support</h3>
          <ul>
            <li><Link to="/contact">Shipping &amp; Returns</Link></li>
            <li><Link to="/contact">FAQ</Link></li>
            <li><Link to="/contact">Care Guides</Link></li>
            <li><Link to="/contact">Track an Order</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bells Home &amp; Living. All rights reserved.</p>
        <ul className="footer-legal">
          <li><Link to="/contact">Privacy Policy</Link></li>
          <li><Link to="/contact">Terms of Service</Link></li>
          <li><Link to="/contact">Accessibility</Link></li>
        </ul>
      </div>
    </footer>
  );
}
