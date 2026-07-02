import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ShippingPolicyPage() {
  return (
    <main
      className="min-h-screen bg-[#FAF8F5] text-[#342C27]"
      style={{ paddingTop: "70px" }}
    >
      {/* Page header */}
      <div className="bg-[#EFE7DF] px-6 py-16 text-center sm:py-20">
        <h1 className="text-4xl font-light tracking-[0.06em] sm:text-5xl">
          Shipping Policy
        </h1>
      </div>

      {/* Body */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl px-6 py-14 sm:py-20"
      >
        <p className="mb-10 text-base leading-8 text-[#5F514B]">
          At KAMARI, we aim to deliver your order safely and efficiently across
          Sri Lanka.
        </p>

        <Section>
          <ul className="space-y-5 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              Orders are typically delivered within{" "}
              <strong className="font-medium text-[#342C27]">
                3–7 working days
              </strong>{" "}
              from the date of order confirmation.
            </BulletItem>
            <BulletItem>
              <strong className="font-medium text-[#342C27]">
                Cash on Delivery (COD)
              </strong>{" "}
              is available.
            </BulletItem>
            <BulletItem>
              A standard islandwide delivery fee of{" "}
              <strong className="font-medium text-[#342C27]">Rs 450</strong>{" "}
              applies to all orders.
            </BulletItem>
            <BulletItem>
              Orders placed on weekends or public holidays will be processed on
              the next working day.
            </BulletItem>
            <BulletItem>
              Our delivery partner may contact you prior to delivery to confirm
              availability and delivery arrangements.
            </BulletItem>
            <BulletItem>
              Customers are responsible for providing accurate shipping
              information when placing an order. KAMARI is not responsible for
              delays or failed deliveries resulting from incorrect details
              provided by the customer.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section title="Contact Us">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            If you have any questions regarding shipping or delivery, please
            contact us at:{" "}
            <a
              href="mailto:hello@kamari.lk"
              className="text-[#342C27] underline underline-offset-4 hover:text-[#8B7164]"
            >
              hello@kamari.lk
            </a>
          </p>
        </Section>

        <PolicyNav exclude="shipping" />
      </motion.div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      {title && (
        <h2 className="mb-5 text-lg font-medium uppercase tracking-[0.18em] text-[#342C27]">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function BulletItem({ children }) {
  return (
    <li className="flex gap-3">
      <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-[#8B7164]" />
      <span>{children}</span>
    </li>
  );
}

function Divider() {
  return <hr className="my-10 border-[#D8C8BA]" />;
}

function PolicyNav({ exclude }) {
  const links = [
    { label: "Return & Exchange Policy", to: "/return-policy" },
    { label: "Terms & Conditions", to: "/terms-conditions" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Shipping Policy", to: "/shipping-policy" },
  ].filter((l) => !l.to.includes(exclude));

  return (
    <>
      <Divider />
      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#8B7164]">
        Other Policies
      </p>
      <div className="flex flex-wrap gap-4">
        {links.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className="text-sm text-[#5F514B] underline underline-offset-4 hover:text-[#342C27]"
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}
