import { useEffect, useState } from "react";
import { Clock, Mail, Phone } from "lucide-react";
import ContactFaq from "../components/contact/ContactFaq";
import ContactForm from "../components/contact/ContactForm";
import ContactHero from "../components/contact/ContactHero";
import ContactInfoGrid, {
  FacebookIcon,
  InstagramIcon,
} from "../components/contact/ContactInfoGrid";
import ContactMapSocial from "../components/contact/ContactMapSocial";
import { DEFAULT_CONTACT_CONTENT } from "../components/contact/contactConstants";
import { getSiteContent } from "../services/siteContentApi";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [data, setData] = useState(DEFAULT_CONTACT_CONTENT);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    getSiteContent("contact")
      .then((res) =>
        setData({
          ...DEFAULT_CONTACT_CONTENT,
          ...res.data,
          emails: DEFAULT_CONTACT_CONTENT.emails,
        })
      )
      .catch(() => setData(DEFAULT_CONTACT_CONTENT));
  }, []);

  const contactInfo = [
    { icon: Phone, title: "Call Us", lines: data.phones },
    { icon: Mail, title: "Email Us", lines: data.emails },
    { icon: Clock, title: "Working Hours", lines: data.workingHours },
  ];

  const socialLinks = [
    {
      label: "Instagram",
      href: `https://instagram.com/${data.instagramHandle}`,
      icon: InstagramIcon,
    },
    {
      label: "Facebook",
      href: `https://facebook.com/${data.facebookHandle}`,
      icon: FacebookIcon,
    },
  ];

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setForm(EMPTY_FORM);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <main
      className="bg-[#EAE0D6] text-[#2C2B28]"
      style={{
        fontFamily: "var(--kamari-font-body)",
        paddingTop: "70px",
      }}
    >
      <ContactHero title={data.heroTitle} subtitle={data.heroSubtitle} />
      <ContactInfoGrid items={contactInfo} socialLinks={socialLinks} />

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ContactForm
          
            form={form}
            submitted={submitted}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          <ContactMapSocial data={data} />
        </div>
      </section>

      <ContactFaq
        faqs={data.faqs}
        openFaq={openFaq}
        onToggle={(index) => setOpenFaq(openFaq === index ? null : index)}
      />
    </main>
  );
}
