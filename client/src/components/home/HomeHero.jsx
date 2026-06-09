import { motion } from "framer-motion";
import { fadeUp, HERO_IMG, HERO_MOBILE_IMG } from "./homeConstants";

export default function HomeHero({
  heroImageScale,
  heroImageY,
  heroRevealRef,
  heroTextOpacity,
  prefersReducedMotion,
  onHeroReady,
  onNavigate,
}) {
  return (
    <section
      ref={heroRevealRef}
      className="relative mt-16 h-[calc(100svh-64px)] min-h-[560px] overflow-hidden bg-[#3B302A] md:min-h-[640px]"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReducedMotion ? 0 : heroImageY,
          scale: prefersReducedMotion ? 1 : heroImageScale,
        }}
      >
        <picture className="block h-[112%] w-full">
          <source media="(max-width: 767px)" srcSet={HERO_MOBILE_IMG} />
          <motion.img
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            src={HERO_IMG}
            alt="KAMARI"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            onLoad={onHeroReady}
            onError={onHeroReady}
            className="h-full w-full object-cover object-center md:object-top"
          />
        </picture>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#3B302A]/72 via-[#3B302A]/28 to-transparent md:bg-gradient-to-r md:from-[#3B302A]/64 md:via-[#3B302A]/20 md:to-transparent" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.9, delay: 0.3 }}
        style={{ opacity: prefersReducedMotion ? 1 : heroTextOpacity }}
        className="absolute inset-x-6 bottom-12 max-w-lg md:left-[8%] md:right-auto md:top-1/2 md:-translate-y-1/2"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#E8DED6]">
          New Season
        </p>
        <h1 className="mb-5 text-5xl font-light leading-tight tracking-[0.18em] text-white sm:text-6xl md:text-7xl">
          KAMARI
        </h1>
        <p className="mb-8 text-base leading-relaxed tracking-[0.08em] text-[#E8DED6]">
          Contemporary women's fashion for everyday elegance.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("/shop")}
            className="rounded-full bg-white px-8 py-3.5 text-xs uppercase tracking-[0.18em] text-[#3B302A] transition hover:bg-[#F8F5F2]"
          >
            Shop Now
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("/collections")}
            className="rounded-full border border-white/60 px-8 py-3.5 text-xs uppercase tracking-[0.18em] text-white transition hover:border-white"
          >
            Collections
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
