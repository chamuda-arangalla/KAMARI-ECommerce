import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Globe, Link2, MessageCircle, Send } from "lucide-react";
import { getSiteContent } from "../services/siteContentApi";

const fadeUp  = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const DEFAULTS = {
  heroTitle: "Contact Us",
  heroSubtitle: "We'd love to hear from you. Reach out with any questions about orders, products or anything else.",
  address: ["No. 45, Galle Road", "Colombo 03, Sri Lanka"],
  phones: ["+94 11 234 5678", "+94 77 123 4567"],
  emails: ["hello@kamari.lk", "support@kamari.lk"],
  workingHours: ["Mon – Fri: 9:00 AM – 6:00 PM", "Sat: 10:00 AM – 4:00 PM"],
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.80779693802!2d79.82118895!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591614990c23%3A0xd43452e95c2e3c03!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1699999999999",
  whatsappNumber: "94771234567",
  instagramHandle: "kamarifashion",
  facebookHandle: "kamarifashion",
  faqs: [
    { question: "How long does delivery take?",  answer: "Standard delivery across Sri Lanka takes 2–4 business days. Colombo orders are typically delivered within 1–2 business days." },
    { question: "What is your exchange policy?", answer: "We accept exchange requests within 7 days of delivery. Items must be unworn, unwashed and in original condition with tags attached." },
    { question: "Do you offer free delivery?",   answer: "Yes! Orders over LKR 5,000 qualify for free delivery island-wide." },
    { question: "How can I track my order?",     answer: "Once your order is dispatched, you will receive a confirmation with tracking details via email or WhatsApp." },
    { question: "Can I cancel my order?",        answer: "Orders can be cancelled within 2 hours of placement. Please contact us immediately via WhatsApp or phone." },
  ],
};

export default function ContactPage() {
  const [data, setData]           = useState(DEFAULTS);
  const [form, setForm]           = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq]     = useState(null);

  useEffect(() => {
    getSiteContent("contact")
      .then((res) => setData({ ...DEFAULTS, ...res.data }))
      .catch(() => setData(DEFAULTS));
  }, []);

  const contactInfo = [
    { icon: MapPin, title: "Visit Us",       lines: data.address },
    { icon: Phone,  title: "Call Us",        lines: data.phones },
    { icon: Mail,   title: "Email Us",       lines: data.emails },
    { icon: Clock,  title: "Working Hours",  lines: data.workingHours },
  ];

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <main
      className="bg-[#F8F5F2] text-[#3B302A]"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", paddingTop: "70px" }}
    >
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-[#3B302A] py-20 text-center text-white">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Get in Touch</p>
          <h1 className="mb-4 text-5xl font-light tracking-[0.12em]">{data.heroTitle}</h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/70">{data.heroSubtitle}</p>
        </motion.div>
      </section>

      {/* ── Contact Info Cards ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contactInfo.map(({ icon: Icon, title, lines }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-2xl border border-[#e8e2dc] bg-white p-8 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE7DF]">
                <Icon size={22} className="text-[#3B302A]" />
              </div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]">{title}</h3>
              {lines.map((line) => (
                <p key={line} className="text-sm leading-7 text-[#6E625C]">{line}</p>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Form + Map ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

          {/* Contact Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-[#e8e2dc] bg-white p-10 shadow-sm"
          >
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#7D746C]">Send a Message</p>
            <h2 className="mb-8 text-3xl font-light">We'll get back to you soon</h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-green-50 border border-green-100 py-16 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Send size={28} className="text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-800">Message Sent!</h3>
                <p className="max-w-xs text-sm text-green-700">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full Name *" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
                  <Field label="Email *" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+94 77 123 4567" />
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#7D746C]">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#e5ddd5] bg-[#F8F5F2] px-4 py-3 text-sm text-[#3B302A] outline-none focus:border-[#3B302A] transition"
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="exchange">Exchange / Return</option>
                      <option value="delivery">Delivery Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#7D746C]">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full rounded-xl border border-[#e5ddd5] bg-[#F8F5F2] px-4 py-3 text-sm text-[#3B302A] outline-none focus:border-[#3B302A] transition resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#3B302A] py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#2e2622]"
                >
                  <Send size={16} />
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Map + Social */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* Map placeholder */}
            <div className="overflow-hidden rounded-2xl border border-[#e8e2dc] shadow-sm flex-1 min-h-[300px]">
              <iframe
                title="KAMARI Location"
                src={data.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Social + WhatsApp */}
            <div className="rounded-2xl border border-[#e8e2dc] bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-base font-semibold uppercase tracking-[0.14em]">Connect With Us</h3>
              <div className="flex flex-col gap-4">
                <a
                  href={`https://wa.me/${data.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 px-5 py-4 text-sm font-medium text-[#128C7E] transition hover:bg-[#25D366]/20"
                >
                  <MessageCircle size={20} className="text-[#25D366]" />
                  Chat on WhatsApp — +{data.whatsappNumber}
                </a>
                <a
                  href={`https://instagram.com/${data.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-pink-50 border border-pink-100 px-5 py-4 text-sm font-medium text-pink-700 transition hover:bg-pink-100"
                >
                  <Globe size={20} />
                  Follow us on Instagram @{data.instagramHandle}
                </a>
                <a
                  href={`https://facebook.com/${data.facebookHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl bg-blue-50 border border-blue-100 px-5 py-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  <Link2 size={20} />
                  Like us on Facebook @{data.facebookHandle}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#7D746C]">Quick Answers</p>
            <h2 className="text-4xl font-light">Frequently Asked Questions</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-3"
          >
            {(data.faqs || []).map(({ question: q, answer: a }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="overflow-hidden rounded-xl border border-[#e8e2dc]"
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-semibold text-[#3B302A] transition hover:bg-[#F8F5F2]"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{q}</span>
                  <span className="ml-4 flex-shrink-0 text-xl font-light text-[#a3948b]">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-[#e8e2dc] bg-[#F8F5F2] px-6 py-5"
                  >
                    <p className="text-sm leading-7 text-[#6E625C]">{a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#7D746C]">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#e5ddd5] bg-[#F8F5F2] px-4 py-3 text-sm text-[#3B302A] outline-none focus:border-[#3B302A] transition"
      />
    </div>
  );
}
