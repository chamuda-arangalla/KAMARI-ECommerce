import express from "express";
import {
  login,
  logout,
  loginAdmin,
  registerCustomer,
  loginCustomer,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/admin/login", loginAdmin);
router.post("/admin/logout", logout);
router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);
router.post("/customer/logout", logout);

export default router;
