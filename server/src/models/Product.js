import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const colorSchema = new mongoose.Schema(
  {
    colorName: { type: String, required: true },
    colorCode: { type: String, default: "" },
    images: [imageSchema],
    sizes: [sizeSchema],
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    collection: { type: String, required: true },
    setName: { type: String, required: true },
    price: { type: Number, required: true },

    description: { type: String, default: "" },
    fabric: { type: String, required: true },
    design: { type: String, required: true },
    productCare: { type: String, required: true },
    sizeChartImage: { type: String, default: "" },

    colors: [colorSchema],

    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isSoldOut: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);