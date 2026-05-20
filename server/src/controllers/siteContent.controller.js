import SiteContent from "../models/SiteContent.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const getPageContent = async (req, res) => {
  try {
    const { pageType } = req.params;
    const doc = await SiteContent.findOne({ pageType });
    if (!doc) return res.status(404).json({ success: false, message: "Content not found" });
    return res.status(200).json({ success: true, data: doc.content });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch content", error: error.message });
  }
};

export const uploadContentImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });
    const result = await uploadToCloudinary(req.file, "kamari/site-content");
    return res.status(200).json({ success: true, url: result.url, publicId: result.publicId });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Image upload failed", error: error.message });
  }
};

export const upsertPageContent = async (req, res) => {
  try {
    const { pageType } = req.params;
    const doc = await SiteContent.findOneAndUpdate(
      { pageType },
      { $set: { content: req.body } },
      { upsert: true, new: true, runValidators: true }
    );
    return res.status(200).json({ success: true, message: "Content updated", data: doc.content });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update content", error: error.message });
  }
};
