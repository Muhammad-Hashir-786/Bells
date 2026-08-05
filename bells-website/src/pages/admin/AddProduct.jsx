import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import ProductForm from "./ProductForm.jsx";
import { apiFetch } from "../../utils/api.js";
import { IconChevron } from "../../components/Icons.jsx";
import "./admin.css";

export default function AddProduct() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleCreate(data) {
    try {
      // salePrice comes through as "" when onSale is off — strip it so
      // Mongoose doesn't choke on an empty string where it expects a Number
      const payload = { ...data, salePrice: data.salePrice === "" ? undefined : data.salePrice };
      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-page">
      <Link to="/admin" className="admin-back">
        <IconChevron style={{ transform: "rotate(180deg)" }} /> Back to products
      </Link>

      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Add Product</h1>
          <p>Fill in the details below to list a new item.</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-form-card">
        <ProductForm onSubmit={handleCreate} submitLabel="Create Product" />
      </div>
    </div>
  );
}
