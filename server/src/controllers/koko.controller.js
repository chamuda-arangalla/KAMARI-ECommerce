import Order from "../models/Order.js";
import PendingKokoCheckout from "../models/PendingKokoCheckout.js";
import ORDER_STATUS from "../enums/orderStatus.enum.js";
import PAYMENT_STATUS from "../enums/paymentStatus.enum.js";
import PAYMENT_TYPE from "../enums/paymentType.enum.js";
import {
  processKokoResponse,
  viewKokoOrder,
} from "../services/koko.service.js";
import { sendEmail } from "../services/emailService.js";
import {
  orderConfirmationTemplate,
  adminNewOrderTemplate,
} from "../templates/orderEmailTemplates.js";
import {
  getCustomerEmail,
  saveReceiverAddressToCustomer,
} from "./order.controller.js";
import { logger } from "../utils/logger.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const CLIENT_URL = process.env.CLIENT_URL?.replace(/\/$/, "");

const isSuccessful = (status) => status === "SUCCESS";

const canAccessPendingCheckout = (req, pending) =>
  req.user?.role === "admin" ||
  String(pending.userId) === String(req.user?.id || "");

const canAccessOrder = (req, order) =>
  req.user?.role === "admin" ||
  String(order.receiverDetails?.userId || "") === String(req.user?.id || "");

const sendOrderNotifications = async (order, pending) => {
  const customerEmail =
    pending.customerEmail || (await getCustomerEmail(pending.userId));

  if (customerEmail) {
    void sendEmail({
      to: customerEmail,
      subject: `Order Confirmed - ${order.orderId}`,
      html: orderConfirmationTemplate(order),
    });
  }

  if (ADMIN_EMAIL) {
    void sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Order Received - ${order.orderId}`,
      html: adminNewOrderTemplate(
        order,
        customerEmail || "N/A",
        `${CLIENT_URL}/admin/orders`,
      ),
    });
  }
};

const finalizeKokoOrder = async ({ orderId, transactionId }) => {
  const existingOrder = await Order.findOne({ orderId });
  if (existingOrder) return existingOrder;

  const pending = await PendingKokoCheckout.findOne({ reference: orderId });
  if (!pending) {
    const error = new Error("Pending Koko checkout not found or expired");
    error.statusCode = 404;
    throw error;
  }

  let order;
  try {
    order = await Order.create({
      orderId: pending.reference,
      productDetails: pending.productDetails,
      pricing: pending.pricing,
      receiverDetails: pending.receiverDetails,
      paymentStatus: PAYMENT_STATUS.COMPLETE,
      paymentMethod: "koko",
      paymentType: PAYMENT_TYPE.KOKO,
      orderStatus: ORDER_STATUS.SHIPPING,
      kokoTransactionId: transactionId,
    });
  } catch (error) {
    if (error.code !== 11000) throw error;
    return Order.findOne({ orderId });
  }

  await Promise.all([
    PendingKokoCheckout.deleteOne({ reference: orderId }),
    saveReceiverAddressToCustomer(pending.userId, pending.receiverDetails),
  ]);
  await sendOrderNotifications(order, pending);

  return order;
};

export const verifyKokoPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      if (!canAccessOrder(req, existingOrder)) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to view this payment",
        });
      }

      return res.status(200).json({
        success: true,
        status: "success",
        data: existingOrder,
      });
    }

    const pending = await PendingKokoCheckout.findOne({ reference: orderId });
    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Koko checkout not found or expired",
      });
    }

    if (!canAccessPendingCheckout(req, pending)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this payment",
      });
    }

    const payment = await viewKokoOrder(orderId);

    if (isSuccessful(payment.status)) {
      const order = await finalizeKokoOrder({
        orderId: payment.orderId,
        transactionId: payment.trnId,
      });
      return res.status(200).json({
        success: true,
        status: "success",
        data: order,
      });
    }

    if (["FAILED", "FAILURE", "CANCELED", "CANCELLED"].includes(payment.status)) {
      await PendingKokoCheckout.deleteOne({ reference: orderId });
    }

    return res.status(200).json({
      success: true,
      status: payment.status.toLowerCase(),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to verify Koko payment",
    });
  }
};

export const handleKokoCallback = async (req, res) => {
  try {
    const payment = processKokoResponse(req.body);

    if (isSuccessful(payment.status)) {
      await finalizeKokoOrder({
        orderId: payment.orderId,
        transactionId: payment.trnId,
      });
    } else if (["FAILED", "FAILURE"].includes(payment.status)) {
      await PendingKokoCheckout.deleteOne({ reference: payment.orderId });
    }

    return res.status(200).json({
      success: true,
      message: "Koko callback processed",
    });
  } catch (error) {
    const invalidRequest =
      error.message.startsWith("Missing Koko configuration or fields:") ||
      error.message === "Invalid Koko response signature";
    const status = invalidRequest ? 400 : error.statusCode || 500;

    logger.error("koko_callback_failed", {
      requestId: req.requestId,
      status,
      error,
    });
    res.locals.errorAlreadyLogged = true;

    return res.status(status).json({
      success: false,
      message: invalidRequest ? error.message : "Failed to process Koko callback",
    });
  }
};
