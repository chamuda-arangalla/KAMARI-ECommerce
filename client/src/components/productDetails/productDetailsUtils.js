export const PRODUCT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80";

export const getProductImages = (product) =>
  product?.colors?.flatMap((color) => color.images || []) || [];

export const hasStock = (size) => Number(size?.stock || 0) > 0;

export const getProductStockCount = (product) =>
  product?.colors?.reduce(
    (total, color) =>
      total +
      (color.sizes?.reduce(
        (sum, size) => sum + Number(size.stock || 0),
        0,
      ) || 0),
    0,
  ) || 0;

export const isColorSoldOut = (color) =>
  color.sizes?.every((size) => Number(size.stock || 0) === 0);

export const isProductInStock = (product) =>
  !product?.isSoldOut && getProductStockCount(product) > 0;

export const getDefaultSize = (color) =>
  color?.sizes?.find(hasStock)?.size || color?.sizes?.[0]?.size || "";
