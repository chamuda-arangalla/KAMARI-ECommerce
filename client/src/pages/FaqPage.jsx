import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DEFAULT_CONTACT_CONTENT } from "../components/contact/contactConstants";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FaqPage() {
  const faqs = DEFAULT_CONTACT_CONTENT.faqs || [];

  return (
    <main
      className="min-h-screen bg-[#FAF8F5] text-[#342C27]"
      style={{ paddingTop: "70px" }}
    >
      <div className="bg-[#EFE7DF] px-6 py-16 text-center sm:py-20">
        <h1 className="lg:text-4xl font-light tracking-[0.06em] text-2xl">
          FAQs
        </h1>
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl px-6 py-14 sm:py-20"
      >
        <p className="mb-10 text-base leading-8 text-[#5F514B]">
          Find quick answers to common questions about KAMARI orders, delivery,
          exchanges, and payments.
        </p>

        <div className="space-y-10">
          {faqs.map(({ question, answer }, index) => (
            <Section key={question} number={index + 1} title={question}>
              <p className="text-[15px] leading-8 text-[#5F514B] pl-6">
                {answer}
              </p>
              {index < faqs.length - 1 && <Divider />}
            </Section>
          ))}
        </div>

        <Divider />

        <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#8B7164]">
          Need More Help?
        </p>
        <Link
          to="/contact"
          className="text-sm text-[#5F514B] underline underline-offset-4 hover:text-[#342C27]"
        >
          Contact Us
        </Link>
      </motion.div>
    </main>
  );
}

function Divider() {
  return <hr className="my-10 border-[#D8C8BA]" />;
}

function Section({ number, title, children }) {
  return (
    <section>
      <h2 className="mb-5 flex items-baseline gap-3 text-md lg:text-lg font-medium tracking-[0.04em] text-[#342C27]">
        {number && (
          <span className="text-sm lg:text-md font-normal text-[#8B7164]">
            {number}.
          </span>
        )}
        <span className="lg:text-lg text-md uppercase tracking-[0.18em]">
          {title}
        </span>
      </h2>
      {children}
    </section>
  );
}
