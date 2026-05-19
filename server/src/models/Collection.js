import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, unique: true, trim: true },
    subtitle:     { type: String, default: "" },
    description:  { type: String, default: "" },
    image: {
      url:       { type: String, default: "" },
      publicId:  { type: String, default: "" },
    },
    isActive:     { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);
