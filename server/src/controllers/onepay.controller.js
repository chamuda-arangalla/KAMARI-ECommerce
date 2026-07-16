import Order from "../models/Order.js";
import PAYMENT_STATUS from "../enums/paymentStatus.enum.js";
import PAYMENT_METHOD from "../enums/paymentMethod.enum.js";
import onepayConfig from "../config/onepay.js";
import { createCheckoutLink, getTransactionStatus } from "../utils/onepayClient.js";
import {
  applyOrderPaymentUpdate,
  getOrderFilter,
  getCustomerEmail,
  isAdmin,
  isOrderOwner,
} from "./order.controller.js";

const CLIENT_URL = process.env.CLIENT_URL;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loadOrder = async (orderId) => Order.findOne(getOrderFilter(orderId));

// Independently confirms the payment with OnePay's own status API and applies the
// result. Never trusts a paymentStatus/status field handed to us by the client or
// by OnePay's callback body directly. Idempotent once complete: a completed order
// is a no-op, so duplicate callbacks/verify calls can't double-fire emails or
// re-advance orderStatus. "failed" is intentionally NOT terminal here — the
// customer can retry (see initiateCheckout), and a retry overwrites
// onepay.transactionId with the new attempt's ID, so this always re-checks
// whichever transaction is current.
const verifyAndApplyOnePayStatus = async (order) => {
  if (order.paymentStatus === PAYMENT_STATUS.COMPLETE) {
    return order;
  }

  const transactionId = order.onepay?.transactionId;
  if (!transactionId) {
    return order;
  }

  const result = await getTransactionStatus({ onepayTransactionId: transactionId });

  order.onepay.verifiedAt = new Date();
  if (result.transactionId) order.onepay.transactionId = result.transactionId;

  await applyOrderPaymentUpdate(order, {
    paymentStatus: result.success ? PAYMENT_STATUS.COMPLETE : PAYMENT_STATUS.FAILED,
  });

  return order;
};

export const initiateCheckout = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    const order = await loadOrder(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!isAdmin(req) && !isOrderOwner(req, order)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (order.paymentMethod !== PAYMENT_METHOD.ONEPAY) {
      return res.status(400).json({ success: false, message: "Order is not set up for OnePay" });
    }

    // A previous attempt on this order may have failed (paymentStatus "failed"),
    // which must still be retryable — only a completed payment blocks re-initiation.
    if (order.paymentStatus === PAYMENT_STATUS.COMPLETE) {
      return res.status(409).json({ success: false, message: "Order payment is already settled" });
    }

    const receiver = order.receiverDetails || {};
    const amount = Number(order.pricing?.grandTotal || 0).toFixed(2);
    const customerEmail = await getCustomerEmail(receiver.userId);

    const { redirectUrl, transactionId } = await createCheckoutLink({
      amount,
      currency: "LKR",
      reference: order.orderId,
      customer: {
        firstName: receiver.firstName,
        lastName: receiver.lastName,
        phoneNumber: receiver.phoneNumber,
        email: customerEmail || "",
      },
      redirectUrl: `${CLIENT_URL}/payments/onepay/return?orderId=${order.orderId}`,
    });

    if (transactionId) {
      order.onepay.transactionId = transactionId;
      await order.save();
    }

    return res.status(200).json({ success: true, data: { redirectUrl, transactionId } });
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
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    let order = await loadOrder(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!isAdmin(req) && !isOrderOwner(req, order)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // The server-to-server callback may not have arrived yet (it races the
    // browser redirect), so give it a short bounded window to show up before
    // reporting back "still pending" to the client.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      order = await verifyAndApplyOnePayStatus(order);
      if (order.paymentStatus !== PAYMENT_STATUS.PENDING) break;
      if (attempt < 2) {
        await wait(1500);
        order = await loadOrder(orderId);
      }
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to verify OnePay payment",
      error: error.message,
    });
  }
};

// Extracts the Callback Token set in the OnePay dashboard's App config from
// whichever spot OnePay actually sends it back in — not documented anywhere in
// OnePay's public docs, so every plausible location is checked defensively until
// a real callback delivery confirms which one to rely on.
const extractCallbackToken = (req) =>
  req.headers["x-callback-token"] ||
  req.headers["callback-token"] ||
  req.headers["authorization"] ||
  req.body?.callback_token ||
  req.body?.token ||
  null;

// Unauthenticated: OnePay cannot present our JWT. The callback body is treated as
// an untrusted "go check" trigger only — verifyAndApplyOnePayStatus always
// independently re-confirms the outcome via OnePay's own status API before any
// order is mutated. Always resolves 200 so OnePay stops retrying, even when the
// referenced order can't be found.
export const handleCallback = async (req, res) => {
  try {
    // Soft-checked, not enforced: the delivery location for the Callback Token
    // isn't confirmed yet, so a mismatch only logs (with the raw request) instead
    // of rejecting, so the first real callback can be inspected and this tightened
    // into a hard check afterward. verifyAndApplyOnePayStatus's independent
    // OnePay-side re-verification remains the real trust boundary either way.
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

    const order = reference
      ? await Order.findOne(getOrderFilter(reference))
      : await Order.findOne({ "onepay.transactionId": transactionId });

    if (!order) {
      console.warn("[OnePay] callback received for unknown order", { reference, transactionId });
      return res.status(200).json({ success: false, message: "Order not found" });
    }

    if (transactionId && !order.onepay.transactionId) {
      order.onepay.transactionId = transactionId;
      await order.save();
    }

    await verifyAndApplyOnePayStatus(order);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[OnePay] callback handling failed:", error);
    return res.status(200).json({ success: false });
  }
};
