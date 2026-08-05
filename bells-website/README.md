# Bells — E-Commerce Frontend

A storefront frontend for **Bells**, built with React 19 + Vite and React Router. Data
comes live from the [Bells backend](../bells-backend) — this app has no hardcoded product
data anymore.

## Getting started

**1. Get the backend running first.** This app fetches everything from it — see the
backend's own README. It needs to be reachable before pages like Shop or Home will show
any products.

**2. Point this app at your backend, if different from the default.**
```
# .env
VITE_API_URL=http://localhost:3000/api
```

**3. Install and run**
```bash
npm install
npm run dev       # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Pages

- **/** — Home (hero, category grid, featured & sale products — all fetched live)
- **/shop** — Product listing with category/sale filters, search, and sorting. Filtering
  happens on the *server*, not in the browser — the URL's `?category=`, `?sale=1`, `?q=`
  are forwarded straight to the API as query params.
- **/product/:id** — Product detail (`:id` is actually the product's `slug`). Gallery,
  quantity, add to cart, details/shipping tabs, related products (fetched by category).
- **/cart** — Cart with quantity controls, free-shipping progress bar, promo field, order
  summary. Cart data itself is local (see Notes below) — only the product catalog is fetched.
- **/about** — Brand story, values, timeline, makers
- **/contact** — Validated contact form, store info, FAQ accordion
- **/*** — 404 page

## Structure

```
src/
  api/           products.js — the ONLY file that knows the backend's exact field
                 names (slug, isNewArrival). Everything else uses the normalized shape.
  components/    Header, Footer, Layout, ProductCard, CartToast, Icons
  context/       CartContext (cart state, persisted to localStorage)
  data/          categories.js — category slugs/names/images (matches the backend's
                 category enum exactly)
  pages/         one folder-free page + stylesheet per route
```

## How data flows now

Every page that shows products follows the same pattern:
```jsx
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetchProducts({ ...filters })
    .then(setProducts)
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, [/* whatever the filters are */]);
```
`fetchProducts` (in `src/api/products.js`) calls the backend and converts each raw
product into the shape the rest of the app expects — e.g. the backend's `slug` becomes
`id`, and `isNewArrival` becomes `isNew`. If the backend's field names ever change again,
that file is the only one that needs editing.

## Design system

Colors, applied via CSS variables in `src/index.css`:

| Token       | Hex       | Usage                     |
|-------------|-----------|---------------------------|
| `--bg`      | `#FFFFFF` | Site background           |
| `--navy`    | `#0B2545` | Header, nav, footer       |
| `--accent`  | `#FF9900` | Add to Cart / primary CTA |
| `--text`    | `#212529` | Body text                 |
| `--sale`    | `#DC3545` | Sale badges               |

Typography: **Fraunces** (display/serif, headings) + **Inter** (body/UI), loaded via Google Fonts in `index.html`.

Categories: `clothes`, `gym-equipment`, `home-appliances`, `pc-setup`, `furniture` —
defined once in `src/data/categories.js`, matching the backend's `Product` schema.

## Notes

- The cart persists to `localStorage` and is shared across pages via React Context — this
  part is unchanged and doesn't talk to the backend at all yet. Adding real order
  submission (sending the cart to the backend at checkout) is a good next step once
  you're ready — the backend doesn't have an orders endpoint yet.
- "Proceed to Checkout" is still a UI stub.
- Newsletter and contact forms are still front-end only (no backend endpoint for them).
- If a page shows "Couldn't load products" — check that the backend is running and that
  `VITE_API_URL` in `.env` points at it. Browser DevTools → Network tab will show the
  failed request and its exact error message.
