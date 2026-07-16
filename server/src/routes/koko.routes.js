import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  initiateKokoPaymentController,
  handleKokoCallback,
} from "../controllers/koko.controller.js";

const router = express.Router();

router.post("/initiate", protect, initiateKokoPaymentController);
router.post("/callback", handleKokoCallback);

export default router;
