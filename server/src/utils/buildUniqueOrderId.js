import Order from "../models/Order.js";
import PendingOnePayCheckout from "../models/PendingOnePayCheckout.js";

const ORDER_ID_PREFIX = "ORD-";
const STARTING_ORDER_NUMBER = 20011001;

const getOrderNumber = (orderId = "") => {
  const match = orderId.match(/^ORD-(\d+)$/);
  return match ? Number(match[1]) : null;
};

const highestOrderNumberIn = (values) =>
  values.reduce((highest, value) => {
    const orderNumber = getOrderNumber(value);
    return orderNumber && orderNumber > highest ? orderNumber : highest;
  }, STARTING_ORDER_NUMBER - 1);

const buildUniqueOrderId = async () => {
  const [orders, pendingCheckouts] = await Promise.all([
    Order.find({ orderId: /^ORD-\d+$/ }).select("orderId").lean(),
    PendingOnePayCheckout.find({ reference: /^ORD-\d+$/ }).select("reference").lean(),
  ]);

  const highestOrderNumber = Math.max(
    highestOrderNumberIn(orders.map((order) => order.orderId)),
    highestOrderNumberIn(pendingCheckouts.map((pending) => pending.reference)),
  );

  return `${ORDER_ID_PREFIX}${highestOrderNumber + 1}`;
};

export default buildUniqueOrderId;
