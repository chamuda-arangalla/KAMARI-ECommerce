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
      { label: "Shipping Policy", to: "#" },
      { label: "Return Policy", to: "#" },
      { label: "Terms & Conditions", to: "#" },
      { label: "Privacy Policy", to: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "TikTok", href: "#", icon: TikTokIcon },
];

export default function HomeFooter() {
  return (
    <footer className="bg-white text-[#1A1A1A]">
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full px-5 pb-5 pt-14 sm:px-10 sm:pb-7 sm:pt-20 lg:px-14"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 md:grid-cols-3 md:gap-16"
        >
          <FooterColumn title="Shop" links={FOOTER_COLUMNS[0].links} />
          <FooterColumn title="Explore" links={FOOTER_COLUMNS[1].links} />

          {/* Newsletter — always visible, full width on mobile */}
          <div className="py-4 md:py-0">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-black/60">
              Newsletter Sign Up
            </p>
            <h3 className="mb-3 text-2xl">Join the Soft Night Club</h3>
            <p className="mb-6 text-sm leading-relaxed text-black/60">
              Sign up to get first dibs on new arrivals, sales, exclusive
              content, events and more!
            </p>
            <form className="flex items-stretch gap-0 border-b border-black/30">
              <input
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1A1A1A] placeholder-black/40 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#1A1A1A] transition hover:text-black/60"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="w-full pb-8 sm:pb-10">
        <div className="relative mx-4 aspect-[5.7/1] overflow-hidden sm:mx-10 lg:mx-14">
          <BrandLogo className="absolute left-1/2 top-1/2 block h-auto w-full -translate-x-1/2 -translate-y-1/2 object-contain" />
        </div>

        <div className="mx-4 flex flex-col items-center gap-6 border-t border-black/15 pt-6 sm:mx-10 sm:flex-row sm:justify-between lg:mx-14">
          <p className="text-xs text-black/50">
            © 2026 KAMARI. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-[#1A1A1A] transition hover:border-black hover:bg-black hover:text-white"
              >
                <Icon size={15} />
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
    <div className="py-4 md:py-0">
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
