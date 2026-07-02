import { motion, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import collectionCoverImage from "../../assets/images/collection-static.JPG.jpeg";
import { getHomeProductImage } from "./homeConstants";

const premiumStagger = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.08, staggerChildren: 0.12 },
  },
};

const premiumCard = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const premiumImage = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HomeCollectionsSection({
  collections,
  collectionProducts = {},
  revealProgress,
  sliderRef,
  onOpenCollection,
  onScroll,
}) {
  const prefersReducedMotion = useReducedMotion();
  const hasRevealedRef = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  useMotionValueEvent(revealProgress, "change", (progress) => {
    if (!hasRevealedRef.current && progress >= 0.16) {
      hasRevealedRef.current = true;
      setIsRevealed(true);
    }
  });

  if (!collections.length) return null;

  const activeMobileIndex = Math.min(mobileIndex, collections.length - 1);
  const activeMobileCollection = collections[activeMobileIndex];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: isRevealed ? 1 : 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.55 }}
      className="flex min-h-full w-full items-center bg-white px-4 py-2 sm:p-8 md:px-12 lg:px-16"
    >
      <div className="relative w-full overflow-hidden bg-white md:hidden">
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          animate={isRevealed ? "visible" : "hidden"}
          className="w-full overflow-hidden bg-white"
        >
          <CollectionCard
            key={activeMobileCollection._id}
            collection={activeMobileCollection}
            product={collectionProducts[activeMobileCollection.name]}
            index={activeMobileIndex}
            className="w-full"
            onOpenCollection={onOpenCollection}
          />
        </motion.div>

        {activeMobileIndex > 0 && (
          <button
            type="button"
            aria-label="Previous collection"
            onClick={() =>
              setMobileIndex((currentIndex) => Math.max(currentIndex - 1, 0))
            }
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2C2B28] shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {activeMobileIndex < collections.length - 1 && (
          <button
            type="button"
            aria-label="Next collection"
            onClick={() =>
              setMobileIndex((currentIndex) =>
                Math.min(currentIndex + 1, collections.length - 1),
              )
            }
            className={`absolute right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#2C2B28] shadow-sm backdrop-blur transition hover:bg-white ${
              activeMobileIndex === 0
                ? "top-[calc(50%+1.625rem)] -translate-y-1/2"
                : "top-1/2 -translate-y-1/2"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      <motion.div
        variants={premiumStagger}
        initial="hidden"
        animate={isRevealed ? "visible" : "hidden"}
        className="hidden w-full grid-cols-3 gap-1 md:grid lg:grid-cols-4"
      >
        <CollectionCard
          collection={collections[0]}
          product={collectionProducts[collections[0].name]}
          index={0}
          className="w-full"
          onOpenCollection={onOpenCollection}
        />

        <div className="relative min-w-0 overflow-hidden md:col-span-2 lg:col-span-3">
          <button
            type="button"
            aria-label="Previous collections"
            onClick={() => onScroll(-1)}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2C2B28] shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next collections"
            onClick={() => onScroll(1)}
            className="absolute right-8 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2C2B28] shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ChevronRight size={18} />
          </button>

          <motion.div
            ref={sliderRef}
            variants={premiumStagger}
            initial="hidden"
            animate={isRevealed ? "visible" : "hidden"}
            className="flex cursor-grab snap-x snap-mandatory gap-1 overflow-x-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {collections.slice(1).map((collection, offset) => (
              <CollectionCard
                key={collection._id}
                collection={collection}
                product={collectionProducts[collection.name]}
                index={offset + 1}
                className="w-[calc((100%-0.25rem)/2)] lg:w-[calc((100%-0.5rem)/3)]"
                onOpenCollection={onOpenCollection}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

function CollectionCard({
  collection,
  product,
  index,
  className,
  onOpenCollection,
}) {
  const imageUrl =
    index === 0
      ? collectionCoverImage
      : product
        ? getHomeProductImage(product)
        : collection.image?.url;

  return (
    <motion.div
      variants={premiumCard}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`group relative min-w-0 shrink-0 self-start snap-start cursor-pointer bg-white ${className}`}
      onClick={() => onOpenCollection(collection)}
    >
      <div className="relative h-[78svh] min-h-130 max-h-170 overflow-hidden bg-[#F7F4F0] md:h-auto md:min-h-0 md:max-h-none md:aspect-4/5">
        {imageUrl ? (
          <motion.img
            variants={premiumImage}
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

        {index === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-white">
            <div>
              <p className="mb-6 text-3xl font-light uppercase leading-none tracking-[0.03em] drop-shadow-sm">
                Shop by Collection
              </p>
              <Link
                to="/collections"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex min-h-11 items-center justify-center bg-white px-10 shadow-sm transition hover:bg-[#F4F1EE]"
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
        )}
      </div>

      {index > 0 && (
        <div className="min-h-20 bg-white px-4 py-3 text-center md:min-h-0 md:px-0 md:pt-3 md:pb-0">
          <h3 className="mb-1 text-sm font-medium uppercase tracking-[0.08em]">
            {collection.name}
          </h3>
          {collection.subtitle && (
            <p className="text-xs uppercase tracking-[0.14em] text-[#8f8376]">
              {collection.subtitle}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
