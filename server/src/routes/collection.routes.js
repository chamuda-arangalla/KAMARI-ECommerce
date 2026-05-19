import express from "express";
import {
  getAllCollections,
  getAllCollectionsAdmin,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collection.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { uploadCollectionImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/",              getAllCollections);
router.get("/admin/all",     protect, adminOnly, getAllCollectionsAdmin);
router.post("/",             protect, adminOnly, uploadCollectionImage, createCollection);
router.put("/:id",           protect, adminOnly, uploadCollectionImage, updateCollection);
router.delete("/:id",        protect, adminOnly, deleteCollection);

export default router;
