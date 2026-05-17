import Product from "../models/Product.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import createSlug from "../utils/createSlug.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      collection,
      setName,
      price,
      description,
      fabric,
      design,
      productCare,
      sizeChartImage,
      colors,
      isFeatured,
      isNewArrival,
    } = req.body;

    if (!name || !collection || !setName || !price || !fabric || !design || !productCare) {
      return res.status(400).json({
        success: false,
        message: "Required product fields are missing",
      });
    }

    const parsedColors = JSON.parse(colors);

    const uploadedImages = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file);
        uploadedImages.push(uploaded);
      }
    }

    const colorsWithImages = parsedColors.map((color) => {
      const selectedImages = color.imageIndexes?.map((index) => uploadedImages[index]) || [];

      return {
        colorName: color.colorName,
        colorCode: color.colorCode,
        images: selectedImages,
        sizes: color.sizes,
      };
    });

    const slug = createSlug(`${collection}-${setName}-${name}`);

    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    const product = await Product.create({
      name,
      slug,
      collection,
      setName,
      price: Number(price),
      description: description || "",
      fabric,
      design,
      productCare,
      sizeChartImage: sizeChartImage || "",
      colors: colorsWithImages,
      isFeatured: isFeatured === "true" || isFeatured === true,
      isNewArrival: isNewArrival === "true" || isNewArrival === true,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
