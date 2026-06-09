export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=80";

export const SHOP_PRODUCTS_PER_PAGE = 8;

export const SHOP_TABS = [
  ["all", "All"],
  ["new", "New Arrivals"],
  ["best", "Best Sellers"],
];

export const SHOP_SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "New Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Alphabetical" },
];

export const getProductImages = (product) =>
  product.colors?.flatMap((color) => color.images || []) || [];

export const getTotalStock = (product) =>
  product.colors?.reduce(
    (total, color) =>
      total +
      (color.sizes?.reduce(
        (sum, size) => sum + Number(size.stock || 0),
        0,
      ) || 0),
    0,
  ) || 0;

export const isProductInStock = (product) =>
  !product.isSoldOut && getTotalStock(product) > 0;

export const getFirstAvailableVariant = (product) => {
  const color =
    product.colors?.find((item) =>
      item.sizes?.some((size) => Number(size.stock || 0) > 0),
    ) || product.colors?.[0];
  const size =
    color?.sizes?.find((item) => Number(item.stock || 0) > 0) ||
    color?.sizes?.[0];

  return {
    colorName: color?.colorName || "Default",
    size: size?.size || "S",
  };
};

export const isColorSoldOut = (color) =>
  color.sizes?.every((size) => Number(size.stock || 0) === 0);
