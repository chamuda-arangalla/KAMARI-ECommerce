import { motion } from "framer-motion";
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
      <div className="min-h-75 flex-1 overflow-hidden rounded-2xl border border-[#e8e2dc] shadow-sm">
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
    </motion.div>
  );
}
