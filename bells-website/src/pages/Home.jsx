import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { RingMark, IconLeaf, IconReturn, IconTruck, IconStar, IconChevron } from "../components/Icons.jsx";
import { fetchProducts } from "../api/products.js";
import { CATEGORY_META } from "../data/categories.js";
import "./Home.css";

export default function Home() {
  // Home needs the full catalog once, then slices it into "featured" and
  // "on sale" locally — one fetch, two derived lists, instead of two fetches.
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = products.filter((p) => p.isNew || p.onSale).slice(0, 8);
  const saleItems = products.filter((p) => p.onSale).slice(0, 3);

  return (
    <>
      {/* HERO — the thesis: an asymmetric collage of the actual goods, tagged like a maker would */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">New season arrivals</span>
            <h1>Every good room starts with one honest object.</h1>
            <p className="hero-lede">
              Bells sources small-batch clothing, gear, and furnishings from makers who still
              sign their own work. Fewer things, chosen with more care.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn--primary">Shop the collection</Link>
              <Link to="/about" className="btn btn--outline">Our story</Link>
            </div>
            <dl className="hero-stats">
              <div><dt>120+</dt><dd>independent makers</dd></div>
              <div><dt>14 yrs</dt><dd>sourcing quietly</dd></div>
              <div><dt>4.8</dt><dd>average rating</dd></div>
            </dl>
          </div>

          <div className="hero-collage">
            <div className="hero-collage-item hero-collage-item--tall">
              <img
                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=900&auto=format&fit=crop"
                alt="A solid wood armchair in a sunlit room"
              />
              <span className="hang-tag">
                <span className="hang-tag-hole" aria-hidden="true" />
                Hand-picked
              </span>
            </div>
            <div className="hero-collage-item">
              <img
                src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=700&auto=format&fit=crop"
                alt="A small kitchen appliance on a counter"
              />
            </div>
            <div className="hero-collage-item">
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=700&auto=format&fit=crop"
                alt="Folded clothing, well made"
              />
            </div>
          </div>
        </div>
      </section>
      {/* CATEGORY STRIP */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Shop by category</span>
            <h2>Find your room's next piece</h2>
          </div>
          <div className="category-grid">
            {CATEGORY_META.map((cat, i) => (
              <Link to={`/shop?category=${cat.slug}`} className="category-tile" key={cat.slug}>
                <span className="category-tile-index">{String(i + 1).padStart(2, "0")}</span>
                <div className="category-tile-media">
                  <img src={cat.image} alt="" loading="lazy" />
                </div>
                <div className="category-tile-label">
                  <div>
                    <h3>{cat.name}</h3>
                    <p>{cat.tagline}</p>
                  </div>
                  <IconChevron className="category-tile-arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <RingMark className="ring-mark" />
            <h2>New in, and worth ringing about</h2>
            <p>A rotating edit of recent arrivals and maker favorites — restocked in small runs, so a piece rarely lasts a full season.</p>
          </div>

          {error ? (
            <p>Couldn't load products right now ({error}). Is the backend running?</p>
          ) : loading ? (
            <p>Loading…</p>
          ) : (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="section-cta">
            <Link to="/shop" className="btn btn--outline">View all products</Link>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="section section--tight">
        <div className="container value-grid">
          <div className="value-item">
            <IconTruck />
            <h3>Free shipping over $75</h3>
            <p>Standard delivery in 3–6 business days across the continental US.</p>
          </div>
          <div className="value-item">
            <IconReturn />
            <h3>30-day easy returns</h3>
            <p>Not the right fit for your room? Send it back, no questions, within 30 days.</p>
          </div>
          <div className="value-item">
            <IconLeaf />
            <h3>Responsibly sourced</h3>
            <p>Natural materials, small production runs, and makers we've visited in person.</p>
          </div>
        </div>
      </section>

      {/* SALE STRIP */}
      {!loading && !error && saleItems.length > 0 && (
        <section className="section sale-strip">
          <div className="container sale-strip-inner">
            <div className="sale-strip-copy">
              <span className="eyebrow" style={{ color: "var(--accent)" }}>End of season</span>
              <h2>Up to 25% off select pieces</h2>
              <p>A short list of items we're making room for — same craftsmanship, fewer left on the shelf.</p>
              <Link to="/shop?sale=1" className="btn btn--primary">Shop the sale</Link>
            </div>
            <div className="sale-strip-products">
              {saleItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      <section className="section section--tight testimonial">
        <div className="container testimonial-inner">
          <RingMark className="ring-mark ring-mark--center" />
          <div className="testimonial-stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} />)}
          </div>
          <blockquote>
            "Everything from Bells feels like it was made by someone who'll still be doing this
            in twenty years — I've started checking here before anywhere else."
          </blockquote>
          <p className="testimonial-attribution">— Naomi R., verified customer</p>
        </div>
      </section>
    </>
  );
}
