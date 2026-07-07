import { motion } from "framer-motion";
import { contactFadeUp, contactStagger } from "./contactConstants";

export default function ContactInfoGrid({ items, socialLinks = [] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        variants={contactStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map(({ icon: Icon, title, lines }) => (
          <motion.div
            key={title}
            variants={contactFadeUp}
            className="rounded-2xl border border-[#e8e2dc] bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#E8E2DC] bg-white">
              <Icon size={22} className="text-[#2C2B28]" />
            </div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]">
              {title}
            </h3>
            {lines.map((line) => (
              <p key={line} className="text-sm leading-7 text-[#6E625C]">
                {line}
              </p>
            ))}
          </motion.div>
        ))}

        {socialLinks.length > 0 && (
          <motion.div
            variants={contactFadeUp}
            className="flex items-center justify-center gap-4 p-6 sm:col-span-2 lg:col-span-3"
          >
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-[#2C2B28] transition hover:-translate-y-0.5"
              >
                <Icon size={20} />
              </a>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export function InstagramIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-10 w-10 hover:text-[#C13584]"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-10 w-10 hover:text-[#1877F2]"
    >
      <path d="M15 8.5h2V5h-2c-2.21 0-4 1.79-4 4v2H9v3h2v6h3v-6h2.2l.8-3H14V9c0-.55.45-.5 1-.5Z" />
    </svg>
  );
}
