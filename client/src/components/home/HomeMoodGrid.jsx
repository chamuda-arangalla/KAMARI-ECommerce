import { motion } from "framer-motion";
import { fadeIn, fadeUp, stagger } from "./homeConstants";

export default function HomeMoodGrid({ products, onOpenProduct }) {
  const allImages = products
    .flatMap((product) =>
      (product.colors || []).flatMap((color) =>
        (color.images || []).map((img) => ({
          url: img.url,
          productId: product._id,
        })),
      ),
    )
    .filter((img) => img.url)
    .slice(0, 5);

  if (allImages.length < 3) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-[#5F564D]">
          Style Gallery
        </p>
      </motion.div>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-3 gap-3 md:grid-cols-5"
      >
        {allImages.map((img, index) => (
          <motion.div
            key={`${img.productId}-${index}`}
            variants={fadeIn}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer overflow-hidden rounded-xl"
            style={{ aspectRatio: "1/1" }}
            onClick={() => onOpenProduct(img.productId)}
          >
            <img
              src={img.url}
              alt="KAMARI style"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition duration-500 hover:scale-110"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
