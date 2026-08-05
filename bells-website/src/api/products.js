// This file is the ONLY place in the app that knows the backend's exact
// shape (isNewArrival, slug, etc). Every component imports from here instead
// of calling fetch() directly — so if the backend's field names ever change
// again, this is the only file that needs to change.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Converts a raw product document from the API into the shape the rest of
// the frontend already expects (the same shape the old data/products.js used).
function normalizeProduct(p) {
  return {
    id: p.slug,
    _id: p._id, // real MongoDB id — needed for cart/checkout, NOT for routing
    name: p.name,
    category: p.category,
    brand: p.brand || "",
    price: p.price,
    salePrice: p.salePrice,
    onSale: Boolean(p.onSale),
    isNew: Boolean(p.isNewArrival), // renamed to dodge Mongoose's built-in `.isNew`
    rating: p.rating || 0,
    reviews: p.reviews || 0,
    stock: p.stock || 0,
    sizes: p.sizes || [],
    colors: p.colors || [],
    image: p.image,
    gallery: p.gallery && p.gallery.length ? p.gallery : [p.image],
    description: p.description || "",
    details: p.details || [],
  };
}

async function request(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

// GET /api/products — with optional filters, same params the API supports.
export async function fetchProducts({ category, sale, q, sort } = {}) {
  const search = new URLSearchParams();
  if (category) search.set("category", category);
  if (sale) search.set("sale", "1");
  if (q) search.set("q", q);
  if (sort) search.set("sort", sort);

  const qs = search.toString();
  const data = await request(`/products${qs ? `?${qs}` : ""}`);
  return data.products.map(normalizeProduct);
}

// GET /api/products/:slug
export async function fetchProductBySlug(slug) {
  const data = await request(`/products/${slug}`);
  return normalizeProduct(data.product);
}
