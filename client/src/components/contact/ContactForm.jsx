import { motion } from "framer-motion";
import { Send } from "lucide-react";
import ContactField from "./ContactField";
import { contactFadeUp } from "./contactConstants";

export default function ContactForm({
  form,
  submitted,
  onChange,
  onSubmit,
}) {
  return (
    <motion.div
      variants={contactFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="rounded-2xl border border-[#e8e2dc] bg-white p-10 shadow-sm"
    >
      <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#5F564D]">
        Send a Message
      </p>
      <h2 className="mb-8 text-3xl">We'll get back to you soon</h2>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-green-100 bg-green-50 py-16 text-center"
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
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ContactField label="Full Name *" name="name" value={form.name} onChange={onChange} required placeholder="Your name" />
            <ContactField label="Email *" name="email" type="email" value={form.email} onChange={onChange} required placeholder="your@email.com" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ContactField label="Phone" name="phone" value={form.phone} onChange={onChange} placeholder="+94 77 123 4567" />
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5F564D]">
                Subject
              </label>
              <select
                name="subject"
                value={form.subject}
                onChange={onChange}
                className="w-full rounded-xl border border-[#E8E2DC] bg-white px-4 py-3 text-sm text-[#2C2B28] outline-none transition focus:border-[#BDAF9F] focus:ring-4 focus:ring-[#EAE0D6]/60"
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
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5F564D]">
              Message *
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              required
              rows={5}
              placeholder="How can we help you?"
              className="w-full resize-none rounded-xl border border-[#E8E2DC] bg-white px-4 py-3 text-sm text-[#2C2B28] outline-none transition placeholder:text-[#9A8F86] focus:border-[#BDAF9F] focus:ring-4 focus:ring-[#EAE0D6]/60"
            />
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#2C2B28] py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#4B443D]"
          >
            <Send size={16} />
            Send Message
          </motion.button>
        </form>
      )}
    </motion.div>
  );
}
