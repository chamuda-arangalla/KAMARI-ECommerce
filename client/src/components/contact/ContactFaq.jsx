import { motion } from "framer-motion";
import { contactFadeUp, contactStagger } from "./contactConstants";

export default function ContactFaq({ faqs, openFaq, onToggle }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          variants={contactFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#5F564D]">
            Quick Answers
          </p>
          <h3 className="lg:text-2xl text-md">Frequently Asked Questions</h3>
        </motion.div>

        <motion.div
          variants={contactStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-3"
        >
          {(faqs || []).map(({ question, answer }, index) => (
            <motion.div
              key={question}
              variants={contactFadeUp}
              className="overflow-hidden rounded-xl border border-[#e8e2dc]"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-semibold text-[#2C2B28] transition hover:bg-[#EAE0D6]"
                onClick={() => onToggle(index)}
              >
                <span>{question}</span>
                <span className="ml-4 flex-shrink-0 text-xl font-light text-[#8f8376]">
                  {openFaq === index ? "-" : "+"}
                </span>
              </button>
              {openFaq === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-[#e8e2dc] bg-[#EAE0D6] px-6 py-5"
                >
                  <p className="text-sm leading-7 text-[#6E625C]">{answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
