import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp, sectionReveal, stagger } from "./homeConstants";

export default function HomeCollectionsSection({
  collections,
  sliderRef,
  onOpenCollection,
  onScroll,
}) {
  if (!collections.length) return null;

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      className="mx-auto max-w-7xl px-6 py-16"
    >
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
            Browse
          </p>
          <h2 className="text-3xl font-light tracking-wide">Shop by Collection</h2>
        </div>
      </motion.div>

      <div className="relative">
        <div className="absolute -right-1 -top-16 hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Previous collections"
            onClick={() => onScroll(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2C2B28]/15 bg-white/70 text-[#2C2B28] shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next collections"
            onClick={() => onScroll(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2C2B28]/15 bg-white/70 text-[#2C2B28] shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <motion.div
          ref={sliderRef}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {collections.map((collection) => (
            <motion.div
              key={collection._id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group w-[70vw] max-w-[260px] flex-shrink-0 snap-start cursor-pointer sm:w-[42vw] md:w-[30vw] lg:w-[220px] xl:w-[235px]"
              onClick={() => onOpenCollection(collection)}
            >
              <div
                className="relative mb-3 overflow-hidden rounded-xl bg-[#E8DED6]"
                style={{ aspectRatio: "3/4" }}
              >
                {collection.image?.url ? (
                  <img
                    src={collection.image.url}
                    alt={collection.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-[#E8DED6]" />
                )}
                <div className="absolute inset-0 bg-[#2C2B28]/20 transition duration-300 group-hover:bg-[#2C2B28]/10" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2C2B28]/70 p-4">
                  <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-white">
                    {collection.name}
                  </p>
                  {collection.subtitle && (
                    <p className="mt-1 text-center text-[10px] text-white/70">
                      {collection.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
