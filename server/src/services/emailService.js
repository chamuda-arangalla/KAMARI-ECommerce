import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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
    await transporter.sendMail({
      from: `"Kamari Store" <${process.env.GMAIL_USER}>`,
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
