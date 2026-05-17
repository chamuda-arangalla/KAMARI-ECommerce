import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { uploadProductImages } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, uploadProductImages, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, adminOnly, uploadProductImages, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
