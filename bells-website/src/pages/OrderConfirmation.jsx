import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./OrderConfirmation.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function IconCheck(props) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`${API_URL}/orders/${id}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchOrder();
  }, [id]);

  if (error) {
    return (
      <div className="container confirmation-page">
        <p className="auth-error">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container confirmation-page">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="container confirmation-page">
      <div className="confirmation-badge">
        <IconCheck />
      </div>

      <h1>Order Confirmed</h1>
      <p className="confirmation-subtitle">
        Thank you — we've received your order and it's being prepared.
      </p>

      <div className="confirmation-card">
        <div className="confirmation-row confirmation-row--head">
          <span>Order</span>
          <span>#{order._id.slice(-8).toUpperCase()}</span>
        </div>
        <div className="confirmation-row">
          <span>Status</span>
          <span className="confirmation-status">{order.status}</span>
        </div>

        <div className="confirmation-items">
          {order.items.map((item) => (
            <div className="confirmation-item" key={item.product}>
              <img src={item.image} alt={item.name} />
              <div className="confirmation-item-info">
                <p>{item.name}</p>
                <span>Qty {item.qty}</span>
              </div>
              <span className="confirmation-item-price">
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="confirmation-totals">
          <div className="confirmation-row">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="confirmation-row">
            <span>Shipping</span>
            <span>${order.shippingFee.toFixed(2)}</span>
          </div>
          <div className="confirmation-row confirmation-row--total">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="confirmation-address">
          <h3>Shipping to</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          <p>{order.shippingAddress.phone}</p>
        </div>
      </div>

      <Link to="/" className="btn btn--primary">
        Continue shopping
      </Link>
    </div>
  );
}