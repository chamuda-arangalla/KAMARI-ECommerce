import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const labeledImageSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: imageSchema,
  },
  { _id: false }
);

const homeContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "home", unique: true },
    heroImage: imageSchema,
    collectionImage: imageSchema,
    brandStoryImage: imageSchema,
    categories: [labeledImageSchema],
    moodImages: [imageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("HomeContent", homeContentSchema);
