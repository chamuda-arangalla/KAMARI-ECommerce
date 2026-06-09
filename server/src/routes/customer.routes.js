import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  getMyProfile,
  updateCheckoutAddress,
  updateCustomer,
  updateMyProfile,
} from "../controllers/customer.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/checkout-address", protect, updateCheckoutAddress);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.post("/", protect, adminOnly, createCustomer);
router.get("/", protect, adminOnly, getCustomers);
router.get("/:id", protect, adminOnly, getCustomerById);
router.put("/:id", protect, adminOnly, updateCustomer);
router.delete("/:id", protect, adminOnly, deleteCustomer);

export default router;
