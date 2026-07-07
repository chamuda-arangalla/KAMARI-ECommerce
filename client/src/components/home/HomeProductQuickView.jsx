import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/useCart";
import {
  getDefaultSize,
  getProductImages,
  hasStock,
  PRODUCT_FALLBACK_IMAGE,
} from "../productDetails/productDetailsUtils";

export default function HomeProductQuickView({ product, onClose }) {
  const navigate = useNavigate();
  const { handleAddItem } = useCart();

  const [selColorIdx, setSelColorIdx] = useState(0);
  const [selSize, setSelSize] = useState("");
  const [added, setAdded] = useState(false);
  const [openProductId, setOpenProductId] = useState(null);

  if (!product) return null;

  if (product._id !== openProductId) {
    setOpenProductId(product._id);
    setSelColorIdx(0);
    setSelSize(getDefaultSize(product.colors?.[0]));
    setAdded(false);
  }

  const colors = product.colors || [];
  const selColor = colors[selColorIdx];
  const images = selColor?.images?.length
    ? selColor.images
    : getProductImages(product);
  const mainImage = images[0]?.url || PRODUCT_FALLBACK_IMAGE;

  const selSizeItem = selColor?.sizes?.find((size) => size.size === selSize);
  const canAdd = Boolean(selColor && selSize && hasStock(selSizeItem));

  const selectColor = (index) => {
    setSelColorIdx(index);
    setSelSize(getDefaultSize(colors[index]));
    setAdded(false);
  };

  const addToCart = () => {
    if (!canAdd) return;

    handleAddItem({
      id: `${product._id}-${selColor.colorName}-${selSize}`,
      productId: product._id,
      name: product.name,
      variant: selColor.colorName,
      size: selSize,
      price: Number(product.price || 0),
      qty: 1,
      img: mainImage,
    });
    setAdded(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden bg-white sm:grid-cols-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#2C2B28] shadow-sm transition hover:bg-white"
          >
            <X size={18} />
          </button>

          <div className="aspect-3/4 w-full bg-[#f4f1ee]">
            <img
              src={mainImage}
              alt={product.name}
              className="h-full w-full object-cover object-top"
            />
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <p className="mb-1 text-xs uppercase tracking-[0.16em] text-[#8f8376]">
              {product.setName || product.collection}
            </p>
            <h3 className="mb-2 text-xl font-semibold uppercase leading-snug text-[#2C2B28]">
              {product.name}
            </h3>
            <p className="mb-6 text-lg text-[#2C2B28]">
              Rs {Number(product.price || 0).toLocaleString()}
            </p>

            {colors.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#8f8376]">
                  Color
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, index) => (
                    <button
                      key={color._id || color.colorName}
                      type="button"
                      onClick={() => selectColor(index)}
                      title={color.colorName}
                      className={`h-7 w-7 rounded-full border transition ${
                        index === selColorIdx
                          ? "ring-2 ring-[#2C2B28] ring-offset-2"
                          : "border-black/15"
                      }`}
                      style={{ backgroundColor: color.colorCode || "#ccc" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {selColor?.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#8f8376]">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {selColor.sizes.map((size) => (
                    <button
                      key={size.size}
                      type="button"
                      disabled={!hasStock(size)}
                      onClick={() => {
                        setSelSize(size.size);
                        setAdded(false);
                      }}
                      className={`rounded border px-3 py-1.5 text-sm transition ${
                        selSize === size.size
                          ? "border-[#2C2B28] bg-[#2C2B28] text-white"
                          : "border-black/15 text-[#2C2B28]"
                      } ${!hasStock(size) ? "cursor-not-allowed opacity-30" : ""}`}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-3">
              <button
                type="button"
                onClick={addToCart}
                disabled={!canAdd}
                className={`w-full rounded-lg py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition ${
                  canAdd ? "bg-[#2C2B28] hover:bg-[#2C2B28]/90" : "cursor-not-allowed bg-[#2C2B28]/40"
                }`}
              >
                {added ? "Added to Bag" : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/products/${product._id}`)}
                className="w-full rounded-lg border border-[#2C2B28] py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#2C2B28] transition hover:bg-[#2C2B28] hover:text-white"
              >
                View Full Details
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
