import { Link } from "react-router-dom";
import { BellMark } from "../components/Icons.jsx";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="container not-found">
      <BellMark size={40} />
      <h1>404 — This room is empty</h1>
      <p>The page you're looking for doesn't exist, or has moved.</p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn--primary">Back home</Link>
        <Link to="/shop" className="btn btn--outline">Browse shop</Link>
      </div>
    </div>
  );
}
