import homeHeroImg from "../../assets/images/Home.jpg";
import homeHeroMobileImg from "../../assets/images/Home-mobile.jpg";
import content01Img from "../../assets/images/Content01.png";

export const HOME_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80";

export const HERO_IMG = homeHeroImg;
export const HERO_MOBILE_IMG = homeHeroMobileImg;
export const BRAND_IMG = content01Img;

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const sectionReveal = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const getHomeProductImage = (product) =>
  product?.colors?.flatMap((color) => color.images || [])?.[0]?.url ||
  HOME_FALLBACK_IMG;
