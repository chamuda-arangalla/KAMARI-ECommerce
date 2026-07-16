import Order from "../models/Order.js";
import User from "../models/User.js";
import ORDER_STATUS from "../enums/orderStatus.enum.js";
import PAYMENT_STATUS from "../enums/paymentStatus.enum.js";
import PAYMENT_TYPE from "../enums/paymentType.enum.js";
import {
  createKokoOrderRequest,
  processKokoResponse,
} from "../services/koko.service.js";
import { sendEmail } from "../services/emailService.js";
import {
  paymentConfirmedTemplate,
  paymentFailedTemplate,
} from "../templates/orderEmailTemplates.js";

const isAdmin = (req) => req.user?.role === "admin";

const isOrderOwner = (req, order) =>
  String(order.receiverDetails?.userId || "") === String(req.user?.id || "");

const getCustomerEmail = async (order, req) => {
  if (req.user?.email) return req.user.email;
  if (order.receiverDetails?.email) return order.receiverDetails.email;

  const userId = order.receiverDetails?.userId || req.user?.id;
  if (!userId) return null;

  const customer = await User.findById(userId).select("email").lean();
  return customer?.email || null;
};

const getOrderCustomerEmail = async (order) => {
  if (order.receiverDetails?.email) return order.receiverDetails.email;
  if (!order.receiverDetails?.userId) return null;

  const customer = await User.findById(order.receiverDetails.userId).select("email").lean();
  return customer?.email || null;
};

const getCallbackPaymentState = (status) => {
  if (["SUCCESS", "SUCCEEDED", "COMPLETE", "COMPLETED"].includes(status)) {
    return {
      paymentStatus: PAYMENT_STATUS.COMPLETE,
      orderStatus: ORDER_STATUS.SHIPPING,
      shouldSendConfirmation: true,
    };
  }

  if (["FAILURE", "FAILED"].includes(status)) {
    return {
      paymentStatus: PAYMENT_STATUS.FAILED,
      shouldSendFailure: true,
    };
  }

  if (["CANCELED", "CANCELLED", "CANCEL"].includes(status)) {
    return {
      paymentStatus: PAYMENT_STATUS.PENDING,
    };
  }

  return {
    paymentStatus: PAYMENT_STATUS.FAILED,
    shouldSendFailure: true,
  };
};

export const initiateKokoPaymentController = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!process.env.CLIENT_URL || !process.env.SERVER_URL) {
      return res.status(500).json({
        success: false,
        message: "CLIENT_URL and SERVER_URL are required for Koko payments",
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!isAdmin(req) && !isOrderOwner(req, order)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to pay for this order",
      });
    }

    if (order.paymentStatus === PAYMENT_STATUS.COMPLETE) {
      return res.status(409).json({
        success: false,
        message: "Payment already completed for this order",
      });
    }

    const customerEmail = await getCustomerEmail(order, req);

    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required for Koko payment",
      });
    }

    const orderDetailsUrl = `${process.env.CLIENT_URL}/orders/${order.orderId}`;
    const kokoOrder = createKokoOrderRequest({
      orderId: order.orderId,
      amount: order.pricing.grandTotal,
      currency: "LKR",
      firstName: order.receiverDetails.firstName,
      lastName: order.receiverDetails.lastName,
      email: customerEmail,
      phoneNumber: order.receiverDetails.phoneNumber,
      description: `KAMARI Order #${order.orderId}`,
      returnUrl: `${orderDetailsUrl}?payment=koko&status=success`,
      cancelUrl: `${orderDetailsUrl}?payment=koko&status=cancelled`,
      responseUrl: `${process.env.SERVER_URL}/api/payments/koko/callback`,
    });

    order.paymentMethod = "koko";
    order.paymentType = PAYMENT_TYPE.KOKO;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Koko payment request created successfully",
      data: {
        orderId: order.orderId,
        amount: order.pricing.grandTotal,
        ...kokoOrder,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create Koko payment request",
    });
  }
};

export const handleKokoCallback = async (req, res) => {
  try {
    const { orderId, trnId, status } = processKokoResponse(req.body);
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousPaymentStatus = order.paymentStatus;
    const paymentState = getCallbackPaymentState(status);

    order.paymentStatus = paymentState.paymentStatus;
    if (paymentState.orderStatus) {
      order.orderStatus = paymentState.orderStatus;
    }
    order.kokoTransactionId = trnId;
    order.paymentMethod = "koko";
    order.paymentType = PAYMENT_TYPE.KOKO;
    await order.save();

    const customerEmail = await getOrderCustomerEmail(order);
    const paymentStatusChanged = previousPaymentStatus !== order.paymentStatus;

    if (customerEmail && paymentStatusChanged) {
      try {
        if (paymentState.shouldSendConfirmation) {
          await sendEmail({
            to: customerEmail,
            subject: `Payment Confirmed - Order #${order.orderId}`,
            html: paymentConfirmedTemplate(order),
          });
        }

        if (paymentState.shouldSendFailure) {
          await sendEmail({
            to: customerEmail,
            subject: `Payment Failed - Order #${order.orderId}`,
            html: paymentFailedTemplate(order),
          });
        }
      } catch {
        // Koko should still receive a successful callback response if the order update succeeded.
      }
    }

    return res.status(200).json({
      success: true,
      message: "Callback processed successfully",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message || "Failed to process callback",
    });
  }
};
