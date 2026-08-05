import { useCart } from "../context/CartContext.jsx";
import { IconBag } from "./Icons.jsx";
import "./CartToast.css";

export default function CartToast() {
  const { toast } = useCart();
  if (!toast) return null;

  return (
    <div className="cart-toast" role="status" aria-live="polite">
      <span className="cart-toast-icon"><IconBag /></span>
      {toast}
    </div>
  );
}
