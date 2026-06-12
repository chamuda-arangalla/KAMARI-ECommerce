import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeCollectionsSection from "../components/home/HomeCollectionsSection";
import HomeFooter from "../components/home/HomeFooter";
import HomeHero from "../components/home/HomeHero";
import HomeProductQuickView from "../components/home/HomeProductQuickView";
import HomeProductSection from "../components/home/HomeProductSection";
import HomeQuoteFeature from "../components/home/HomeQuoteFeature";
import { getCollections } from "../services/collectionApi";
import { getProducts } from "../services/productApi";

export default function Home() {
  const navigate = useNavigate();
  const collectionSliderRef = useRef(null);
  const heroRevealRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRevealRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const heroTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    [1, 1, 0],
  );

  const [collections, setCollections] = useState([]);
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

    slider.scrollBy({
      left: direction * Math.min(slider.clientWidth, 420),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => setHeroReady(true), 1800);
    return () => window.clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    const slider = collectionSliderRef.current;
    if (!slider) return undefined;

    const handleWheel = (event) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (delta === 0) return;

      const { scrollLeft, scrollWidth, clientWidth } = slider;
      const atStart = scrollLeft <= 0;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;

      event.preventDefault();
      slider.scrollLeft += delta;
    };

    slider.addEventListener("wheel", handleWheel, { passive: false });

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const handlePointerDown = (event) => {
      isDragging = true;
      startX = event.clientX;
      startScrollLeft = slider.scrollLeft;
      slider.classList.add("cursor-grabbing");
    };

    const handlePointerMove = (event) => {
      if (!isDragging) return;
      slider.scrollLeft = startScrollLeft - (event.clientX - startX);
    };

    const handlePointerUp = () => {
      isDragging = false;
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
      <HomeHero
        heroImageScale={heroImageScale}
        heroImageY={heroImageY}
        heroRevealRef={heroRevealRef}
        heroTextOpacity={heroTextOpacity}
        prefersReducedMotion={prefersReducedMotion}
        onHeroReady={() => setHeroReady(true)}
        onNavigate={navigate}
      />

      {showBelowContent && (
        <>
          <HomeCollectionsSection
            collections={collections}
            sliderRef={collectionSliderRef}
            onOpenCollection={navigateToCollection}
            onScroll={scrollCollections}
          />

          <HomeProductSection
            badge="New"
            eyebrow="Just In"
            products={newArrivals}
            title="New Arrivals"
            viewAllTo="/collections?sort=newest"
            variant="white"
            imageAspect="aspect-[3/4]"
            fullBleed
            onOpenProduct={navigateToProduct}
          />

          <HomeQuoteFeature onNavigate={navigate} />

          <HomeProductSection
            badge="Best Seller"
            eyebrow="Popular"
            products={bestSellers}
            title="Best Sellers"
            viewAllTo="/shop"
            variant="white"
            imageAspect="aspect-[3/4]"
            fullBleed
            cols={3}
            onOpenProduct={setQuickViewProduct}
          />

          <HomeFooter />
        </>
      )}

      <HomeProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </main>
  );
}
