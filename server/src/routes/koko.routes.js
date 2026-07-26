import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  verifyKokoPayment,
  handleKokoCallback,
} from "../controllers/koko.controller.js";

const router = express.Router();

router.post("/verify", protect, verifyKokoPayment);
router.post("/callback", handleKokoCallback);

export default router;
