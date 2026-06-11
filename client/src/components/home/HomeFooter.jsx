import { Link } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/shop" },
      { label: "Collections", to: "/collections" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "New Arrivals", to: "/collections?sort=newest" },
      { label: "Best Sellers", to: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Size Guide", to: "#" },
      { label: "Shipping", to: "#" },
      { label: "Returns", to: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", to: "#" },
      { label: "Contact Us", to: "/contact" },
      { label: "Privacy Policy", to: "#" },
    ],
  },
];

export default function HomeFooter() {
  return (
    <footer className="border-t border-[#2C2B28]/10 bg-[#EAE0D6]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo className="mb-3 h-9 w-auto object-contain" />
            <p className="text-xs leading-relaxed text-[#5F564D]">
              Contemporary women's fashion for everyday Sri Lankan life.
            </p>
            <p className="mt-4 text-xs text-[#8f8376]">
              Copyright 2026 KAMARI. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-[#8f8376]">Solution By CyberNest</p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-xs uppercase tracking-[0.22em] text-[#2C2B28]">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="text-sm text-[#6E625C] transition hover:text-[#2C2B28]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
