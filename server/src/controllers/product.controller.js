import Product from "../models/Product.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import createSlug from "../utils/createSlug.js";
import mongoose from "mongoose";

const isValidProductId = (id) => mongoose.Types.ObjectId.isValid(id);

const parseColors = (colors) => {
  if (!colors) return undefined;
  return typeof colors === "string" ? JSON.parse(colors) : colors;
};

const toBoolean = (value) => value === true || value === "true";

const getUploadedFiles = (req, fieldName) => {
  if (Array.isArray(req.files)) return fieldName === "images" ? req.files : [];
  return req.files?.[fieldName] || [];
};

const uploadFiles = async (files = []) => {
  const uploadedFiles = [];

  for (const file of files) {
    const uploaded = await uploadToCloudinary(file);
    uploadedFiles.push(uploaded);
  }

  return uploadedFiles;
};

const buildColorsWithUploadedImages = (parsedColors, uploadedImages) =>
  parsedColors.map((color) => {
    const selectedImages =
      color.imageIndexes?.map((index) => uploadedImages[index]).filter(Boolean) || [];

    return {
      colorName: color.colorName,
      colorCode: color.colorCode,
      images: [...(color.images || []), ...selectedImages],
      sizes: color.sizes,
    };
  });

const hasAvailableStock = (colors = []) =>
  colors.some((color) =>
    (color.sizes || []).some((size) => Number(size.stock || 0) > 0),
  );

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

    const parsedColors = parseColors(colors);

    const uploadedImages = await uploadFiles(getUploadedFiles(req, "images"));
    const uploadedSizeChart = await uploadFiles(getUploadedFiles(req, "sizeChartImage"));
    const colorsWithImages = buildColorsWithUploadedImages(parsedColors, uploadedImages);

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
      sizeChartImage: uploadedSizeChart[0]?.url || sizeChartImage || "",
      colors: colorsWithImages,
      isFeatured: toBoolean(isFeatured),
      isNewArrival: toBoolean(isNewArrival),
      isSoldOut: !hasAvailableStock(colorsWithImages),
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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidProductId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidProductId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({ _id: id, isActive: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

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
      isSoldOut,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (collection !== undefined) product.collection = collection;
    if (setName !== undefined) product.setName = setName;
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description;
    if (fabric !== undefined) product.fabric = fabric;
    if (design !== undefined) product.design = design;
    if (productCare !== undefined) product.productCare = productCare;
    const uploadedImages = await uploadFiles(getUploadedFiles(req, "images"));
    const uploadedSizeChart = await uploadFiles(getUploadedFiles(req, "sizeChartImage"));

    if (sizeChartImage !== undefined) product.sizeChartImage = sizeChartImage;
    if (uploadedSizeChart[0]?.url) product.sizeChartImage = uploadedSizeChart[0].url;
    if (isFeatured !== undefined) product.isFeatured = toBoolean(isFeatured);
    if (isNewArrival !== undefined) product.isNewArrival = toBoolean(isNewArrival);
    if (isSoldOut !== undefined) product.isSoldOut = toBoolean(isSoldOut);

    const parsedColors = parseColors(colors);
    if (parsedColors) {
      const colorsWithImages = buildColorsWithUploadedImages(parsedColors, uploadedImages);

      product.colors = colorsWithImages.map((color) => ({
        colorName: color.colorName,
        colorCode: color.colorCode || "",
        images: color.images || [],
        sizes: (color.sizes || []).map((item) => ({
          size: item.size,
          stock: Number(item.stock || 0),
        })),
      }));
      product.isSoldOut = !hasAvailableStock(product.colors);
    }

    const nextSlug = createSlug(`${product.collection}-${product.setName}-${product.name}`);
    const existingProduct = await Product.findOne({
      _id: { $ne: product._id },
      slug: nextSlug,
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Another product already uses this name, collection, and set",
      });
    }

    product.slug = nextSlug;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidProductId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({ _id: id, isActive: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = false;
    product.isSoldOut = true;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: { id: product._id },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
