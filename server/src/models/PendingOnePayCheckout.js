import mongoose from "mongoose";

// Holds a checkout's product/pricing/receiver details between "initiate" and
// "payment resolved" for OnePay — no Order document is created until OnePay
// actually confirms success, so this is where that data lives in the meantime.
// TTL-expires abandoned/never-completed checkouts automatically.
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
