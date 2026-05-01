import express from "express";
import {
  registerAdmin,
  loginAdmin,
  registerCustomer,
  loginCustomer,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);

export default router;