import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  getOrderByOrderId,
  getOrdersByUserId,
  updateOrder,
} from "../controllers/order.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/user/:userId", protect, getOrdersByUserId);
router.get("/order-id/:orderId", protect, getOrderByOrderId);
router.get("/:id", protect, getOrder);
router.put("/:id", protect, adminOnly, updateOrder);
router.delete("/:id", protect, adminOnly, deleteOrder);

export default router;
