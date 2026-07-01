import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function PrivacyPolicyPage() {
  return (
    <main
      className="min-h-screen bg-[#FAF8F5] text-[#342C27]"
      style={{ paddingTop: "70px" }}
    >
      {/* Page header */}
      <div className="bg-[#EFE7DF] px-6 py-16 text-center sm:py-20">
        <h1 className="text-4xl font-light tracking-[0.06em] sm:text-5xl">
          Privacy Policy
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
          At KAMARI, we value your privacy and are committed to protecting the
          personal information you share with us. This Privacy Policy explains
          how we collect, use, and safeguard your information when you visit our
          website or interact with us through any of our online and offline
          channels.
        </p>

        <Section number="1" title="Information We Collect">
          <p className="mb-4 text-[15px] leading-8 text-[#5F514B]">
            We may collect the following types of personal information:
          </p>
          <ul className="space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              <strong className="font-medium text-[#342C27]">
                Personal Details:
              </strong>{" "}
              Name, email address, phone number, and shipping or billing
              address.
            </BulletItem>
            <BulletItem>
              <strong className="font-medium text-[#342C27]">
                Order Information:
              </strong>{" "}
              Details of your purchases, payments, and delivery preferences.
            </BulletItem>
            <BulletItem>
              <strong className="font-medium text-[#342C27]">
                Device and Technical Data:
              </strong>{" "}
              IP address, browser type, device information, and website usage
              data.
            </BulletItem>
            <BulletItem>
              <strong className="font-medium text-[#342C27]">
                Communication Data:
              </strong>{" "}
              Messages, feedback, inquiries, or other information you share with
              us via email, phone, WhatsApp, social media, or other
              communication channels.
            </BulletItem>
          </ul>
        </Section>

        <Divider />

        <Section number="2" title="How We Use Your Information">
          <p className="mb-4 text-[15px] leading-8 text-[#5F514B]">
            We use your information to:
          </p>
          <ul className="mb-6 space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>Process and deliver your orders.</BulletItem>
            <BulletItem>
              Respond to your inquiries and customer service requests.
            </BulletItem>
            <BulletItem>
              Send order updates, promotional offers, and marketing
              communications where applicable.
            </BulletItem>
            <BulletItem>
              Improve our products, services, and website experience.
            </BulletItem>
            <BulletItem>
              Prevent fraudulent or unauthorized activities.
            </BulletItem>
            <BulletItem>
              Comply with legal and regulatory requirements.
            </BulletItem>
          </ul>
          <p className="text-[15px] leading-8 text-[#5F514B]">
            We do not sell or rent your personal information to third parties.
          </p>
        </Section>

        <Divider />

        <Section number="3" title="Payment Security">
          <p className="mb-4 text-[15px] leading-8 text-[#5F514B]">
            KAMARI does not store your complete payment card information.
          </p>
          <p className="text-[15px] leading-8 text-[#5F514B]">
            Payments are processed securely through trusted third-party payment
            providers. We encourage customers to review the privacy and security
            policies of these providers before making payments.
          </p>
        </Section>

        <Divider />

        <Section number="4" title="Cookies">
          <p className="mb-4 text-[15px] leading-8 text-[#5F514B]">
            Our website may use cookies and similar technologies to enhance your
            browsing experience. Cookies help us remember your preferences,
            analyze website traffic, improve website functionality, and support
            marketing activities.
          </p>
          <p className="text-[15px] leading-8 text-[#5F514B]">
            You may disable cookies through your browser settings; however,
            some features of the website may not function properly.
          </p>
        </Section>

        <Divider />

        <Section number="5" title="Sharing of Information">
          <p className="mb-4 text-[15px] leading-8 text-[#5F514B]">
            We may share your information with trusted third-party service
            providers only when necessary to operate our business and fulfill
            customer orders, including:
          </p>
          <ul className="mb-6 space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>Payment service providers</BulletItem>
            <BulletItem>Courier and delivery partners</BulletItem>
            <BulletItem>
              Website hosting and analytics providers
            </BulletItem>
          </ul>
          <p className="text-[15px] leading-8 text-[#5F514B]">
            These providers are only given access to information required to
            perform their services.
          </p>
        </Section>

        <Divider />

        <Section number="6" title="Data Security">
          <p className="mb-4 text-[15px] leading-8 text-[#5F514B]">
            We take reasonable measures to protect your personal information
            against unauthorized access, misuse, disclosure, alteration, or
            loss.
          </p>
          <p className="text-[15px] leading-8 text-[#5F514B]">
            While we strive to protect your information, no method of online
            transmission or electronic storage can be guaranteed to be
            completely secure.
          </p>
        </Section>

        <Divider />

        <Section number="7" title="Your Rights">
          <p className="mb-4 text-[15px] leading-8 text-[#5F514B]">
            You may request to:
          </p>
          <ul className="mb-6 space-y-4 text-[15px] leading-8 text-[#5F514B]">
            <BulletItem>
              Access the personal information we hold about you.
            </BulletItem>
            <BulletItem>Correct inaccurate information.</BulletItem>
            <BulletItem>
              Request the deletion of your personal information where
              applicable.
            </BulletItem>
            <BulletItem>
              Opt out of marketing communications at any time.
            </BulletItem>
          </ul>
          <p className="text-[15px] leading-8 text-[#5F514B]">
            To make such requests, please contact us using the details provided
            below.
          </p>
        </Section>

        <Divider />

        <Section number="8" title="Data Retention">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            We retain your personal information only for as long as necessary to
            fulfill orders, provide services, comply with legal obligations, and
            resolve disputes.
          </p>
        </Section>

        <Divider />

        <Section number="9" title="Children's Privacy">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            Our website and services are intended for individuals aged{" "}
            <strong className="font-medium text-[#342C27]">
              18 years and above
            </strong>
            . We do not knowingly collect personal information from individuals
            under the age of 18. If we become aware that such information has
            been collected, we will take reasonable steps to delete it promptly.
          </p>
        </Section>

        <Divider />

        <Section number="10" title="Third-Party Links">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            Our website may contain links to third-party websites or services.
            KAMARI is not responsible for the privacy practices or content of
            those external websites.
          </p>
        </Section>

        <Divider />

        <Section number="11" title="Changes to This Policy">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            We reserve the right to update or modify this Privacy Policy at any
            time. Any changes will be posted on this page with the updated
            revision date.
          </p>
        </Section>

        <Divider />

        <Section number="12" title="Contact Us">
          <p className="text-[15px] leading-8 text-[#5F514B]">
            For any questions, requests, or concerns regarding this Privacy
            Policy, please contact us:{" "}
            <a
              href="mailto:info@kamari.lk"
              className="text-[#342C27] underline underline-offset-4 hover:text-[#8B7164]"
            >
              info@kamari.lk
            </a>
            <br />
            Website:{" "}
            <span className="text-[#342C27]">www.kamari.lk</span>
          </p>
        </Section>

        <PolicyNav exclude="privacy" />
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
    { label: "Terms & Conditions", to: "/terms-conditions" },
    { label: "Privacy Policy", to: "/privacy-policy" },
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
