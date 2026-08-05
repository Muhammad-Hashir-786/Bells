import { useState } from "react";
import { Link } from "react-router-dom";
import { IconBag, IconMinus, IconPlus, IconTrash } from "../components/Icons.jsx";
import { useCart } from "../context/CartContext.jsx";
import "./Cart.css";

const FREE_SHIP_THRESHOLD = 75;

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart();
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState(null);

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : 8.5;
  const tax = subtotal * 0.0725;
  const total = subtotal + shipping + tax;

  function applyPromo(e) {
    e.preventDefault();
    if (!promo.trim()) return;
    setPromoMsg({ ok: false, text: "That code has expired or isn't recognized." });
  }

  if (items.length === 0) {
    return (
      <div className="container cart-empty">
        <IconBag width={44} height={44} />
        <h1>Your cart is empty</h1>
        <p>Everything you add will show up here — start with our new arrivals.</p>
        <Link to="/shop" className="btn btn--primary">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Your Cart</h1>
      <p className="cart-count-line">{items.reduce((s, i) => s + i.qty, 0)} item(s)</p>

      {remaining > 0 ? (
        <div className="ship-progress">
          <p>Add <strong>${remaining.toFixed(2)}</strong> more for free shipping</p>
          <div className="ship-progress-bar">
            <div style={{ width: `${Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100)}%` }} />
          </div>
        </div>
      ) : (
        <div className="ship-progress ship-progress--done">
          <p>You've unlocked free shipping</p>
        </div>
      )}

      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-items-head">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {items.map((item) => (
            <div className="cart-line" key={item.id}>
              <div className="cart-line-product">
                <img src={item.image} alt={item.name} />
                <div>
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                  <span className="cart-line-price">${item.price.toFixed(2)} each</span>
                  <button className="cart-line-remove" onClick={() => removeItem(item.id)}>
                    <IconTrash /> Remove
                  </button>
                </div>
              </div>

              <div className="qty-selector qty-selector--sm" role="group" aria-label={`Quantity for ${item.name}`}>
                <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity"><IconMinus /></button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity"><IconPlus /></button>
              </div>

              <div className="cart-line-total">${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}

          <button className="cart-clear" onClick={clearCart}>Clear cart</button>
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <dl>
            <div><dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd></div>
            <div><dt>Estimated tax</dt><dd>${tax.toFixed(2)}</dd></div>
          </dl>
          <div className="cart-summary-total">
            <dt>Total</dt><dd>${total.toFixed(2)}</dd>
          </div>

          <form className="promo-form" onSubmit={applyPromo}>
            <label htmlFor="promo" className="visually-hidden">Promo code</label>
            <input
              id="promo"
              type="text"
              placeholder="Promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button type="submit" className="btn btn--outline btn--sm">Apply</button>
          </form>
          {promoMsg && <p className="promo-msg">{promoMsg.text}</p>}


          <Link to="/checkout" className="btn btn--primary btn--block">
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="cart-continue">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
