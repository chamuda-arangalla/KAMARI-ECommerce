import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp, sectionReveal } from "./homeConstants";
import BrandLogo from "../common/BrandLogo";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", to: "/collections?sort=newest" },
      { label: "Collections", to: "/collections" },
      { label: "All Products", to: "/shop" },
      { label: "Best Sellers", to: "/collections?sort=best-selling" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact Us", to: "/contact" },
      { label: "FAQs", to: "#" },
      { label: "Shipping Policy", to: "/shipping-policy" },
      { label: "Return Policy", to: "/return-policy" },
      { label: "Terms & Conditions", to: "/terms-conditions" },
      { label: "Privacy Policy", to: "/privacy-policy" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/kamari.lk/",
    icon: InstagramIcon,
    hoverClass: "hover:border-[#C13584] hover:bg-[#FCE7F3] hover:text-[#C13584]",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61577494230895#",
    icon: FacebookIcon,
    hoverClass: "hover:border-[#1877F2] hover:bg-[#E7F0FF] hover:text-[#1877F2]",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@kamari.lk?_r=1&_t=ZS-97UrpFDdRuT",
    icon: TikTokIcon,
    hoverClass: "hover:border-[#FE2C55] hover:bg-[#FFE8ED] hover:text-[#D91E45]",
  },
];

export default function HomeFooter() {
  return (
    <footer className="relative z-2 w-full max-w-full overflow-x-hidden bg-white text-[#1A1A1A]">
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full min-w-0 px-4 pb-5 pt-5 sm:px-10 sm:pb-7 sm:pt-20 lg:px-14"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="grid min-w-0 gap-0 sm:gap-10 md:grid-cols-3 md:gap-16"
        >
          <FooterColumn title="Shop" links={FOOTER_COLUMNS[0].links} />
          <FooterColumn title="Explore" links={FOOTER_COLUMNS[1].links} />

          {/* Newsletter — always visible, full width on mobile */}
          <div className="min-w-0 pb-2 pt-3 md:py-0">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-black/60">
              Newsletter Sign Up
            </p>
            <h3 className="mb-3 text-xl leading-tight sm:text-2xl">
              Join the Soft Night Club
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-black/60">
              Sign up to get first dibs on new arrivals, sales, exclusive
              content, events and more!
            </p>
            <form className="flex min-w-0 flex-col border-b border-black/30 min-[360px]:flex-row min-[360px]:items-stretch">
              <input
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1A1A1A] placeholder-black/40 outline-none"
              />
              <button
                type="submit"
                className="self-start whitespace-nowrap py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#1A1A1A] transition hover:text-black/60 min-[360px]:self-auto min-[360px]:tracking-[0.18em]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="w-full min-w-0 pb-8 sm:pb-10">
        <div className="relative mx-4 aspect-[5.7/1] overflow-hidden sm:mx-10 lg:mx-14">
          <BrandLogo className="absolute left-1/2 top-1/2 block h-auto w-full -translate-x-1/2 -translate-y-1/2 object-contain" />
        </div>

        <div className="mx-4 flex min-w-0 flex-col items-center gap-6 border-t border-black/15 pt-6 sm:mx-10 sm:flex-row sm:justify-between lg:mx-14">
          <p className="max-w-full text-center text-[11px] leading-relaxed text-black/50 sm:text-left sm:text-xs">
            © 2026 KAMARI. All rights reserved.
          </p>

          <p className="text-center text-[11px] leading-relaxed text-black/50 sm:text-xs">
            Solution by Cybernest
          </p>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon, hoverClass }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-black/30 text-[#1A1A1A] transition-all duration-300 hover:scale-110 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A] ${hoverClass}`}
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-3 md:py-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs uppercase tracking-[0.22em] text-black/60 md:pointer-events-none md:mb-5"
      >
        {title}
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`transition-transform md:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>
      <ul className={`space-y-3 md:mt-0! md:block ${open ? "mt-4 block" : "hidden"}`}>
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="text-sm text-black/80 transition hover:text-black"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 8.5h2V5h-2c-2.21 0-4 1.79-4 4v2H9v3h2v6h3v-6h2.2l.8-3H14V9c0-.55.45-.5 1-.5Z" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 3v10.5a3 3 0 1 1-2-2.83" />
      <path d="M14 3c.5 2.5 2 4 5 4.5" />
    </svg>
  );
}
