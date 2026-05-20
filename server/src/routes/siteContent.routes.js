import express from "express";
import { getPageContent, upsertPageContent } from "../controllers/siteContent.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:pageType",  getPageContent);
router.put("/:pageType",  protect, adminOnly, upsertPageContent);

export default router;
