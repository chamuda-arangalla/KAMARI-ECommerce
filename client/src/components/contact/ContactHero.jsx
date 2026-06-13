import { motion } from "framer-motion";
import { contactFadeUp } from "./contactConstants";

export default function ContactHero({ title, subtitle }) {
  return (
    <section className="bg-[#2C2B28] py-20 text-center text-white">
      <motion.div
        variants={contactFadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7 }}
      >
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">
          Get in Touch
        </p>
        <h1 className="mb-4 text-5xl">{title}</h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-white/70">
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
}
