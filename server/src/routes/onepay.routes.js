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
// Deliberately unauthenticated: OnePay's server-to-server callback can't carry our
// JWT. Authenticity instead comes from independently re-verifying the transaction
// via OnePay's own status API inside handleCallback, never from trusting this body.
router.post("/callback", handleCallback);

export default router;
