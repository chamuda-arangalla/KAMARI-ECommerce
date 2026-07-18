import mongoose from "mongoose";

const pendingOnePayCheckoutSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true, trim: true },
  userId: { type: String, required: true },
  productDetails: { type: Array, required: true },
  pricing: { type: Object, required: true },
  receiverDetails: { type: Object, required: true },
  transactionId: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

export default mongoose.model("PendingOnePayCheckout", pendingOnePayCheckoutSchema);
