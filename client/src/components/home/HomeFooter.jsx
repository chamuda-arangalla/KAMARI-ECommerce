import { Link } from "react-router-dom";

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
    <footer className="border-t border-[#3B302A]/10 bg-[#F8F5F2]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-3 text-xl font-light tracking-[0.22em]">KAMARI</h2>
            <p className="text-xs leading-relaxed text-[#7D746C]">
              Contemporary women's fashion for everyday Sri Lankan life.
            </p>
            <p className="mt-4 text-xs text-[#a3948b]">
              Copyright 2026 KAMARI. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-[#a3948b]">Solution By CyberNest</p>
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
      <h4 className="mb-4 text-xs uppercase tracking-[0.22em] text-[#3B302A]">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="text-sm text-[#6E625C] transition hover:text-[#3B302A]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
