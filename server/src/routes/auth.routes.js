import express from "express";
import {
  login,
  registerCustomer,
  loginCustomer,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);

export default router;
