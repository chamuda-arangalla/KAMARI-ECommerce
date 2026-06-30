import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function TermsConditionsPage() {
  return (
    <main
      className="min-h-screen bg-[#FAF8F5] text-[#342C27]"
      style={{ paddingTop: "70px" }}
    >
      {/* Page header */}
      <div className="bg-[#EFE7DF] px-6 py-16 text-center sm:py-20">
        <p className="mb-3 text-xs uppercase tracking-[0.34em] text-[#8B7164]">
          KAMARI
        </p>
        <h1 className="text-4xl font-light tracking-[0.06em] sm:text-5xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-sm text-[#8B7164]">Last Updated: June 2026</p>
      </div>

      {/* Body */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl px-6 py-14 sm:py-20"
      >
        <p className="mb-10 text-base leading-8 text-[#5F514B]">
          Welcome to KAMARI. By accessing and using{" "}
          <span className="text-[#342C27]">www.kamari.lk</span>, you agree to
          comply with and be bound by the following Terms &amp; Conditions.
          Please read them carefully before using our website or placing an
          order.
        </p>

        <Section number="1" title="General">
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              These Terms &amp; Conditions govern your use of www.kamari.lk and
              all purchases made through the website.
            </BulletItem>
            <BulletItem>
              We reserve the right to update, modify, or replace these Terms
              &amp; Conditions at any time without prior notice.
            </BulletItem>
            <BulletItem>
              By using this website, you agree to these Terms &amp; Conditions
              and any related policies published on our website.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="2" title="Products">
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              We strive to ensure that all product descriptions, images,
              colours, measurements, and pricing displayed on our website are
              accurate.
            </BulletItem>
            <BulletItem>
              Due to differences in screen settings, lighting, and photography,
              actual product colours may vary slightly from those displayed
              online.
            </BulletItem>
            <BulletItem>All products are subject to availability.</BulletItem>
            <BulletItem>
              We reserve the right to discontinue or modify products without
              prior notice.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="3" title="Pricing &amp; Payment">
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              All prices displayed on the website are in{" "}
              <strong className="font-medium text-[#342C27]">
                Sri Lankan Rupees (LKR)
              </strong>
              .
            </BulletItem>
            <BulletItem>
              Prices are subject to change without prior notice.
            </BulletItem>
            <BulletItem>
              Payment may be made using the payment methods available on the
              website or through Cash on Delivery (COD) where applicable.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="4" title="Promotions &amp; Discounts">
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              Promotional offers, discount codes, giveaways, and special
              campaigns are subject to their respective terms and conditions.
            </BulletItem>
            <BulletItem>
              KAMARI reserves the right to modify, suspend, or cancel any
              promotion without prior notice.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="5" title="Orders">
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              Once an order is placed, you will receive an order confirmation.
            </BulletItem>
            <BulletItem>
              KAMARI reserves the right to refuse, cancel, or limit any order
              due to product unavailability, pricing errors, suspected
              fraudulent activity, or any other reason deemed necessary.
            </BulletItem>
            <BulletItem>
              Customers are responsible for providing accurate billing and
              shipping information.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="6" title="Shipping &amp; Delivery">
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              Delivery timelines are estimates and may vary depending on
              location, courier operations, public holidays, weather conditions,
              and other circumstances beyond our control.
            </BulletItem>
            <BulletItem>
              KAMARI is not responsible for delays or failed deliveries
              resulting from incorrect shipping information provided by the
              customer.
            </BulletItem>
            <BulletItem>
              Shipping and delivery are subject to our{" "}
              <Link
                to="/shipping-policy"
                className="text-[#342C27] underline underline-offset-4 hover:text-[#8B7164]"
              >
                Shipping Policy
              </Link>
              .
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="7" title="Returns, Exchanges &amp; Refunds">
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              All returns, exchanges, and refunds are governed by our{" "}
              <Link
                to="/return-policy"
                className="text-[#342C27] underline underline-offset-4 hover:text-[#8B7164]"
              >
                Return &amp; Exchange Policy
              </Link>
              .
            </BulletItem>
            <BulletItem>
              Customers are encouraged to review these policies before placing
              an order.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="8" title="Intellectual Property">
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              All content on this website, including logos, branding, images,
              product photography, graphics, designs, text, and other materials,
              is the property of KAMARI.
            </BulletItem>
            <BulletItem>
              No content may be copied, reproduced, distributed, modified, or
              used without prior written permission from KAMARI.
            </BulletItem>
            <BulletItem>
              Unauthorized use of KAMARI content, branding, or product imagery
              may result in legal action.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="9" title="Limitation of Liability">
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              KAMARI shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our website,
              products, or services.
            </BulletItem>
            <BulletItem>
              Our maximum liability shall be limited to the value of the product
              purchased.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="10" title="Privacy">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            Your personal information is collected and processed in accordance
            with our{" "}
            <Link
              to="/privacy-policy"
              className="text-[#342C27] underline underline-offset-4 hover:text-[#8B7164]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </Section>

        <Divider />

        <Section number="11" title="Governing Law">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            These Terms &amp; Conditions shall be governed and interpreted in
            accordance with the laws of Sri Lanka.
          </p>
        </Section>

        <Divider />

        <Section number="12" title="Contact Us">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            If you have any questions regarding these Terms &amp; Conditions,
            please contact us at:{" "}
            <a
              href="mailto:info@kamari.lk"
              className="text-[#342C27] underline underline-offset-4 hover:text-[#8B7164]"
            >
              info@kamari.lk
            </a>
          </p>
        </Section>

        <PolicyNav exclude="terms" />
      </motion.div>
    </main>
  );
}

function Section({ number, title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-5 flex items-baseline gap-3 text-lg font-medium tracking-[0.04em] text-[#342C27]">
        {number && (
          <span className="text-sm font-normal text-[#8B7164]">{number}.</span>
        )}
        <span className="uppercase tracking-[0.18em]">{title}</span>
      </h2>
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
    { label: "Shipping Policy", to: "/shipping-policy" },
    { label: "Return & Exchange Policy", to: "/return-policy" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms & Conditions", to: "/terms-conditions" },
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
