import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { IconBag, IconMinus, IconPlus, IconReturn, IconStar, IconTruck } from "../components/Icons.jsx";
import { useCart } from "../context/CartContext.jsx";
import { fetchProductBySlug, fetchProducts } from "../api/products.js";
import { categoryLabel } from "../data/categories.js";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id: slug } = useParams(); // route is /product/:id, but the value is really the slug
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState("details");
  const [justAdded, setJustAdded] = useState(false);

  // Two requests in sequence: first the product itself, then — once we know
  // its category — a second request for other products in that category.
  // Resetting qty/activeImage here matters too: without it, switching from
  // one product page straight to another (via a "related product" link)
  // would keep the previous product's quantity and image index.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setQty(1);
    setActiveImage(0);

    fetchProductBySlug(slug)
      .then((p) => {
        if (cancelled) return;
        setProduct(p);
        return fetchProducts({ category: p.category });
      })
      .then((list) => {
        if (cancelled || !list) return;
        setRelated(list.filter((p) => p.id !== slug).slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <div className="container pdp"><p>Loading…</p></div>;
  }
  if (notFound || !product) return <Navigate to="/shop" replace />;

  const price = product.onSale ? product.salePrice : product.price;

  function handleAdd() {
    addItem(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="pdp">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> <span>/</span> <Link to="/shop">Shop</Link> <span>/</span>{" "}
          <Link to={`/shop?category=${product.category}`}>{categoryLabel(product.category)}</Link>{" "}
          <span>/</span> <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp-grid">
          <div className="pdp-gallery">
            <div className="pdp-gallery-main">
              <img src={product.gallery[activeImage] || product.image} alt={product.name} />
              {product.onSale && <span className="badge badge--sale pdp-sale-badge">Sale</span>}
            </div>
            {product.gallery.length > 1 && (
              <div className="pdp-thumbs">
                {product.gallery.map((src, i) => (
                  <button
                    key={src}
                    className={i === activeImage ? "pdp-thumb pdp-thumb--active" : "pdp-thumb"}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pdp-info">
            <p className="pdp-category">{categoryLabel(product.category)}</p>
            <h1>{product.name}</h1>

            <div className="pdp-rating" aria-label={`${product.rating} out of 5 stars, ${product.reviews} reviews`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} filled={i < Math.round(product.rating)} />
              ))}
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="pdp-price">
              <span className="price-current">${price.toFixed(2)}</span>
              {product.onSale && (
                <>
                  <span className="price-was">${product.price.toFixed(2)}</span>
                  <span className="badge badge--sale">
                    Save ${(product.price - product.salePrice).toFixed(0)}
                  </span>
                </>
              )}
            </div>

            <p className="pdp-description">{product.description}</p>

            <p className={product.stock <= 6 ? "pdp-stock pdp-stock--low" : "pdp-stock"}>
              {product.stock === 0
                ? "Currently sold out"
                : product.stock <= 6
                ? `Only ${product.stock} left in stock`
                : "In stock, ready to ship"}
            </p>

            <div className="pdp-purchase-row">
              <div className="qty-selector" role="group" aria-label="Quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <IconMinus />
                </button>
                <span aria-live="polite">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  <IconPlus />
                </button>
              </div>

              <button
                className="btn btn--primary pdp-add-btn"
                onClick={handleAdd}
                disabled={product.stock === 0}
              >
                <IconBag />
                {justAdded ? "Added!" : product.stock === 0 ? "Sold out" : "Add to Cart"}
              </button>
            </div>

            <ul className="pdp-perks">
              <li><IconTruck /> Free shipping on orders over $75</li>
              <li><IconReturn /> 30-day returns, no questions asked</li>
            </ul>

            <div className="pdp-tabs">
              <div className="pdp-tabs-nav" role="tablist">
                <button role="tab" aria-selected={tab === "details"} className={tab === "details" ? "active" : ""} onClick={() => setTab("details")}>
                  Details
                </button>
                <button role="tab" aria-selected={tab === "shipping"} className={tab === "shipping" ? "active" : ""} onClick={() => setTab("shipping")}>
                  Shipping &amp; Returns
                </button>
              </div>
              <div className="pdp-tabs-panel">
                {tab === "details" ? (
                  <ul>
                    {product.details.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                ) : (
                  <p>
                    Orders ship within 2 business days. Standard delivery takes 3–6 business days;
                    free on orders over $75. If it's not right for your space, return it within 30
                    days for a full refund — we'll email a prepaid label.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="pdp-related">
            <h2>You might also like</h2>
            <div className="product-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
