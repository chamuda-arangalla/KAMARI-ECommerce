import express from "express";
import { getPageContent, upsertPageContent, uploadContentImage } from "../controllers/siteContent.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { uploadSingleImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/:pageType",      getPageContent);
router.put("/:pageType",      protect, adminOnly, upsertPageContent);
router.post("/upload-image",  protect, adminOnly, uploadSingleImage, uploadContentImage);

export default router;
