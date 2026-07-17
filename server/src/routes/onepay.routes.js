import express from "express";
import {
  handleCallback,
  initiateCheckout,
  verifyPayment,
} from "../controllers/onepay.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/checkout-link", protect, initiateCheckout);
router.post("/verify", protect, verifyPayment);
router.post("/callback", handleCallback);

export default router;
