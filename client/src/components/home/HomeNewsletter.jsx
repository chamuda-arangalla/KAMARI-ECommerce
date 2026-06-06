import { motion } from "framer-motion";
import { fadeUp, sectionReveal } from "./homeConstants";

export default function HomeNewsletter() {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto max-w-7xl px-6 py-12"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl bg-[#3B302A] px-8 py-12 text-center text-white"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#E8DED6]">
          Stay Connected
        </p>
        <h3 className="mb-3 text-2xl font-light">Stay close to KAMARI</h3>
        <p className="mb-8 text-sm text-[#c5b8b0]">
          Be the first to know about new arrivals, exclusive offers and style
          tips.
        </p>
        <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:overflow-hidden sm:rounded-full sm:border sm:border-white/20 sm:bg-white/5">
          <input
            type="email"
            placeholder="Enter your email address"
            className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm text-white placeholder-white/40 outline-none sm:w-full sm:rounded-none sm:border-0 sm:bg-transparent"
          />
          <button className="w-full flex-shrink-0 rounded-full bg-white px-7 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-[#3B302A] transition hover:bg-[#F8F5F2] sm:mr-0.5 sm:w-auto sm:min-w-[92px]">
            Join
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
