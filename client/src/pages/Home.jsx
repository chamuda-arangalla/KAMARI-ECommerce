import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeCollectionsSection from "../components/home/HomeCollectionsSection";
import HomeFooter from "../components/home/HomeFooter";
import HomeHero from "../components/home/HomeHero";
import HomeMoodGrid from "../components/home/HomeMoodGrid";
import HomeNewsletter from "../components/home/HomeNewsletter";
import HomeProductSection from "../components/home/HomeProductSection";
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
            ).slice(0, 4),
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
    <main className="bg-[#F8F5F2] text-[#3B302A]">
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
            onOpenProduct={navigateToProduct}
          />

          <HomeProductSection
            badge="Best Seller"
            eyebrow="Popular"
            products={bestSellers}
            title="Best Sellers"
            viewAllTo="/shop"
            onOpenProduct={navigateToProduct}
          />

          <HomeMoodGrid
            products={[...newArrivals, ...bestSellers]}
            onOpenProduct={(productId) => navigate(`/products/${productId}`)}
          />

          <HomeNewsletter />
          <HomeFooter />
        </>
      )}
    </main>
  );
}
