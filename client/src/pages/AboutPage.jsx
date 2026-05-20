import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Leaf, Award, Users } from "lucide-react";
import { getSiteContent } from "../services/siteContentApi";

const fadeUp  = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const fadeIn  = { hidden: { opacity: 0 },         visible: { opacity: 1 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

const VALUE_ICONS = [Heart, Leaf, Award, Users];

const DEFAULTS = {
  heroTitle: "About KAMARI",
  heroSubtitle: "Contemporary women's fashion for the modern Sri Lankan lifestyle.",
  heroImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85",
  storyTitle: "Dressing the modern Sri Lankan woman",
  storyImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85",
  storyParagraphs: [
    "KAMARI was born from a simple belief — that every woman deserves clothing that is both beautiful and practical.",
    "From casual t-shirts and comfortable trousers to elegant frocks and co-ord sets, our collections are thoughtfully designed for the Sri Lankan climate, culture and lifestyle.",
    "Every KAMARI piece is made with quality fabrics, careful construction and a design eye that celebrates the modern Sri Lankan woman.",
  ],
  values: [
    { title: "Made with Care",     description: "Every piece is crafted with attention to detail, ensuring comfort and quality that you can feel from the first wear." },
    { title: "Sustainably Minded", description: "We work with responsible suppliers and use quality fabrics that are built to last, reducing unnecessary waste." },
    { title: "Quality First",      description: "From fabric selection to final stitching, we maintain high standards so that every garment meets our quality promise." },
    { title: "For Every Woman",    description: "Our collections are designed for the modern Sri Lankan woman — versatile, stylish and made for real everyday life." },
  ],
  stats: [
    { number: "5+",    label: "Collections" },
    { number: "40+",   label: "Unique Styles" },
    { number: "1000+", label: "Happy Customers" },
    { number: "2024",  label: "Est. in Sri Lanka" },
  ],
  ctaTitle: "Find your perfect style",
  ctaSubtitle: "Browse our full range of women's fashion — from everyday casuals to smart formals, all designed for you.",
};

export default function AboutPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(DEFAULTS);

  useEffect(() => {
    getSiteContent("about")
      .then((res) => setData({ ...DEFAULTS, ...res.data }))
      .catch(() => setData(DEFAULTS));
  }, []);

  return (
    <main
      className="bg-[#F8F5F2] text-[#3B302A]"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", paddingTop: "70px" }}
    >
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: "65vh", minHeight: 460 }}>
        <motion.img
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
          src={data.heroImage}
          alt="About KAMARI"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B302A]/50 via-[#3B302A]/30 to-[#3B302A]/60" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/70">Our Story</p>
          <h1 className="mb-4 text-5xl font-light tracking-[0.15em] md:text-6xl">{data.heroTitle}</h1>
          <p className="max-w-xl text-base leading-relaxed text-white/80">{data.heroSubtitle}</p>
        </motion.div>
      </section>

      {/* ── Story Section ────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">

          {/* Story image — natural proportions, no cropping */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
            className="overflow-hidden rounded-2xl bg-[#f0ebe5]"
          >
            <img
              src={data.storyImage}
              alt="KAMARI story"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* Story text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#7D746C]">Who We Are</p>
            <h2 className="mb-6 text-4xl font-light leading-snug">{data.storyTitle}</h2>
            <div className="space-y-4 text-sm leading-8 text-[#6E625C]">
              {(data.storyParagraphs || []).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/shop")}
              className="mt-8 rounded-full bg-[#3B302A] px-8 py-3.5 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[#2e2622]"
            >
              Shop the Collection
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#7D746C]">What We Stand For</p>
            <h2 className="text-4xl font-light">Our Values</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {(data.values || []).map(({ title, description }, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <motion.div key={i} variants={fadeUp} className="rounded-2xl border border-[#e8e2dc] bg-[#F8F5F2] p-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE7DF]">
                    <Icon size={24} className="text-[#3B302A]" />
                  </div>
                  <h3 className="mb-3 text-base font-semibold tracking-wide">{title}</h3>
                  <p className="text-sm leading-7 text-[#6E625C]">{description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────── */}
      <section className="bg-[#3B302A] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 gap-10 text-center md:grid-cols-4"
          >
            {(data.stats || []).map(({ number, label }) => (
              <motion.div key={label} variants={fadeUp}>
                <p className="mb-2 text-4xl font-light tracking-wide">{number}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────── */}
      <section className="bg-[#EFE7DF] py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl px-6 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#7D746C]">Ready to explore?</p>
          <h2 className="mb-5 text-4xl font-light">{data.ctaTitle}</h2>
          <p className="mb-8 text-sm leading-7 text-[#6E625C]">{data.ctaSubtitle}</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/shop")}
              className="rounded-full bg-[#3B302A] px-10 py-3.5 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[#2e2622]"
            >
              Shop Now
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/contact")}
              className="rounded-full border border-[#3B302A]/40 px-10 py-3.5 text-xs uppercase tracking-[0.18em] text-[#3B302A] transition hover:bg-[#3B302A] hover:text-white"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
