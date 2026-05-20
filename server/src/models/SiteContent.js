import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    pageType: { type: String, required: true, unique: true, enum: ["about", "contact"] },
    content:  { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("SiteContent", siteContentSchema);
