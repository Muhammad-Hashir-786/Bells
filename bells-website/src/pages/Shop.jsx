import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { IconClose } from "../components/Icons.jsx";
import { fetchProducts } from "../api/products.js";
import { CATEGORY_META, categoryLabel } from "../data/categories.js";
import "./Shop.css";

const SORTS = [
  { value: "", label: "Featured" }, // "" tells the API to use its default (newest first)
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("category") || "";
  const onSaleOnly = params.get("sale") === "1";
  const query = params.get("q") || "";
  const [sort, setSort] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  // Re-fetch from the API every time a filter changes. Filtering, searching,
  // and sorting all happen on the server now — the URL's query params (?category=,
  // ?sale=, ?q=) map directly onto the same params the API accepts, so this
  // effect is really just "forward whatever's in the URL to the backend."
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProducts({ category: activeCategory, sale: onSaleOnly, q: query, sort })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Cleanup: if the params change again before this fetch finishes (e.g. the
    // user clicks two filters quickly), ignore the stale response when it lands.
    return () => {
      cancelled = true;
    };
  }, [activeCategory, onSaleOnly, query, sort]);

  const activeCategoryName = activeCategory ? categoryLabel(activeCategory) : null;

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <div className="container">
          <span className="eyebrow">Shop</span>
          <h1>{activeCategoryName || "All products"}</h1>
          <p>
            {loading ? "Loading…" : `${products.length} ${products.length === 1 ? "piece" : "pieces"}`}
            {query && !loading && <> matching “{query}”</>}
          </p>
        </div>
      </div>

      <div className="container shop-layout">
        <aside className="shop-filters" aria-label="Filter products">
          <div className="filter-group">
            <h3>Category</h3>
            <ul>
              <li>
                <button
                  className={!activeCategory ? "filter-active" : ""}
                  onClick={() => updateParam("category", "")}
                >
                  All categories
                </button>
              </li>
              {CATEGORY_META.map((c) => (
                <li key={c.slug}>
                  <button
                    className={activeCategory === c.slug ? "filter-active" : ""}
                    onClick={() => updateParam("category", c.slug)}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h3>Availability</h3>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => updateParam("sale", e.target.checked ? "1" : "")}
              />
              On sale only
            </label>
          </div>

          {(activeCategory || onSaleOnly || query) && (
            <button className="clear-filters" onClick={() => setParams({})}>
              <IconClose /> Clear all filters
            </button>
          )}
        </aside>

        <div className="shop-results">
          <div className="shop-toolbar">
            <label htmlFor="sort">
              Sort by
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {error ? (
            <div className="shop-empty">
              <h3>Couldn't load products</h3>
              <p>{error} — make sure the backend is running on the URL set in your frontend's .env file.</p>
            </div>
          ) : !loading && products.length === 0 ? (
            <div className="shop-empty">
              <h3>No pieces match those filters</h3>
              <p>Try clearing a filter or browsing another category.</p>
              <button className="btn btn--outline" onClick={() => setParams({})}>Clear filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
