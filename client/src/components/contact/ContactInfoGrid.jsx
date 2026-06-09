import { motion } from "framer-motion";
import { contactFadeUp, contactStagger } from "./contactConstants";

export default function ContactInfoGrid({ items }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        variants={contactStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {items.map(({ icon: Icon, title, lines }) => (
          <motion.div
            key={title}
            variants={contactFadeUp}
            className="rounded-2xl border border-[#e8e2dc] bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE7DF]">
              <Icon size={22} className="text-[#3B302A]" />
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
      </motion.div>
    </section>
  );
}
