import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp, getHomeProductImage, sectionReveal, stagger } from "./homeConstants";

export default function HomeCollectionsSection({
  collections,
  collectionProducts = {},
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
      className="w-full bg-white px-4 py-12 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-full items-center justify-center px-4 text-center text-white sm:w-[calc((100%_-_0.25rem)/2)] md:w-[calc((100%_-_0.5rem)/3)] lg:w-[calc((100%_-_0.75rem)/4)]">
          <div className="pointer-events-auto">
            <p className="mb-8 text-3xl font-light uppercase leading-none tracking-[0.03em] drop-shadow-sm">
              Shop by Collection
            </p>
            <Link
              to="/collections"
              className="inline-flex min-h-12 items-center justify-center bg-white px-12 shadow-sm transition hover:bg-[#F4F1EE]"
            >
              <span
                className="text-sm font-bold uppercase leading-none tracking-[0.04em]"
                style={{ color: "#5F564D" }}
              >
                View All
              </span>
            </Link>
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous collections"
          onClick={() => onScroll(-1)}
          className="absolute left-[29%] top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2C2B28] shadow-sm backdrop-blur transition hover:bg-white md:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Next collections"
          onClick={() => onScroll(1)}
          className="absolute right-8 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2C2B28] shadow-sm backdrop-blur transition hover:bg-white md:flex"
        >
          <ChevronRight size={18} />
        </button>

        <motion.div
          ref={sliderRef}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex cursor-grab snap-x snap-mandatory gap-1 overflow-x-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {collections.map((collection, index) => {
            const product = collectionProducts[collection.name];
            const imageUrl =
              index > 0 && product
                ? getHomeProductImage(product)
                : collection.image?.url;

            return (
              <motion.div
                key={collection._id}
                variants={fadeUp}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className={`group w-full flex-shrink-0 self-start snap-start cursor-pointer bg-white sm:w-[calc((100%_-_0.25rem)/2)] md:w-[calc((100%_-_0.5rem)/3)] lg:w-[calc((100%_-_0.75rem)/4)] ${
                  index === 0 ? "sticky left-0 z-[5]" : ""
                }`}
                onClick={() => onOpenCollection(collection)}
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden bg-[#F7F4F0]"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product?.name || collection.name}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                        index > 0 && product ? "object-top" : "object-center"
                      }`}
                    />
                  ) : (
                    <div className="h-full w-full bg-[#E8DED6]" />
                  )}
                  <div className="absolute inset-0 bg-[#2C2B28]/12 transition duration-300 group-hover:bg-[#2C2B28]/6" />
                </div>

                {index > 0 && (
                  <div className="pt-3 text-center">
                    <h3 className="mb-1 text-sm">{collection.name}</h3>
                    {collection.subtitle && (
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8f8376]">
                        {collection.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
