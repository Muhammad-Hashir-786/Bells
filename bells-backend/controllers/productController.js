import { CATEGORY_LIST, Product } from "../models/Product.js";

export async function getProducts(req, res) {
  const { category, sale, q, sort } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (sale === "1") filter.onSale = true;
  if (q) filter.name = { $regex: q, $options: "i" }; // case-insensitive partial match

  let query = Product.find(filter);

  if (sort === "price-asc") query = query.sort({ price: 1 });
  else if (sort === "price-desc") query = query.sort({ price: -1 });
  else if (sort === "rating") query = query.sort({ rating: -1 });
  else query = query.sort({ createdAt: -1 }); // default: newest first

  const products = await query;
  res.status(200).json({ count: products.length, products });
}

// GET /api/products/categories
// Returns the fixed category list plus a live count of products in each —
// handy for building a sidebar filter without hardcoding counts in the frontend.
export async function getCategories(req, res) {
  const counts = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));

  const categories = CATEGORY_LIST.map((slug) => ({
    slug,
    count: countMap[slug] || 0,
  }));

  res.status(200).json({ categories });
}

// GET /api/products/:slug
export async function getProductBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ product });
}

// POST /api/products
export async function createProduct(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
}

// PUT /api/products/:slug
export async function updateProduct(req, res) {
  const product = await Product.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true, runValidators: true } // return the updated doc, re-run schema validation
  );
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ product });
}

// DELETE /api/products/:slug
export async function deleteProduct(req, res) {
  const product = await Product.findOneAndDelete({ slug: req.params.slug });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ message: "Product deleted", product });
}
