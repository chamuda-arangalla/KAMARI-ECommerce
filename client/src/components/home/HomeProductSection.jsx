import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HomeProductCard from "./HomeProductCard";
import { fadeUp, sectionReveal, stagger } from "./homeConstants";

export default function HomeProductSection({
  eyebrow,
  products,
  title,
  viewAllTo,
  variant = "light",
  imageAspect,
  fullBleed = false,
  cols = 2,
  mobileSingle = false,
  mobileFirstOnly = false,
  headerPadding = "py-5 md:py-8",
  onOpenProduct,
}) {
  if (!products.length) return null;

  const sectionWidth =
    products.length >= 4
      ? "max-w-7xl"
      : products.length === 3
        ? "max-w-5xl"
        : "max-w-3xl";

  if (fullBleed) {
    return (
      <section className={variant === "white" ? "bg-white" : "bg-[#EAE0D6]"}>
        <div
          className={`flex items-center justify-between gap-4 px-4 sm:px-8 md:px-10 lg:px-10 ${headerPadding}`}
        >
          <h2
            className="text-lg font-light normal-case tracking-[0.08em] text-[#2C2B28] md:text-xl lg:text-2xl"
            style={{ textTransform: "none" }}
          >
            {title}
          </h2>
        </div>
        <div
          className={`grid gap-0 ${
            mobileSingle
              ? "grid-cols-1 md:grid-cols-2"
              : cols === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-2"
          }`}
        >
          {products.map((product, index) => (
            <div
              key={product._id}
              className={mobileFirstOnly && index > 0 ? "hidden sm:block" : "block"}
            >
              <HomeProductCard
                product={product}
                imageAspect={imageAspect}
                rounded={false}
                fullBleed
                onClick={() => onOpenProduct(product)}
              />
            </div>
          ))}
        </div>
      </section>
    );
  } 

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      className={variant === "white" ? "bg-white py-16" : "bg-[#EAE0D6] py-16"}
    >
      <div className={`mx-auto ${sectionWidth} px-6`}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#5F564D]">
              {eyebrow}
            </p>
            <h2 className="text-3xl normal-case" style={{ textTransform: "none" }}>
              {title}
            </h2>
          </div>
          <Link
            to={viewAllTo}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#5F564D] transition hover:text-[#2C2B28]"
          >
            View All <ArrowRight size={14} />
          </Link>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]"
        >
          {products.map((product) => (
            <HomeProductCard
              key={product._id}
              product={product}
              imageAspect={imageAspect}
              onClick={() => onOpenProduct(product)}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
