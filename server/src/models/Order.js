import mongoose from "mongoose";
import ORDER_STATUS from "../enums/orderStatus.enum.js";
import PAYMENT_STATUS from "../enums/paymentStatus.enum.js";
import PAYMENT_TYPE from "../enums/paymentType.enum.js";
import PAYMENT_METHOD from "../enums/paymentMethod.enum.js";

const productDetailsSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    colour: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false },
);

const pricingSchema = new mongoose.Schema(
  {
    subTotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const locationSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    province: { type: String, required: true, trim: true },
    country: { type: String, default: "Sri Lanka", trim: true },
    postalCode: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const receiverDetailsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    location: { type: locationSchema, required: true },
    phoneNumber: { type: String, required: true, trim: true },
    secondaryPhoneNumber: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, trim: true },
  productDetails: {
    type: [productDetailsSchema],
    required: true,
    validate: {
      validator: (products) => products.length > 0,
      message: "Order must include at least one product.",
    },
  },
  pricing: { type: pricingSchema, required: true },
  receiverDetails: { type: receiverDetailsSchema, required: true },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
  },
  paymentMethod: {
    type: String,
    enum: [...Object.values(PAYMENT_METHOD), "koko"],
    default: PAYMENT_METHOD.BANK_TRANSFER,
  },
  orderStatus: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.CREATED,
  },
  paymentSlip: {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  kokoTransactionId: {
    type: String,
    default: "",
    trim: true,
  },
  paymentType: {
    type: Number,
    enum: Object.values(PAYMENT_TYPE),
    required: true,
    default: PAYMENT_TYPE.BANK_TRANSFER,
  },
  onepay: {
    transactionId: { type: String, default: "" },
    verifiedAt: { type: Date, default: null },
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
