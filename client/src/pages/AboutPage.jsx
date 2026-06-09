import { motion } from "framer-motion";
import aboutHeroImg from "../assets/images/About-Hero.png";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F5F2] text-[#342C27]" style={{ paddingTop: "70px" }}>
      <section className="relative min-h-[78vh] overflow-hidden bg-[#EFE7DF]">
        <motion.img
          src={aboutHeroImg}
          alt="KAMARI sleepwear"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-95"
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.95 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-[#3B302A]/34" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,245,242,0.9)_0%,rgba(248,245,242,0.72)_42%,rgba(59,48,42,0.24)_100%)]" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-6 py-20 text-left text-[#342C27]"
        >
          <motion.p
            variants={fadeUp}
            className="mb-5 text-xs uppercase tracking-[0.34em] text-[#8B7164]"
          >
            About KAMARI
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="max-w-3xl text-5xl font-light leading-tight tracking-[0.08em] sm:text-6xl lg:text-7xl"
          >
            Glow Even in the Dark
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-2xl text-base leading-8 text-[#5F514B] sm:text-lg"
          >
            KAMARI was created for slow evenings, deep rest, and the comfort every person deserves
            after long days. Inspired by calm nights and intentional living, our pieces are designed
            to make rest feel soft, beautiful, and effortless.
          </motion.p>
        </motion.div>
      </section>

      <section className="relative bg-[#F8F5F2] px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#8B7164]">The Brand Story</p>
            <h2 className="text-4xl font-light leading-tight text-[#342C27] sm:text-5xl">
              Rest, made intentional.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-7 border-l border-[#D8C8BA] pl-8 text-[15px] leading-8 text-[#5F514B] sm:text-base"
          >
            <motion.p variants={fadeUp}>
              KAMARI was inspired by the quiet beauty of the night and the energy that comes from a
              good night's sleep. We believe that true rest has the power to shape your next day,
              your mindset, and even your future.
            </motion.p>
            <motion.p variants={fadeUp}>
              Created for people who value self-care and comfort, KAMARI is more than sleepwear - it
              is a reminder to slow down, recharge, and care for yourself with intention.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
