import { Router } from "express";
import {
  getProducts,
  getCategories,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();


router.get("/products/categories", getCategories);

router.get("/products", getProducts);
router.get("/products/:slug", getProductBySlug);
router.post("/products", requireAdmin, createProduct);
router.put("/products/:slug", requireAdmin, updateProduct);
router.delete("/products/:slug", requireAdmin, deleteProduct);

export default router;
