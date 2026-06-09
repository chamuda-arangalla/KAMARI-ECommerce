import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HomeProductCard from "./HomeProductCard";
import { fadeUp, sectionReveal, stagger } from "./homeConstants";

export default function HomeProductSection({
  badge,
  eyebrow,
  products,
  title,
  viewAllTo,
  variant = "light",
  onOpenProduct,
}) {
  if (!products.length) return null;

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      className={variant === "white" ? "bg-white py-16" : "bg-[#F8F5F2] py-16"}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#7D746C]">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-light tracking-wide">{title}</h2>
          </div>
          <Link
            to={viewAllTo}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#7D746C] transition hover:text-[#3B302A]"
          >
            View All <ArrowRight size={14} />
          </Link>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {products.map((product) => (
            <HomeProductCard
              key={product._id}
              product={product}
              badge={badge}
              onClick={() => onOpenProduct(product)}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
