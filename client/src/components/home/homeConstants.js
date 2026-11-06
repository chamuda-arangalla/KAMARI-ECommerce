import heroBanner1 from "../../assets/images/Aura Desktop Banner 1 .png";
import heroBanner2 from "../../assets/images/Origin - 2 Desktop Banner - 2.png";
import heroBanner3 from "../../assets/images/Origin Desktop Banner- 3.png";
import heroBanner4 from "../../assets/images/Origin Desktop Banner 4.PNG";
import content01Img from "../../assets/images/Content01.png";
import heroMobileBanner1 from "../../assets/images/Aura Mobile Banner-1.png";
import heroMobileBanner2 from "../../assets/images/Origin - 2 Mobile Banner-2.png";
import heroMobileBanner3 from "../../assets/images/Origin Mobile Banner 3.png";
import heroMobileBanner4 from "../../assets/images/Origin Mobile Banner - 4.PNG";

export const HOME_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80";

export const HERO_BANNERS = [heroBanner1, heroBanner2, heroBanner3, heroBanner4];
export const HERO_MOBILE_BANNERS = [
  heroMobileBanner1,
  heroMobileBanner2,
  heroMobileBanner3,
  heroMobileBanner4,
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
