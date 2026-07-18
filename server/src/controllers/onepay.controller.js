import Order from "../models/Order.js";
import PendingOnePayCheckout from "../models/PendingOnePayCheckout.js";
import PAYMENT_STATUS from "../enums/paymentStatus.enum.js";
import PAYMENT_METHOD from "../enums/paymentMethod.enum.js";
import ORDER_STATUS from "../enums/orderStatus.enum.js";
import onepayConfig from "../config/onepay.js";
import { createCheckoutLink, getTransactionStatus } from "../utils/onepayClient.js";
import buildUniqueOrderId from "../utils/buildUniqueOrderId.js";
import { sendEmail } from "../services/emailService.js";
import {
  orderConfirmationTemplate,
  adminNewOrderTemplate,
} from "../templates/orderEmailTemplates.js";
import {
  getCustomerEmail,
  isAdmin,
  isOrderOwner,
  saveReceiverAddressToCustomer,
  validateOrderProducts,
  calculatePricing,
} from "./order.controller.js";

const CLIENT_URL = process.env.CLIENT_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const findOrderByReference = async (reference) => Order.findOne({ orderId: reference });

const createPendingCheckoutWithUniqueReference = async ({ userId, productDetails, pricing, receiverDetails }) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = await buildUniqueOrderId();

    try {
      return await PendingOnePayCheckout.create({
        reference,
        userId,
        productDetails,
        pricing,
        receiverDetails,
      });
    } catch (error) {
      if (error.code !== 11000 || !error.keyPattern?.reference) {
        throw error;
      }
    }
  }

  throw new Error("Failed to generate unique OnePay checkout reference");
};

const finalizeOrderFromPending = async (pending, transactionId) => {
  const order = await Order.create({
    orderId: pending.reference,
    productDetails: pending.productDetails,
    pricing: pending.pricing,
    receiverDetails: pending.receiverDetails,
    paymentStatus: PAYMENT_STATUS.COMPLETE,
    paymentMethod: PAYMENT_METHOD.ONEPAY,
    orderStatus: ORDER_STATUS.SHIPPING,
    onepay: { transactionId: transactionId || "", verifiedAt: new Date() },
  });

  await saveReceiverAddressToCustomer(pending.userId, pending.receiverDetails);

  const customerEmail = await getCustomerEmail(pending.userId);
  if (customerEmail) {
    sendEmail({
      to: customerEmail,
      subject: `Order Confirmed — ${order.orderId}`,
      html: orderConfirmationTemplate(order),
    });
  }
  if (ADMIN_EMAIL) {
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Order Received — ${order.orderId}`,
      html: adminNewOrderTemplate(order, customerEmail || "N/A", `${CLIENT_URL}/admin/orders`),
    });
  }

  return order;
};

const resolvePendingCheckout = async (pending) => {
  if (!pending.transactionId) {
    return { status: "pending" };
  }

  const result = await getTransactionStatus({ onepayTransactionId: pending.transactionId });

  if (!result.success) {
    return { status: result.success === false ? "failed" : "pending" };
  }

  const claimed = await PendingOnePayCheckout.findOneAndDelete({ reference: pending.reference });
  if (!claimed) {
    const existingOrder = await findOrderByReference(pending.reference);
    return existingOrder ? { status: "success", order: existingOrder } : { status: "pending" };
  }

  const order = await finalizeOrderFromPending(claimed, result.transactionId || pending.transactionId);
  return { status: "success", order };
};

export const initiateCheckout = async (req, res) => {
  try {
    const { productDetails: rawProducts, receiverDetails } = req.body;

    if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
      return res.status(400).json({ success: false, message: "Order must include at least one product" });
    }

    if (!receiverDetails) {
      return res.status(400).json({ success: false, message: "Receiver details are required" });
    }

    const productDetails = await validateOrderProducts(rawProducts);
    const pricing = calculatePricing(productDetails);
    const customerEmail = await getCustomerEmail(req.user.id);

    const pending = await createPendingCheckoutWithUniqueReference({
      userId: req.user.id,
      productDetails,
      pricing,
      receiverDetails: { ...receiverDetails, userId: req.user.id },
    });

    const { redirectUrl, transactionId } = await createCheckoutLink({
      amount: pricing.grandTotal.toFixed(2),
      currency: "LKR",
      reference: pending.reference,
      customer: {
        firstName: receiverDetails.firstName,
        lastName: receiverDetails.lastName,
        phoneNumber: receiverDetails.phoneNumber,
        email: customerEmail || "",
      },
      redirectUrl: `${CLIENT_URL}/payments/onepay/return?reference=${pending.reference}`,
    });

    if (transactionId) {
      pending.transactionId = transactionId;
      await pending.save();
    }

    return res.status(200).json({
      success: true,
      data: { redirectUrl, transactionId, reference: pending.reference },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to initiate OnePay checkout",
      error: error.details?.error || error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ success: false, message: "reference is required" });
    }

    const existingOrder = await findOrderByReference(reference);
    if (existingOrder) {
      if (!isAdmin(req) && !isOrderOwner(req, existingOrder)) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
      return res.status(200).json({ success: true, data: { status: "success", order: existingOrder } });
    }

    const pending = await PendingOnePayCheckout.findOne({ reference });
    if (!pending) {
      return res.status(404).json({ success: false, message: "Checkout not found or expired" });
    }

    if (!isAdmin(req) && String(pending.userId) !== String(req.user?.id || "")) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    let result = await resolvePendingCheckout(pending);
    for (let attempt = 0; attempt < 2 && result.status === "pending"; attempt += 1) {
      await wait(1500);
      const stillPending = await PendingOnePayCheckout.findOne({ reference });
      if (!stillPending) {
        const order = await findOrderByReference(reference);
        result = order ? { status: "success", order } : { status: "pending" };
        break;
      }
      result = await resolvePendingCheckout(stillPending);
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to verify OnePay payment",
      error: error.message,
    });
  }
};

const extractCallbackToken = (req) =>
  req.headers["x-callback-token"] ||
  req.headers["callback-token"] ||
  req.headers["authorization"] ||
  req.body?.callback_token ||
  req.body?.token ||
  null;

export const handleCallback = async (req, res) => {
  try {
    if (onepayConfig.callbackToken) {
      const receivedToken = extractCallbackToken(req);
      if (receivedToken !== onepayConfig.callbackToken) {
        console.warn(
          "[OnePay] callback token did not match any known location — processing anyway. Raw request for diagnosis:",
          { headers: req.headers, body: req.body }
        );
      }
    }

    const { transaction_id: transactionId, reference } = req.body || {};

    if (!reference && !transactionId) {
      return res.status(200).json({ success: false, message: "Missing reference" });
    }

    const existingOrder = reference
      ? await findOrderByReference(reference)
      : await Order.findOne({ "onepay.transactionId": transactionId });

    if (existingOrder) {
      return res.status(200).json({ success: true });
    }

    const pending = reference
      ? await PendingOnePayCheckout.findOne({ reference })
      : await PendingOnePayCheckout.findOne({ transactionId });

    if (!pending) {
      console.warn("[OnePay] callback received for unknown/expired checkout", { reference, transactionId });
      return res.status(200).json({ success: false, message: "Checkout not found" });
    }

    if (transactionId && !pending.transactionId) {
      pending.transactionId = transactionId;
      await pending.save();
    }

    await resolvePendingCheckout(pending);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[OnePay] callback handling failed:", error);
    return res.status(200).json({ success: false });
  }
};
