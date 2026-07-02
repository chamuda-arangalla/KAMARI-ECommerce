import { motion } from "framer-motion";
import { fadeUp, getHomeProductImage } from "./homeConstants";

export default function HomeProductCard({
  product,
  badge,
  onClick,
  imageAspect = "aspect-square",
  rounded = true,
  fullBleed = false,
}) {
  const img1 = getHomeProductImage(product);
  const img2 =
    product?.colors?.flatMap((color) => color.images || [])?.[1]?.url || img1;
  const colors = product.colors || [];

  if (fullBleed) {
    return (
      <div className="group cursor-pointer" onClick={onClick}>
        <div className={`relative ${imageAspect} overflow-hidden bg-[#f8f8f8]`}>
          <img
            src={img1}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />

          {badge && (
            <span
              className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                badge === "New"
                  ? "border border-[#2C2B28] bg-[#EAE0D6] text-[#2C2B28]"
                  : "bg-[#2C2B28] text-[#EAE0D6]"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`relative mb-3 ${imageAspect} overflow-hidden bg-[#f8f8f8] ${rounded ? "rounded-xl" : ""}`}
      >
        <img
          src={img1}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:opacity-0"
        />
        <img
          src={img2}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition duration-700 group-hover:opacity-100"
        />

        {badge && (
          <span
            className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              badge === "New"
                ? "border border-[#2C2B28] bg-[#EAE0D6] text-[#2C2B28]"
                : "bg-[#2C2B28] text-[#EAE0D6]"
            }`}
          >
            {badge}
          </span>
        )}

        <button className="absolute inset-x-3 bottom-3 z-10 rounded-lg bg-[#2C2B28] py-3 text-xs font-medium uppercase tracking-[0.12em] text-white opacity-0 transition duration-300 group-hover:opacity-100">
          View Product
        </button>
      </div>

      <div>
        <p className="mb-0.5 text-xs uppercase tracking-[0.1em] text-[#8f8376]">
          {product.setName || product.collection}
        </p>
        <h4 className="mb-2 text-sm font-medium leading-snug text-[#2C2B28]">
          {product.name}
        </h4>

        <div className="mb-2 flex gap-1.5">
          {colors.slice(0, 4).map((color) => (
            <span
              key={color._id || color.colorName}
              className="inline-block h-3.5 w-3.5 rounded-full border border-black/10"
              style={{ backgroundColor: color.colorCode || "#ccc" }}
              title={color.colorName}
            />
          ))}
          {colors.length > 4 && (
            <span className="text-[11px] text-[#5F564D]">+{colors.length - 4}</span>
          )}
        </div>

        <p className="text-sm text-[#2C2B28]">
          Rs {Number(product.price || 0).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
