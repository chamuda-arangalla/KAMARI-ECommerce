import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80";

const getProductImages = (product) =>
  product.colors?.flatMap((color) => color.images || []) || [];

const getProductStock = (product) => {
  const stock = {};

  product.colors?.forEach((color) => {
    color.sizes?.forEach((item) => {
      stock[item.size] = (stock[item.size] || 0) + Number(item.stock || 0);
    });
  });

  return stock;
};

export const mapBackendProductToAdminProduct = (product) => {
  const images = getProductImages(product);
  const stock = getProductStock(product);
  const tags = [];

  if (product.isFeatured) tags.push("Featured");
  if (product.isNewArrival) tags.push("New");
  if (product.isSoldOut || Object.values(stock).every((count) => count === 0)) {
    tags.push("Sold Out");
  }

  return {
    id: product._id,
    name: product.name,
    collection: product.collection,
    setName: product.setName,
    price: product.price,
    image: images[0]?.url || FALLBACK_IMAGE,
    tags,
    stock,
    isSoldOut: Boolean(product.isSoldOut),
    raw: product,
  };
};

export const mapBackendProductToCollectionProduct = (product) => {
  const images = getProductImages(product);
  const sizes =
    product.colors
      ?.flatMap((color) => color.sizes || [])
      .filter((item) => Number(item.stock || 0) > 0)
      .map((item) => item.size) || [];
  const uniqueSizes = [...new Set(sizes)];
  const colors =
    product.colors?.map((color) => ({
      name: color.colorName,
      hex: color.colorCode || "#d7ccc3",
      img: color.images?.[0]?.url || null,
      img2: color.images?.[1]?.url || color.images?.[0]?.url || null,
    })) || [];
  const totalStock = Object.values(getProductStock(product)).reduce(
    (sum, count) => sum + count,
    0,
  );

  return {
    id: product._id,
    name: product.name,
    category: product.setName || product.collection,
    collection: product.collection,
    price: product.price,
    badge: product.isFeatured
      ? "BEST SELLER"
      : product.isNewArrival
        ? "NEW"
        : null,
    inStock: !product.isSoldOut && totalStock > 0,
    colors,
    sizes: uniqueSizes,
    img: images[0]?.url || FALLBACK_IMAGE,
    img2: images[1]?.url || images[0]?.url || FALLBACK_IMAGE,
    raw: product,
  };
};

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/api/products`);
  return response.data;
};

export const getProductById = async (id, token) => {
  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : undefined;
  const response = await axios.get(`${API_URL}/api/products/${id}`, config);

  return response.data;
};

export const updateProduct = async (id, payload, token) => {
  const response = await axios.put(`${API_URL}/api/products/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteProduct = async (id, token) => {
  const response = await axios.delete(`${API_URL}/api/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createProduct = async (formData, token) => {
  const response = await axios.post(`${API_URL}/api/products`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
