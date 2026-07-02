export const contactFadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const contactStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const DEFAULT_CONTACT_CONTENT = {
  heroTitle: "Contact Us",
  heroSubtitle:
    "We'd love to hear from you. Reach out with any questions about orders, products or anything else.",
  address: ["No. 45, Galle Road", "Colombo 03, Sri Lanka"],
  phones: ["+94 11 234 5678", "+94 77 123 4567"],
  emails: ["hello@kamari.lk"],
  workingHours: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.80779693802!2d79.82118895!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591614990c23%3A0xd43452e95c2e3c03!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1699999999999",
  whatsappNumber: "94771234567",
  instagramHandle: "kamarifashion",
  facebookHandle: "kamarifashion",
  faqs: [
    // Free delivery FAQ currently disabled:
    // {
    //   question: "Do you offer free delivery?",
    //   answer: "Yes! Orders over Rs 5,000 qualify for free delivery island-wide.",
    // },
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery across Sri Lanka takes 2-4 business days. Colombo orders are typically delivered within 1-2 business days.",
    },
    {
      question: "What is your exchange policy?",
      answer:
        "We accept exchange requests within 7 days of delivery. Items must be unworn, unwashed and in original condition with tags attached.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is dispatched, you will receive a confirmation with tracking details via email or WhatsApp.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Orders can be cancelled within 2 hours of placement. Please contact us immediately via WhatsApp or phone.",
    },
  ],
};
