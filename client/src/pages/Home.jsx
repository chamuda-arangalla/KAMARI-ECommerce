import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getCollections } from "../services/collectionApi";
import { getProducts } from "../services/productApi";
import homeHeroImg from "../assets/images/Home.jpg";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80";
const HERO_IMG = homeHeroImg;
const BRAND_IMG = "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1000&q=85";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const fadeIn  = { hidden: { opacity: 0 },        visible: { opacity: 1 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const getProductImg = (product) =>
  product?.colors?.flatMap((c) => c.images || [])?.[0]?.url || FALLBACK_IMG;

export default function Home() {
  const navigate = useNavigate();
  const collectionSliderRef = useRef(null);

  const [collections, setCollections]   = useState([]);
  const [newArrivals, setNewArrivals]   = useState([]);
  const [bestSellers, setBestSellers]   = useState([]);

  const scrollCollections = (direction) => {
    const slider = collectionSliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction * Math.min(slider.clientWidth, 420),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Load collections from DB
    getCollections()
      .then((res) => setCollections(res.data || []))
      .catch(() => setCollections([]));

    // Load products from DB
    getProducts()
      .then((res) => {
        const products = res.data || [];
        setNewArrivals(products.filter((p) => p.isNewArrival && !p.isSoldOut).slice(0, 4));
        const featured = products.filter((p) => p.isFeatured && !p.isSoldOut);
        setBestSellers((featured.length ? featured : products.filter((p) => !p.isSoldOut)).slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <main className="bg-[#F8F5F2] text-[#3B302A]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          src={HERO_IMG}
          alt="KAMARI"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B302A]/60 via-[#3B302A]/20 to-transparent" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.9, delay: 0.3 }}
          className="absolute left-[8%] top-1/2 -translate-y-1/2 max-w-lg"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#E8DED6]">New Season</p>
          <h1 className="mb-5 text-6xl font-light tracking-[0.18em] text-white md:text-7xl leading-tight">
            KAMARI
          </h1>
          <p className="mb-8 text-base tracking-[0.08em] text-[#E8DED6] leading-relaxed">
            Contemporary women's fashion for everyday elegance.
          </p>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/shop")}
              className="rounded-full bg-white px-8 py-3.5 text-xs uppercase tracking-[0.18em] text-[#3B302A] transition hover:bg-[#F8F5F2]"
            >
              Shop Now
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/collections")}
              className="rounded-full border border-white/60 px-8 py-3.5 text-xs uppercase tracking-[0.18em] text-white transition hover:border-white"
            >
              Collections
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Shop by Collection ───────────────────────── */}
      {collections.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 flex items-end justify-between"
          >
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#7D746C]">Browse</p>
              <h2 className="text-3xl font-light tracking-wide">Shop by Collection</h2>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute -right-1 -top-16 hidden gap-2 sm:flex">
              <button
                type="button"
                aria-label="Previous collections"
                onClick={() => scrollCollections(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3B302A]/15 bg-white/70 text-[#3B302A] shadow-sm backdrop-blur transition hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next collections"
                onClick={() => scrollCollections(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3B302A]/15 bg-white/70 text-[#3B302A] shadow-sm backdrop-blur transition hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <motion.div
              ref={collectionSliderRef}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {collections.map((col) => (
                <motion.div
                  key={col._id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group w-[70vw] max-w-[260px] flex-shrink-0 snap-start cursor-pointer sm:w-[42vw] md:w-[30vw] lg:w-[220px] xl:w-[235px]"
                  onClick={() => navigate(`/collections?category=${encodeURIComponent(col.name)}`)}
                >
                  <div className="relative mb-3 overflow-hidden rounded-xl bg-[#E8DED6]" style={{ aspectRatio: "3/4" }}>
                    {col.image?.url ? (
                      <img
                        src={col.image.url}
                        alt={col.name}
                        className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#E8DED6]" />
                    )}
                    <div className="absolute inset-0 bg-[#3B302A]/20 transition duration-300 group-hover:bg-[#3B302A]/10" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3B302A]/70 p-4">
                      <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-white">
                        {col.name}
                      </p>
                      {col.subtitle && (
                        <p className="mt-1 text-center text-[10px] text-white/70">{col.subtitle}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── New Arrivals ─────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="bg-white py-16">
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
                <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#7D746C]">Just In</p>
                <h2 className="text-3xl font-light tracking-wide">New Arrivals</h2>
              </div>
              <Link
                to="/collections?sort=newest"
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
              {newArrivals.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  badge="New"
                  onClick={() => navigate(`/products/${product._id}`)}
                />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Feature Banner ───────────────────────────── */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-6 py-16 md:grid-cols-2 md:gap-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9 }}
          className="relative overflow-hidden rounded-xl"
          style={{ height: "420px" }}
        >
          <img
            src={BRAND_IMG}
            alt="KAMARI style"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3B302A]/60 via-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/70">Collections</p>
            <h3 className="text-2xl font-light text-white">Smart Casuals</h3>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center rounded-xl bg-[#EFE7DF] px-10 py-12 text-center"
        >
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#7D746C]">About KAMARI</p>
            <h3 className="mb-5 text-3xl font-light leading-snug">
              Everyday style, <br />effortlessly Sri Lankan.
            </h3>
            <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-[#6E625C]">
              We design modern women's clothing for the Sri Lankan lifestyle — comfortable, versatile and beautifully made for every occasion.
            </p>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/collections")}
              className="rounded-full border border-[#3B302A]/40 px-8 py-3 text-xs uppercase tracking-[0.16em] transition hover:bg-[#3B302A] hover:text-[#F8F5F2] hover:border-[#3B302A]"
            >
              Explore All Collections
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Best Sellers ─────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="bg-[#F8F5F2] py-16">
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
                <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#7D746C]">Popular</p>
                <h2 className="text-3xl font-light tracking-wide">Best Sellers</h2>
              </div>
              <Link
                to="/shop"
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
              {bestSellers.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  badge="Best Seller"
                  onClick={() => navigate(`/products/${product._id}`)}
                />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Product Mood Grid ─────────────────────────── */}
      <MoodGrid products={[...newArrivals, ...bestSellers]} navigate={navigate} />

      {/* ── Newsletter ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-[#3B302A] px-8 py-12 text-center text-white"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#E8DED6]">Stay Connected</p>
          <h3 className="mb-3 text-2xl font-light">Stay close to KAMARI</h3>
          <p className="mb-8 text-sm text-[#c5b8b0]">
            Be the first to know about new arrivals, exclusive offers and style tips.
          </p>
          <div className="mx-auto flex max-w-md overflow-hidden rounded-full border border-white/20">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-white/10 px-6 py-3.5 text-sm text-white placeholder-white/40 outline-none"
            />
            <button className="flex-shrink-0 rounded-full bg-white px-7 py-3.5 text-xs uppercase tracking-[0.16em] text-[#3B302A] transition hover:bg-[#F8F5F2]">
              Join
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-[#3B302A]/10 bg-[#F8F5F2]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
              <h2 className="mb-3 text-xl font-light tracking-[0.22em]">KAMARI</h2>
              <p className="text-xs leading-relaxed text-[#7D746C]">
                Contemporary women's fashion for everyday Sri Lankan life.
              </p>
              <p className="mt-4 text-xs text-[#a3948b]">© 2026 KAMARI. All rights reserved.</p>
            </div>
            <FooterCol title="Shop"     links={[{ label: "All Products", to: "/shop" }, { label: "Collections", to: "/collections" }]} />
            <FooterCol title="Discover" links={[{ label: "New Arrivals", to: "/collections?sort=newest" }, { label: "Best Sellers", to: "/shop" }]} />
            <FooterCol title="Help"     links={[{ label: "Size Guide", to: "#" }, { label: "Shipping", to: "#" }, { label: "Returns", to: "#" }]} />
            <FooterCol title="Support"  links={[{ label: "FAQ", to: "#" }, { label: "Contact Us", to: "/contact" }, { label: "Privacy Policy", to: "#" }]} />
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── Product Card ───────────────────────────────────────────── */
function ProductCard({ product, badge, onClick }) {
  const img1 = getProductImg(product);
  const img2 = product?.colors?.flatMap((c) => c.images || [])?.[1]?.url || img1;
  const colors = product.colors || [];

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative mb-3 overflow-hidden rounded-xl bg-[#f8f8f8]" style={{ aspectRatio: "3/4" }}>
        <img src={img1} alt={product.name} className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:opacity-0" />
        <img src={img2} alt={product.name} className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition duration-700 group-hover:opacity-100" />

        {badge && (
          <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
            badge === "New" ? "bg-[#F8F5F2] text-[#3B302A] border border-[#3B302A]" : "bg-[#3B302A] text-[#F8F5F2]"
          }`}>
            {badge}
          </span>
        )}

        <button className="absolute inset-x-3 bottom-3 z-10 rounded-lg bg-[#3B302A] py-3 text-xs font-medium uppercase tracking-[0.12em] text-white opacity-0 transition duration-300 group-hover:opacity-100">
          Add to Bag
        </button>
      </div>

      <p className="mb-0.5 text-xs uppercase tracking-[0.1em] text-[#a3948b]">
        {product.setName || product.collection}
      </p>
      <h4 className="mb-2 text-sm font-medium text-[#3B302A] leading-snug">{product.name}</h4>

      <div className="mb-2 flex gap-1.5">
        {colors.slice(0, 4).map((c) => (
          <span
            key={c._id || c.colorName}
            className="inline-block h-3.5 w-3.5 rounded-full border border-black/10"
            style={{ backgroundColor: c.colorCode || "#ccc" }}
            title={c.colorName}
          />
        ))}
        {colors.length > 4 && <span className="text-[11px] text-[#7D746C]">+{colors.length - 4}</span>}
      </div>

      <p className="text-sm text-[#3B302A]">LKR {Number(product.price || 0).toLocaleString()}</p>
    </motion.div>
  );
}

/* ── Mood Grid ─────────────────────────────────────────────── */
function MoodGrid({ products, navigate }) {
  const allImages = products
    .flatMap((p) => (p.colors || []).flatMap((c) => (c.images || []).map((img) => ({ url: img.url, productId: p._id }))))
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
        <p className="text-xs uppercase tracking-[0.28em] text-[#7D746C]">Style Gallery</p>
      </motion.div>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-3 gap-3 md:grid-cols-5"
      >
        {allImages.map((img, i) => (
          <motion.div
            key={i}
            variants={fadeIn}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer overflow-hidden rounded-xl"
            style={{ aspectRatio: "1/1" }}
            onClick={() => navigate(`/products/${img.productId}`)}
          >
            <img
              src={img.url}
              alt="KAMARI style"
              className="h-full w-full object-cover object-top transition duration-500 hover:scale-110"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ── Footer Column ─────────────────────────────────────────── */
function FooterCol({ title, links }) {
  const navigate = useNavigate();
  return (
    <div>
      <h4 className="mb-4 text-xs uppercase tracking-[0.22em] text-[#3B302A]">{title}</h4>
      <ul className="space-y-3">
        {links.map(({ label, to }) => (
          <li key={label}>
            <button
              onClick={() => navigate(to)}
              className="text-sm text-[#6E625C] transition hover:text-[#3B302A]"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
