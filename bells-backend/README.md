# Bells Backend

A REST API for the Bells storefront, built with Express 5 + Mongoose. One `Product`
collection covers all five categories: `clothes`, `gym-equipment`, `home-appliances`,
`pc-setup`, `furniture`.

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Get MongoDB running**

Either install MongoDB locally and start it (`mongod`), or use a free cloud database at
[MongoDB Atlas](https://www.mongodb.com/atlas) — either works, you just need a connection
string.

**3. Configure `.env`**

A `.env` file is already included with local defaults:
```
MONGO_URI=mongodb://localhost:27017/Bells
PORT=3000
```
If you're using Atlas instead of a local install, replace `MONGO_URI` with the connection
string Atlas gives you.

**4. Seed some sample data**
```bash
npm run seed
```
This wipes the `products` collection and inserts 15 sample products (3 per category) from
`seed/seedData.js`. Re-run it any time you want to reset back to a known state.

**5. Start the server**
```bash
npm run dev     # restarts automatically when you save a file
# or
npm start       # runs once, no auto-restart
```

You should see:
```
MongoDB connected: localhost/Bells
Bells API running on http://localhost:3000
```

## API Reference

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List products. Supports query params below. |
| GET | `/products/categories` | List all categories with live product counts. |
| GET | `/products/:slug` | Get one product by its slug. |
| POST | `/products` | Create a product. Body = JSON matching the schema. |
| PUT | `/products/:slug` | Update a product. Body = fields to change. |
| DELETE | `/products/:slug` | Delete a product. |

**Query params for `GET /products`:**
- `?category=furniture` — filter by category
- `?sale=1` — only products with `onSale: true`
- `?q=chair` — case-insensitive search on product name
- `?sort=price-asc` | `price-desc` | `rating` — sort order (default: newest first)

These can be combined, e.g. `GET /api/products?category=furniture&sale=1&sort=price-asc`.

## Try it yourself (once seeded and running)

```bash
# All products
curl http://localhost:3000/api/products

# Only furniture, cheapest first
curl "http://localhost:3000/api/products?category=furniture&sort=price-asc"

# One product
curl http://localhost:3000/api/products/field-oak-stool

# Category list with counts
curl http://localhost:3000/api/products/categories

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"slug":"test-lamp","name":"Test Lamp","category":"furniture","price":50,"image":"https://example.com/lamp.jpg"}'

# Delete it again
curl -X DELETE http://localhost:3000/api/products/test-lamp
```

## Project structure

```
config/db.js               MongoDB connection (reads MONGO_URI from .env)
models/Product.js          Single schema covering every category
controllers/productController.js   All the request-handling logic
routes/productRoutes.js    Maps URLs to controller functions
seed/seedData.js           Sample product data
seed/seed.js               Script that loads seedData.js into MongoDB
server.js                  App entry point — middleware, routes, error handling
```

## Things worth understanding (not just copying)

- **One collection, not four.** `category` is a field on each product document, not a
  separate collection per category. Adding a 6th category later is just inserting
  documents with a new category string — no new files needed.
- **No try/catch in the controllers.** Express 5 automatically forwards a rejected
  promise from an async route handler to the error-handling middleware at the bottom of
  `server.js`. That middleware is what actually formats the error response. This avoids
  the exact bug we found in the very first draft of this backend (a query running
  outside its own try/catch).
- **Route order matters.** `/products/categories` is declared before `/products/:slug`
  in `routes/productRoutes.js` — otherwise Express would treat "categories" as a slug
  value instead of reaching the dedicated handler.
- **`isNewArrival`, not `isNew`.** Mongoose documents already have a built-in `.isNew`
  property internally. Naming a custom field `isNew` collides with it — Mongoose warns
  about this at startup. Worth remembering for your own future schemas.

## Connecting this to the React frontend

The frontend currently reads hardcoded data from `src/data/products.js`. To connect it
to this API, you'd replace those imports with `fetch("http://localhost:3000/api/products")`
calls (e.g. inside a `useEffect`). Note the field names differ slightly right now — the
frontend uses `isNew`, `salePrice`/`onSale`, etc. matching `lighting/tableware/textiles/
scent/furniture`, while this backend uses `isNewArrival` and the categories requested
here. That reconciliation is a good next step once you're ready to wire them together —
happy to help with it then.
