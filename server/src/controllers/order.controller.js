import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import PAYMENT_STATUS from "../enums/paymentStatus.enum.js";
import buildUniqueOrderId from "../utils/buildUniqueOrderId.js";

const SHIPPING_FEE = Number(process.env.ORDER_SHIPPING_FEE || 350);

const isValidOrderObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isAdmin = (req) => req.user?.role === "admin";

const isOrderOwner = (req, order) =>
  String(order.receiverDetails?.userId || "") === String(req.user?.id || "");

const getOrderFilter = (id) =>
  isValidOrderObjectId(id) ? { _id: id } : { orderId: id };

const matchesText = (left = "", right = "") =>
  String(left).trim().toLowerCase() === String(right).trim().toLowerCase();

const findProductColor = (product, colour) =>
  product.colors.find(
    (color) =>
      matchesText(color.colorName, colour) ||
      (color.colorCode && matchesText(color.colorCode, colour))
  );

const findProductSize = (color, size) =>
  color.sizes.find((sizeOption) => matchesText(sizeOption.size, size));

const validateOrderProducts = async (requestedProducts) => {
  if (!Array.isArray(requestedProducts) || requestedProducts.length === 0) {
    const error = new Error("Order must include at least one product");
    error.statusCode = 400;
    throw error;
  }

  const orderProducts = [];

  for (const requestedProduct of requestedProducts) {
    const { productId, colour, size, quantity } = requestedProduct;

    if (!productId || !colour || !size || !quantity) {
      const error = new Error("Product ID, colour, size, and quantity are required");
      error.statusCode = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error(`Invalid product ID: ${productId}`);
      error.statusCode = 400;
      throw error;
    }

    const requestedQuantity = Number(quantity);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      const error = new Error("Product quantity must be a positive whole number");
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      const error = new Error(`Product not found: ${productId}`);
      error.statusCode = 404;
      throw error;
    }

    if (product.isSoldOut) {
      const error = new Error(`${product.name} is sold out`);
      error.statusCode = 400;
      throw error;
    }

    const selectedColor = findProductColor(product, colour);

    if (!selectedColor) {
      const error = new Error(`${product.name} is not available in ${colour}`);
      error.statusCode = 400;
      throw error;
    }

    const selectedSize = findProductSize(selectedColor, size);

    if (!selectedSize) {
      const error = new Error(`${product.name} is not available in size ${size}`);
      error.statusCode = 400;
      throw error;
    }

    if (selectedSize.stock < requestedQuantity) {
      const error = new Error(
        `Only ${selectedSize.stock} item(s) available for ${product.name} ${selectedColor.colorName} ${selectedSize.size}`
      );
      error.statusCode = 400;
      throw error;
    }

    orderProducts.push({
      productId: String(product._id),
      productName: product.name,
      colour: selectedColor.colorName,
      size: selectedSize.size,
      quantity: requestedQuantity,
      unitPrice: product.price,
      discount: 0,
    });
  }

  return orderProducts;
};

const calculatePricing = (productDetails) => {
  const subTotal = productDetails.reduce((total, product) => {
    const discountAmount = (product.unitPrice * product.discount) / 100;
    return total + (product.unitPrice - discountAmount) * product.quantity;
  }, 0);

  return {
    subTotal,
    shippingFee: SHIPPING_FEE,
    grandTotal: subTotal + SHIPPING_FEE,
  };
};

const buildOrderPayload = async (body, orderId) => {
  const productDetails = await validateOrderProducts(body.productDetails);

  return {
  orderId,
  productDetails,
  pricing: calculatePricing(productDetails),
  receiverDetails: body.receiverDetails,
  paymentStatus: PAYMENT_STATUS.PENDING,
  };
};

const createOrderWithUniqueOrderId = async (body) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const orderId = await buildUniqueOrderId();

    try {
      return await Order.create(await buildOrderPayload(body, orderId));
    } catch (error) {
      if (error.code !== 11000 || !error.keyPattern?.orderId) {
        throw error;
      }
    }
  }

  throw new Error("Failed to generate unique order ID");
};

export const createOrder = async (req, res) => {
  try {
    const { productDetails, receiverDetails } = req.body;

    if (!Array.isArray(productDetails) || productDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must include at least one product",
      });
    }

    if (!receiverDetails) {
      return res.status(400).json({
        success: false,
        message: "Receiver details are required",
      });
    }

    const orderBody = {
      ...req.body,
      receiverDetails: {
        ...receiverDetails,
        userId: isAdmin(req) ? receiverDetails.userId || req.user.id : req.user.id,
      },
    };

    const order = await createOrderWithUniqueOrderId(orderBody);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne(getOrderFilter(req.params.id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!isAdmin(req) && !isOrderOwner(req, order)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const getOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
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
        message: "Not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order by order ID",
      error: error.message,
    });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isAdmin(req) && String(userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these orders",
      });
    }

    const orders = await Order.find({ "receiverDetails.userId": userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOne(getOrderFilter(req.params.id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const { productDetails, receiverDetails, paymentStatus } = req.body;

    if (productDetails !== undefined) {
      const updatedProductDetails = await validateOrderProducts(productDetails);
      order.productDetails = updatedProductDetails;
      order.pricing = calculatePricing(updatedProductDetails);
    }
    if (receiverDetails !== undefined) order.receiverDetails = receiverDetails;
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete(getOrderFilter(req.params.id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: { id: order._id, orderId: order.orderId },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};
