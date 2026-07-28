import nodemailer from "nodemailer";

const getTransporter = () => {
  const port = Number(process.env.SMTP_PORT || 587);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const htmlToPlainText = (html) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/th>/gi, "\t")
    .replace(/<\/td>/gi, "\t")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.warn(`[Email] Skipped "${subject}" — recipient email not found`);
    return;
  }
  try {
    await getTransporter().sendMail({
      from: `"Kamari Store" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: htmlToPlainText(html),
    });
    console.log(`[Email] Sent "${subject}" → ${to}`);
  } catch (error) {
    console.error(`[Email] Failed to send "${subject}" to ${to}:`, error.message);
  }
};
