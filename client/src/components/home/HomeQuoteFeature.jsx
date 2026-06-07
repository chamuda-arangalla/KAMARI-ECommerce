import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { BRAND_IMG, fadeIn, fadeUp, sectionReveal } from "./homeConstants";

export default function HomeQuoteFeature({ onNavigate }) {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-6 py-16 md:grid-cols-2 md:gap-8"
    >
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9 }}
        className="relative min-h-[360px] overflow-hidden rounded-xl md:min-h-[420px]"
      >
        <img
          src={BRAND_IMG}
          alt="KAMARI clothing style"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2B28]/62 via-[#2C2B28]/12 to-transparent" />
        <div className="absolute bottom-7 left-7">
          <p className="text-xs uppercase tracking-[0.2em] text-white/75">
            Collections
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
        className="flex min-h-[360px] items-center justify-center rounded-xl bg-[#EFE7DF] px-8 py-12 text-center md:min-h-[420px] md:px-10"
      >
        <div>
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#D7C9B8] bg-[#EAD9C4] text-[#5F564D]">
            <Quote size={18} />
          </div>
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#5F564D]">
            About KAMARI
          </p>
          <blockquote className="mb-5 text-3xl font-light leading-snug text-[#2C2B28]">
            Everyday style,
            <br />
            effortlessly Sri Lankan.
          </blockquote>
          <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-[#6E625C]">
            We design modern women's clothing for the Sri Lankan lifestyle,
            comfortable, versatile and beautifully made for every occasion.
          </p>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => onNavigate("/collections")}
            className="inline-flex items-center gap-2 rounded-full border border-[#2C2B28]/40 px-8 py-3 text-xs uppercase tracking-[0.16em] text-[#2C2B28] transition hover:border-[#2C2B28] hover:bg-[#2C2B28] hover:text-[#EAE0D6]"
          >
            Explore Collections <ArrowRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  );
}
