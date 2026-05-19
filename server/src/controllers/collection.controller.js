import Collection from "../models/Collection.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

const uploadImage = async (file) => {
  if (!file) return null;
  return uploadToCloudinary(file, "kamari/collections");
};

const deleteImage = async (publicId) => {
  if (!publicId) return;
  try { await cloudinary.uploader.destroy(publicId); } catch { /* silent */ }
};

export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    return res.status(200).json({ success: true, data: collections });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch collections", error: error.message });
  }
};

export const getAllCollectionsAdmin = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ displayOrder: 1, createdAt: 1 });
    return res.status(200).json({ success: true, data: collections });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch collections", error: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const { name, subtitle, description, displayOrder } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Collection name is required" });

    const exists = await Collection.findOne({ name: name.trim() });
    if (exists) return res.status(409).json({ success: false, message: "A collection with this name already exists" });

    const uploaded = await uploadImage(req.file);

    const collection = await Collection.create({
      name: name.trim(),
      subtitle: subtitle || "",
      description: description || "",
      image: uploaded ? { url: uploaded.url, publicId: uploaded.publicId } : { url: "", publicId: "" },
      displayOrder: Number(displayOrder) || 0,
    });

    return res.status(201).json({ success: true, message: "Collection created", data: collection });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create collection", error: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subtitle, description, isActive, displayOrder } = req.body;

    const collection = await Collection.findById(id);
    if (!collection) return res.status(404).json({ success: false, message: "Collection not found" });

    if (name && name.trim() !== collection.name) {
      const exists = await Collection.findOne({ name: name.trim(), _id: { $ne: id } });
      if (exists) return res.status(409).json({ success: false, message: "A collection with this name already exists" });
      collection.name = name.trim();
    }

    if (subtitle     !== undefined) collection.subtitle     = subtitle;
    if (description  !== undefined) collection.description  = description;
    if (isActive     !== undefined) collection.isActive     = isActive === "true" || isActive === true;
    if (displayOrder !== undefined) collection.displayOrder = Number(displayOrder);

    if (req.file) {
      await deleteImage(collection.image?.publicId);
      const uploaded = await uploadImage(req.file);
      collection.image = { url: uploaded.url, publicId: uploaded.publicId };
    }

    await collection.save();
    return res.status(200).json({ success: true, message: "Collection updated", data: collection });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update collection", error: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) return res.status(404).json({ success: false, message: "Collection not found" });
    await deleteImage(collection.image?.publicId);
    return res.status(200).json({ success: true, message: "Collection deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete collection", error: error.message });
  }
};
