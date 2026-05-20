import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and WEBP files are allowed"), false);
  }

  cb(null, true);
};

export const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "images", maxCount: 30 },
  { name: "sizeChartImage", maxCount: 1 },
]);

export const uploadCollectionImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export const uploadHomeImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: "heroImage", maxCount: 1 },
  { name: "collectionImage", maxCount: 1 },
  { name: "brandStoryImage", maxCount: 1 },
  { name: "categoryImage0", maxCount: 1 },
  { name: "categoryImage1", maxCount: 1 },
  { name: "categoryImage2", maxCount: 1 },
  { name: "categoryImage3", maxCount: 1 },
  { name: "moodImage0", maxCount: 1 },
  { name: "moodImage1", maxCount: 1 },
  { name: "moodImage2", maxCount: 1 },
  { name: "moodImage3", maxCount: 1 },
  { name: "moodImage4", maxCount: 1 },
]);
