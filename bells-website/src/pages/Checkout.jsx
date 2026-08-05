import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function Checkout() {
    const { items, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const shippingFee = subtotal > 75 ? 0 : 5; // matches your "free shipping over $75" banner

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    items: items.map((i) => ({ productId: i._id, qty: i.qty })), // was i.id
                    shippingAddress: form,
                    shippingFee,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Order failed");

            clearCart();
            navigate(`/order-confirmation/${data.order._id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (items.length === 0) {
        return (
            <div className="container">
                <p>Your cart is empty.</p>
            </div>
        );
    }

    return (
        <div className="container checkout-page">
            <h1>Checkout</h1>

            <form onSubmit={handleSubmit} className="checkout-form">
                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input id="address" name="address" required value={form.address} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input id="city" name="city" required value={form.city} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input id="postalCode" name="postalCode" required value={form.postalCode} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input id="country" name="country" required value={form.country} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" name="phone" required value={form.phone} onChange={handleChange} />
                </div>

                <div className="checkout-summary">
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Shipping: ${shippingFee.toFixed(2)}</p>
                    <p><strong>Total: ${(subtotal + shippingFee).toFixed(2)}</strong></p>
                </div>

                <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
                    {submitting ? "Placing order…" : "Place Order"}
                </button>
            </form>
        </div>
    );
}