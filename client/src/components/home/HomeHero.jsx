import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { fadeUp, HERO_BANNERS } from "./homeConstants";

const SLIDE_INTERVAL = 5000;

export default function HomeHero({
  heroImageScale,
  heroImageY,
  heroRevealRef,
  heroTextOpacity,
  prefersReducedMotion,
  onHeroReady,
  onNavigate,
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || HERO_BANNERS.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_BANNERS.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <section
      ref={heroRevealRef}
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#2C2B28] md:min-h-[640px]"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReducedMotion ? 0 : heroImageY,
          scale: prefersReducedMotion ? 1 : heroImageScale,
        }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={activeSlide}
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -60 }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            src={HERO_BANNERS[activeSlide]}
            alt="KAMARI"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            onLoad={onHeroReady}
            onError={onHeroReady}
            className="absolute inset-0 h-[114%] w-full object-cover object-center md:object-top"
          />
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2B28]/72 via-[#2C2B28]/28 to-transparent md:bg-gradient-to-r md:from-[#2C2B28]/64 md:via-[#2C2B28]/20 md:to-transparent" />

      <div className="absolute bottom-28 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-10">
        {HERO_BANNERS.map((_, index) => (
          <button
            key={index}
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeSlide ? "w-8 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.9, delay: 0.3 }}
        style={{ opacity: prefersReducedMotion ? 1 : heroTextOpacity }}
        className="absolute inset-x-0 bottom-12 flex justify-center"
      >
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("/shop")}
          className="rounded-full bg-white px-8 py-3.5 text-xs uppercase tracking-[0.18em] text-[#2C2B28] transition hover:bg-[#EAE0D6]"
        >
          Shop Now
        </motion.button>
      </motion.div>
    </section>
  );
}
