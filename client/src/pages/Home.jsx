import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeCollectionsSection from "../components/home/HomeCollectionsSection";
import HomeHero from "../components/home/HomeHero";
import HomeProductQuickView from "../components/home/HomeProductQuickView";
import HomeProductSection from "../components/home/HomeProductSection";
import HomeAboutKamari from "../components/home/HomeAboutKamari";
import { getCollections } from "../services/collectionApi";
import { getProducts } from "../services/productApi";

export default function Home() {
  const navigate = useNavigate();
  const collectionSliderRef = useRef(null);
  const collectionScrollTargetRef = useRef(null);
  const heroRevealRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRevealRef,
    offset: ["start start", "end end"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const heroPanelY = useTransform(
    scrollYProgress,
    [0.12, 0.88],
    prefersReducedMotion ? ["0%", "-100%"] : ["0%", "-100%"],
  );
  const heroTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    [1, 1, 0],
  );

  const [collections, setCollections] = useState([]);
  const [collectionProducts, setCollectionProducts] = useState({});
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [heroReady, setHeroReady] = useState(false);
  const [showBelowContent, setShowBelowContent] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const navigateToCollection = (collection) => {
    navigate(`/collections?category=${encodeURIComponent(collection.name)}`);
  };

  const navigateToProduct = (product) => {
    navigate(`/products/${product._id}`);
  };

  const scrollCollections = (direction) => {
    const slider = collectionSliderRef.current;
    if (!slider) return;

    const firstItem = slider.firstElementChild;
    const gap = parseFloat(getComputedStyle(slider).columnGap || "0");
    const step = firstItem
      ? firstItem.getBoundingClientRect().width + gap
      : slider.clientWidth;

    const maxScroll = slider.scrollWidth - slider.clientWidth;
    // Base the next target on where we're already heading, not the current
    // (possibly mid-animation) scrollLeft, so rapid clicks queue smoothly
    // instead of fighting the in-progress scroll.
    const base = collectionScrollTargetRef.current ?? slider.scrollLeft;
    const target = Math.min(Math.max(base + direction * step, 0), maxScroll);
    collectionScrollTargetRef.current = target;

    slider.scrollTo({ left: target, behavior: "smooth" });
  };

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => setHeroReady(true), 1800);
    return () => window.clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    const slider = collectionSliderRef.current;
    if (!slider) return undefined;

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        collectionScrollTargetRef.current = null;
      }
    };

    slider.addEventListener("wheel", handleWheel, { passive: true });

    let isDragging = false;
    let moved = false;
    let startX = 0;
    let startScrollLeft = 0;

    const handlePointerDown = (event) => {
      isDragging = true;
      moved = false;
      startX = event.clientX;
      startScrollLeft = slider.scrollLeft;
      collectionScrollTargetRef.current = null;
    };

    const handlePointerMove = (event) => {
      if (!isDragging) return;
      const deltaX = event.clientX - startX;
      if (Math.abs(deltaX) > 4) {
        moved = true;
        slider.classList.add("cursor-grabbing");
      }
      slider.scrollLeft = startScrollLeft - deltaX;
    };

    const handlePointerUp = (event) => {
      if (moved) {
        // Prevent the drag from also registering as a click on a card.
        event.preventDefault?.();
      }
      isDragging = false;
      moved = false;
      slider.classList.remove("cursor-grabbing");
    };

    slider.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      slider.removeEventListener("wheel", handleWheel);
      slider.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [showBelowContent]);

  useEffect(() => {
    if (!heroReady) return undefined;

    let cancelled = false;
    let idleId = null;
    let timerId = null;

    const loadBelowContent = () => {
      if (cancelled) return;

      setShowBelowContent(true);

      getCollections()
        .then((res) => {
          if (!cancelled) setCollections(res.data || []);
        })
        .catch(() => {
          if (!cancelled) setCollections([]);
        });

      getProducts()
        .then((res) => {
          if (cancelled) return;

          const products = res.data || [];
          setNewArrivals(
            products
              .filter((product) => product.isNewArrival && !product.isSoldOut)
              .slice(0, 4),
          );
          const featured = products.filter(
            (product) => product.isFeatured && !product.isSoldOut,
          );
          setBestSellers(
            (featured.length
              ? featured
              : products.filter((product) => !product.isSoldOut)
            ).slice(0, 3),
          );

          const productsByCollection = {};
          products
            .filter((product) => !product.isSoldOut)
            .forEach((product) => {
              if (!productsByCollection[product.collection]) {
                productsByCollection[product.collection] = product;
              }
            });
          setCollectionProducts(productsByCollection);
        })
        .catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(loadBelowContent, { timeout: 700 });
    } else {
      timerId = window.setTimeout(loadBelowContent, 250);
    }

    return () => {
      cancelled = true;
      if (idleId) window.cancelIdleCallback(idleId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, [heroReady]);

  return (
    <main className="bg-[#EAE0D6] text-[#2C2B28]">
      <div
        ref={heroRevealRef}
        className={
          showBelowContent
            ? "relative h-[210svh] md:h-[300svh]"
            : "relative h-svh"
        }
      >
        <div className="sticky top-0 h-svh overflow-hidden bg-white">
          {showBelowContent && (
            <div className="absolute inset-0 z-1 overflow-hidden bg-white">
              <HomeCollectionsSection
                collections={collections}
                collectionProducts={collectionProducts}
                revealProgress={scrollYProgress}
                sliderRef={collectionSliderRef}
                onOpenCollection={navigateToCollection}
                onScroll={scrollCollections}
              />
            </div>
          )}

          <motion.div
            className="absolute inset-0 z-2"
            style={{ y: showBelowContent ? heroPanelY : 0 }}
          >
            <HomeHero
              heroImageScale={heroImageScale}
              heroImageY={heroImageY}
              heroTextOpacity={heroTextOpacity}
              prefersReducedMotion={prefersReducedMotion}
              onHeroReady={() => setHeroReady(true)}
              onNavigate={navigate}
            />
          </motion.div>
        </div>
      </div>

      {showBelowContent && (
        <>
          <div className="relative z-2 -mt-15 lg:-mt-15 bg-white md:mt-0 md:min-h-screen">
            <HomeProductSection
              eyebrow="Just In"
              products={newArrivals}
              title="New Arrivals"
              viewAllTo="/collections?sort=newest"
              variant="white"
              imageAspect="h-[100svh] md:h-auto md:aspect-[3/4]"
              fullBleed
              mobileSingle
              headerPadding="pt-0 pb-4 md:pt-0 md:pb-6"
              onOpenProduct={navigateToProduct}
            />
          </div>

          <div>
            <HomeAboutKamari onNavigate={navigate} />
          </div>

          <div className="relative z-2 bg-white md:min-h-screen">
            <HomeProductSection
              eyebrow="Popular"
              products={bestSellers}
              title="Best Seller"
              viewAllTo="/shop"
              variant="white"
              imageAspect="h-[100svh] sm:h-auto sm:aspect-[3/4]"
              fullBleed
              cols={3}
              mobileFirstOnly
              headerPadding="pt-12 pb-5 md:pt-20 md:pb-10"
              onOpenProduct={setQuickViewProduct}
            />
          </div>
        </>
      )}

      <HomeProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </main>
  );
}
