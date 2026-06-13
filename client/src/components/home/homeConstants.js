import heroBanner1 from "../../assets/images/banner1-flowset.png";
import heroBanner2 from "../../assets/images/banner2-playset.png";
import heroBanner3 from "../../assets/images/banner3-eas-set.png";
import heroBanner4 from "../../assets/images/banner4-bold-set.png";
import content01Img from "../../assets/images/Content01.png";
import flowMobileImg from "../../assets/images/flow-mobile.png";
import playMobileImg from "../../assets/images/play-mobile.png";
import easeMobileImg from "../../assets/images/ease-mobile.png";
import boldMobileImg from "../../assets/images/bold-mobile.png";

export const HOME_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80";

export const HERO_BANNERS = [heroBanner1, heroBanner2, heroBanner3, heroBanner4];
export const HERO_MOBILE_BANNERS = [
  flowMobileImg,
  playMobileImg,
  easeMobileImg,
  boldMobileImg,
];
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
