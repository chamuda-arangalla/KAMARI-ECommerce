import express from "express";
import {
  getHomeContent,
  updateHomeContent,
} from "../controllers/homeContent.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { uploadHomeImages } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getHomeContent);
router.put("/", protect, adminOnly, uploadHomeImages, updateHomeContent);

export default router;
