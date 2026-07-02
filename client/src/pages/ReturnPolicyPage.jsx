import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ReturnPolicyPage() {
  return (
    <main
      className="min-h-screen bg-[#FAF8F5] text-[#342C27]"
      style={{ paddingTop: "70px" }}
    >
      {/* Page header */}
      <div className="bg-[#EFE7DF] px-6 py-16 text-center sm:py-20">
        <h1 className="text-4xl font-light tracking-[0.06em] sm:text-5xl">
          Return &amp; Exchange Policy
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
          At KAMARI, we want you to be completely satisfied with your purchase.
          Please read the following policy carefully before requesting an
          exchange or refund.
        </p>

        {/* Exchanges */}
        <Section title="Exchanges">
          <ul className="space-y-5 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              Exchange requests must be made{" "}
              <strong className="font-medium text-[#342C27]">
                within 7 days
              </strong>{" "}
              of receiving your order.
            </BulletItem>
            <BulletItem>
              Items must be unused, unwashed, undamaged, and returned in their
              original condition with all tags and packaging intact.
            </BulletItem>
            <BulletItem>
              Exchanges are subject to stock availability.
            </BulletItem>
            <BulletItem>
              Sale, promotional, discounted, or clearance items are{" "}
              <strong className="font-medium text-[#342C27]">
                not eligible
              </strong>{" "}
              for exchange.
            </BulletItem>
            <BulletItem>
              Items that do not meet the above conditions may be rejected and
              returned to the customer.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        {/* How to request exchange */}
        <Section title="How to Request an Exchange">
          <ol className="space-y-5 text-[15px] leading-8 text-[#5F514B]">
            <NumberedItem n={1}>
              Contact us within 7 days of receiving your order via email,
              WhatsApp, or our official social media channels.
            </NumberedItem>
            <NumberedItem n={2}>
              Let us know the reason for the exchange and provide clear photos
              of the item to confirm that it is unused, unwashed, undamaged, and
              in its original condition.
            </NumberedItem>
            <NumberedItem n={3}>
              Once your exchange request is reviewed and approved, we will
              dispatch the requested replacement item together with an exchange
              bag.
            </NumberedItem>
            <NumberedItem n={4}>
              Upon receiving the replacement item, please place the original
              item inside the exchange bag provided and hand it over to the
              courier.
            </NumberedItem>
            <NumberedItem n={5}>
              All returned items will be inspected upon receipt before the
              exchange is finalized.
            </NumberedItem>
          </ol>
        </Section>

        <Divider />

        {/* Exchange fees */}
        <Section title="Exchange Fees">
          <ul className="space-y-5 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              If the exchange is required due to an error on KAMARI's part
              (incorrect, defective, or damaged item), no exchange fee or
              delivery charge will apply.
            </BulletItem>
            <BulletItem>
              For all other exchanges, the customer is responsible for the
              applicable delivery charge and exchange bag fee.
            </BulletItem>
            <BulletItem>
              If the replacement item is priced higher than the original item,
              the customer will be required to pay the price difference.
            </BulletItem>
            <BulletItem>
              If the replacement item is priced lower than the original item,
              the balance amount will not be refunded.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        {/* Refunds */}
        <Section title="Refunds">
          <p className="mb-5 text-[15px] leading-8 text-[#5F514B]">
            Refunds are only available under the following circumstances:
          </p>
          <ul className="mb-0 space-y-5 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>The item received is damaged or defective.</BulletItem>
            <BulletItem>
              The item received is different from the item ordered.
            </BulletItem>
            <BulletItem>
              The requested replacement item is unavailable and an exchange
              cannot be completed.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        {/* How to request refund */}
        <Section title="How to Request a Refund">
          <ol className="space-y-5 text-[15px] leading-8 text-[#5F514B]">
            <NumberedItem n={1}>
              Contact us within{" "}
              <strong className="font-medium text-[#342C27]">3 days</strong> of
              receiving your order.
            </NumberedItem>
            <NumberedItem n={2}>
              Provide your order number, a description of the issue, and clear
              photographs for verification.
            </NumberedItem>
            <NumberedItem n={3}>
              Once the claim has been reviewed and approved, we will provide
              instructions for returning the item if required.
            </NumberedItem>
            <NumberedItem n={4}>
              Refunds will be processed within{" "}
              <strong className="font-medium text-[#342C27]">
                7 working days
              </strong>{" "}
              after approval.
            </NumberedItem>
            <NumberedItem n={5}>
              Refunds will be made through the original payment method used for
              the purchase where applicable.
            </NumberedItem>
          </ol>
          <p className="mt-6 text-[13px] leading-7 text-[#8B7164]">
            Please note that shipping charges are non-refundable unless the
            refund is due to an error on KAMARI's part.
          </p>
        </Section>

        <Divider />

        <Section title="Contact Us">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            For exchange or refund requests, please contact us at:{" "}
            <a
              href="mailto:hello@kamari.lk"
              className="text-[#342C27] underline underline-offset-4 hover:text-[#8B7164]"
            >
              hello@kamari.lk
            </a>
          </p>
        </Section>

        <PolicyNav exclude="return" />
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

function NumberedItem({ n, children }) {
  return (
    <li className="flex gap-4">
      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFE7DF] text-xs font-medium text-[#8B7164]">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

function Divider() {
  return <hr className="my-10 border-[#D8C8BA]" />;
}

function PolicyNav({ exclude }) {
  const links = [
    { label: "Shipping Policy", to: "/shipping-policy" },
    { label: "Terms & Conditions", to: "/terms-conditions" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Return & Exchange Policy", to: "/return-policy" },
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
