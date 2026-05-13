import express from "express";
import {
  createProduct,
  getAllProducts,
} from "../controllers/product.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { uploadProductImages } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, uploadProductImages, createProduct);
router.get("/", getAllProducts);

export default router;