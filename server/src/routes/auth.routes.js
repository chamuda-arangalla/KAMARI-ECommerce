import express from "express";
import passport from "../config/passport.js";
import {
  login,
  logout,
  loginAdmin,
  registerCustomer,
  loginCustomer,
  handleOAuthCallback,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/admin/login", loginAdmin);
router.post("/admin/logout", logout);
router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);
router.post("/customer/logout", logout);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }), handleOAuthCallback);

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook", { scope: ["public_profile", "email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook_failed` }), handleOAuthCallback);

export default router;
