import { motion } from "framer-motion";
import { Globe, Link2, MessageCircle } from "lucide-react";
import { contactFadeUp } from "./contactConstants";

export default function ContactMapSocial({ data }) {
  return (
    <motion.div
      variants={contactFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="flex flex-col gap-6"
    >
      <div className="min-h-[300px] flex-1 overflow-hidden rounded-2xl border border-[#e8e2dc] shadow-sm">
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

      <div className="rounded-2xl border border-[#e8e2dc] bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-base font-semibold uppercase tracking-[0.14em]">
          Connect With Us
        </h3>
        <div className="flex flex-col gap-4">
          <a
            href={`https://wa.me/${data.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-medium text-[#2C2B28] transition hover:border-[#D7C9B8] hover:bg-[#FAF7F3]"
          >
            <MessageCircle size={20} className="text-[#5F564D]" />
            Chat on WhatsApp - +{data.whatsappNumber}
          </a>
          <a
            href={`https://instagram.com/${data.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-medium text-[#2C2B28] transition hover:border-[#D7C9B8] hover:bg-[#FAF7F3]"
          >
            <Globe size={20} className="text-[#5F564D]" />
            Follow us on Instagram @{data.instagramHandle}
          </a>
          <a
            href={`https://facebook.com/${data.facebookHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-[#E8E2DC] bg-white px-5 py-4 text-sm font-medium text-[#2C2B28] transition hover:border-[#D7C9B8] hover:bg-[#FAF7F3]"
          >
            <Link2 size={20} className="text-[#5F564D]" />
            Like us on Facebook @{data.facebookHandle}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
