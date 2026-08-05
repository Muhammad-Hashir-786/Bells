import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../utils/api.js";
import { categoryLabel } from "../../data/categories.js";
import { IconPlus, IconTrash } from "../../components/Icons.jsx";
import "./admin.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingSlug, setDeletingSlug] = useState(null);

  useEffect(() => {
    apiFetch("/products")
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(slug) {
    if (!confirm(`Delete "${slug}"? This can't be undone.`)) return;

    setDeletingSlug(slug);
    try {
      await apiFetch(`/products/${slug}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Products</h1>
          <p>{loading ? "Loading…" : `${products.length} product${products.length === 1 ? "" : "s"} in the catalog`}</p>
        </div>
        <Link to="/admin/products/new" className="btn btn--primary">
          <IconPlus /> Add Product
        </Link>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {loading ? (
        <div className="admin-card admin-empty">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="admin-card admin-empty">
          <p>No products yet.</p>
          <Link to="/admin/products/new" className="btn btn--outline btn--sm">Add your first product</Link>
        </div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <div className="admin-product-cell">
                      <img src={p.image} alt="" />
                      <div>
                        <span className="admin-product-name">{p.name}</span>
                        <span className="admin-product-slug">{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>{categoryLabel(p.category)}</td>
                  <td>
                    {p.onSale ? (
                      <>
                        <span className="admin-price-sale">${Number(p.salePrice).toFixed(2)}</span>
                        <span className="admin-price-was">${Number(p.price).toFixed(2)}</span>
                      </>
                    ) : (
                      <span>${Number(p.price).toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? "badge--sale" : "badge--stock"}`}>
                      {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link to={`/admin/products/${p.slug}/edit`} className="btn btn--outline btn--sm">Edit</Link>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDelete(p.slug)}
                        disabled={deletingSlug === p.slug}
                        aria-label={`Delete ${p.name}`}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
