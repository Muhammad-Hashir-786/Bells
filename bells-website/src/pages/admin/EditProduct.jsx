import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ProductForm from "./ProductForm.jsx";
import { apiFetch } from "../../utils/api.js";
import { IconChevron } from "../../components/Icons.jsx";
import "./admin.css";

export default function EditProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/products/${slug}`)
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleUpdate(data) {
    try {
      const payload = { ...data, salePrice: data.salePrice === "" ? undefined : data.salePrice };
      await apiFetch(`/products/${slug}`, {
        method: "PUT",
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
          <h1>Edit Product</h1>
          <p>Update the details for this listing.</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {loading ? (
        <div className="admin-card admin-empty">Loading…</div>
      ) : product ? (
        <div className="admin-form-card">
          <ProductForm defaultValues={product} onSubmit={handleUpdate} submitLabel="Save Changes" />
        </div>
      ) : null}
    </div>
  );
}
