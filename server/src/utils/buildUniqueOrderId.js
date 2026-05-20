import Order from "../models/Order.js";

const ORDER_ID_PREFIX = "ORD-";
const STARTING_ORDER_NUMBER = 20011001;

const getOrderNumber = (orderId = "") => {
  const match = orderId.match(/^ORD-(\d+)$/);
  return match ? Number(match[1]) : null;
};

const buildUniqueOrderId = async () => {
  const orders = await Order.find({ orderId: /^ORD-\d+$/ })
    .select("orderId")
    .lean();

  const highestOrderNumber = orders.reduce((highest, order) => {
    const orderNumber = getOrderNumber(order.orderId);
    return orderNumber && orderNumber > highest ? orderNumber : highest;
  }, STARTING_ORDER_NUMBER - 1);

  return `${ORDER_ID_PREFIX}${highestOrderNumber + 1}`;
};

export default buildUniqueOrderId;
