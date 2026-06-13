import PDFDocument from "pdfkit";
import SiteContent from "../../models/SiteContent.js";

const DEFAULT_BRAND_NAME = "KAMARI";
const DEFAULT_CURRENCY = "LKR";
const PAGE_MARGIN = 48;
const FOOTER_HEIGHT = 88;
const INVOICE_THEME = Object.freeze({
  ink: "#2c2b28",
  inkSoft: "#5f564d",
  muted: "#8f8376",
  ivory: "#fcfaf7",
  cream: "#f8f1e8",
  sand: "#ead9c4",
  border: "#d7c9b8",
  rule: "#f3ede8",
  white: "#ffffff",
});

const formatCurrency = (value, currency = DEFAULT_CURRENCY) =>
  `${currency} ${Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-LK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

const safeText = (value) => String(value || "").trim();

const asArray = (value) => {
  if (Array.isArray(value)) return value.map(safeText).filter(Boolean);
  const text = safeText(value);
  return text ? [text] : [];
};

const getContentWidth = (doc) => doc.page.width - PAGE_MARGIN * 2;

const getFooterTop = (doc) => doc.page.height - FOOTER_HEIGHT;

const ensureWritableSpace = (doc, y, requiredHeight, profile) => {
  if (y + requiredHeight <= getFooterTop(doc)) return y;

  drawFooter(doc, profile);
  doc.addPage();
  return PAGE_MARGIN;
};

export const getInvoiceProfile = async () => {
  const contactContent = await SiteContent.findOne({ pageType: "contact" })
    .select("content")
    .lean();
  const content = contactContent?.content || {};

  return {
    brandName: safeText(process.env.INVOICE_BRAND_NAME) || DEFAULT_BRAND_NAME,
    email: safeText(process.env.INVOICE_EMAIL) || safeText(process.env.ADMIN_EMAIL),
    phone: safeText(process.env.INVOICE_PHONE) || asArray(content.phones)[0] || "",
    website: safeText(process.env.INVOICE_WEBSITE) || safeText(process.env.CLIENT_URL),
    address: asArray(process.env.INVOICE_ADDRESS || content.address),
    currency: safeText(process.env.INVOICE_CURRENCY) || DEFAULT_CURRENCY,
  };
};

const drawTextBlock = (doc, lines, x, y, options = {}) => {
  let cursorY = y;
  const lineGap = options.lineGap ?? 4;
  const textOptions = { ...options };
  delete textOptions.lineGap;

  lines.filter(Boolean).forEach((line) => {
    doc.text(line, x, cursorY, textOptions);
    cursorY += doc.heightOfString(line, { ...textOptions, width: textOptions.width }) + lineGap;
  });

  return cursorY;
};

const drawInvoiceHeader = (doc, order, profile) => {
  const contentWidth = getContentWidth(doc);
  const rightWidth = 185;
  const rightX = PAGE_MARGIN + contentWidth - rightWidth;

  doc.rect(0, 0, doc.page.width, 170).fill(INVOICE_THEME.ink);
  doc
    .fillColor(INVOICE_THEME.cream)
    .font("Helvetica-Bold")
    .fontSize(28)
    .text(profile.brandName, PAGE_MARGIN, 44, { letterSpacing: 2 });

  doc
    .fillColor(INVOICE_THEME.white)
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("INVOICE", rightX, 42, { width: 185, align: "right" });
  doc
    .fillColor(INVOICE_THEME.border)
    .font("Helvetica")
    .fontSize(10)
    .text(`# ${order.orderId}`, rightX, 78, { width: 185, align: "right" })
    .text(formatDate(order.createdAt), rightX, 96, { width: 185, align: "right" });
};

const drawProfileAndCustomer = (doc, order, profile) => {
  const contentWidth = getContentWidth(doc);
  const columnGap = 48;
  const columnWidth = (contentWidth - columnGap) / 2;
  const billToX = PAGE_MARGIN + columnWidth + columnGap;
  const receiver = order.receiverDetails || {};
  const location = receiver.location || {};
  const customerName = [receiver.firstName, receiver.lastName].filter(Boolean).join(" ");
  const customerAddress = [
    location.address,
    location.district,
    location.province,
    location.postalCode,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");

  doc.fillColor(INVOICE_THEME.ink).font("Helvetica-Bold").fontSize(10);
  doc.text("FROM", PAGE_MARGIN, 205);
  doc.text("BILL TO", billToX, 205);

  doc.fillColor(INVOICE_THEME.inkSoft).font("Helvetica").fontSize(10);
  const fromLines = [
    profile.brandName,
    ...profile.address,
    profile.phone,
    profile.email,
  ];
  drawTextBlock(doc, fromLines, PAGE_MARGIN, 228, { width: columnWidth, lineGap: 5 });

  const billToLines = [
    customerName || "Customer",
    customerAddress,
    receiver.phoneNumber,
    receiver.secondaryPhoneNumber,
  ];
  drawTextBlock(doc, billToLines, billToX, 228, { width: columnWidth, lineGap: 5 });
};

const drawMetaStrip = (doc, order) => {
  const top = 330;
  const contentWidth = getContentWidth(doc);
  const columnWidth = contentWidth / 3;
  const columns = [
    ["Payment", order.paymentStatus],
    ["Fulfillment", order.orderStatus],
    ["Order ID", order.orderId],
  ];

  doc
    .roundedRect(PAGE_MARGIN, top, contentWidth, 66, 8)
    .fill(INVOICE_THEME.ivory)
    .stroke(INVOICE_THEME.border);

  columns.forEach(([label, value], index) => {
    const x = PAGE_MARGIN + index * columnWidth;
    doc
      .fillColor(INVOICE_THEME.muted)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(label.toUpperCase(), x + 18, top + 16, { width: columnWidth - 36 });
    doc
      .fillColor(INVOICE_THEME.ink)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(safeText(value).toUpperCase(), x + 18, top + 34, { width: columnWidth - 36 });
  });
};

const drawTableHeader = (doc, y) => {
  const contentWidth = getContentWidth(doc);
  const columns = getTableColumns(doc);

  doc.roundedRect(PAGE_MARGIN, y, contentWidth, 32, 6).fill(INVOICE_THEME.ink);
  doc.fillColor(INVOICE_THEME.white).font("Helvetica-Bold").fontSize(8);
  doc.text("ITEM", columns.item.x, y + 11, { width: columns.item.width });
  doc.text("QTY", columns.qty.x, y + 11, { width: columns.qty.width, align: "right" });
  doc.text("UNIT", columns.unit.x, y + 11, { width: columns.unit.width, align: "right" });
  doc.text("TOTAL", columns.total.x, y + 11, { width: columns.total.width, align: "right" });
};

const getTableColumns = (doc) => {
  const contentWidth = getContentWidth(doc);
  const totalWidth = 88;
  const unitWidth = 82;
  const quantityWidth = 42;
  const gap = 14;
  const itemWidth = contentWidth - totalWidth - unitWidth - quantityWidth - gap * 4;
  const itemX = PAGE_MARGIN + gap;

  return {
    item: { x: itemX, width: itemWidth },
    qty: { x: itemX + itemWidth + gap, width: quantityWidth },
    unit: { x: itemX + itemWidth + quantityWidth + gap * 2, width: unitWidth },
    total: {
      x: itemX + itemWidth + quantityWidth + unitWidth + gap * 3,
      width: totalWidth,
    },
  };
};

const drawItemsTable = (doc, order, profile) => {
  const columns = getTableColumns(doc);
  const contentRight = PAGE_MARGIN + getContentWidth(doc);
  let y = 425;

  drawTableHeader(doc, y);
  y += 44;

  order.productDetails.forEach((item) => {
    const discountAmount = (Number(item.unitPrice || 0) * Number(item.discount || 0)) / 100;
    const invoiceUnitPrice = Number(item.unitPrice || 0) - discountAmount;
    const itemTotal = invoiceUnitPrice * Number(item.quantity || 0);
    const metaText = [
      `${item.colour} / Size ${item.size}`,
      Number(item.discount || 0) > 0 ? `${item.discount}% discount applied` : "",
    ]
      .filter(Boolean)
      .join(" / ");
    const productNameHeight = doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .heightOfString(item.productName, { width: columns.item.width });
    const metaHeight = doc
      .font("Helvetica")
      .fontSize(8)
      .heightOfString(metaText, { width: columns.item.width });
    const rowHeight = Math.max(48, productNameHeight + metaHeight + 22);

    y = ensureWritableSpace(doc, y, rowHeight + 14, profile);

    if (y === PAGE_MARGIN) {
      drawTableHeader(doc, y);
      y += 44;
    }

    doc.fillColor(INVOICE_THEME.ink).font("Helvetica-Bold").fontSize(10);
    doc.text(item.productName, columns.item.x, y, { width: columns.item.width });
    doc
      .fillColor(INVOICE_THEME.muted)
      .font("Helvetica")
      .fontSize(8)
      .text(metaText, columns.item.x, y + productNameHeight + 4, {
        width: columns.item.width,
      });

    doc.fillColor(INVOICE_THEME.inkSoft).font("Helvetica").fontSize(9);
    doc.text(String(item.quantity), columns.qty.x, y + 4, {
      width: columns.qty.width,
      align: "right",
    });
    doc.text(formatCurrency(invoiceUnitPrice, profile.currency), columns.unit.x, y + 4, {
      width: columns.unit.width,
      align: "right",
    });
    doc
      .font("Helvetica-Bold")
      .fillColor(INVOICE_THEME.ink)
      .text(formatCurrency(itemTotal, profile.currency), columns.total.x, y + 4, {
        width: columns.total.width,
        align: "right",
      });

    y += rowHeight;
    doc
      .moveTo(PAGE_MARGIN, y - 10)
      .lineTo(contentRight, y - 10)
      .strokeColor(INVOICE_THEME.rule)
      .stroke();
  });

  return y + 8;
};

const drawTotals = (doc, order, profile, y) => {
  const pricing = order.pricing || {};
  const width = Math.min(220, getContentWidth(doc));
  const x = PAGE_MARGIN + getContentWidth(doc) - width;
  const rows = [
    ["Subtotal", pricing.subTotal],
    ["Shipping", pricing.shippingFee],
    ["Grand Total", pricing.grandTotal],
  ];

  rows.forEach(([label, value], index) => {
    const isGrandTotal = index === rows.length - 1;
    const rowY = y + index * 28;

    if (isGrandTotal) {
      doc.roundedRect(x - 12, rowY - 7, width + 12, 34, 6).fill(INVOICE_THEME.sand);
    }

    doc
      .fillColor(isGrandTotal ? INVOICE_THEME.ink : INVOICE_THEME.inkSoft)
      .font(isGrandTotal ? "Helvetica-Bold" : "Helvetica")
      .fontSize(isGrandTotal ? 12 : 10)
      .text(label, x, rowY, { width: 88 });
    doc.text(formatCurrency(value, profile.currency), x + 92, rowY, {
      width: width - 92,
      align: "right",
    });
  });
};

const drawFooter = (doc, profile) => {
  const y = getFooterTop(doc) + 12;
  const contentWidth = getContentWidth(doc);

  doc
    .moveTo(PAGE_MARGIN, y)
    .lineTo(PAGE_MARGIN + contentWidth, y)
    .strokeColor(INVOICE_THEME.border)
    .stroke();
  doc
    .fillColor(INVOICE_THEME.muted)
    .font("Helvetica")
    .fontSize(8)
    .text("Thank you for shopping with us.", PAGE_MARGIN, y + 18, { width: contentWidth / 2 });
  doc.text(profile.brandName, PAGE_MARGIN + contentWidth / 2, y + 18, {
    width: contentWidth / 2,
    align: "right",
  });
};

export const createInvoicePdf = (order, profile) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: PAGE_MARGIN,
    info: {
      Title: `Invoice ${order.orderId}`,
      Author: profile.brandName,
      Subject: "Order invoice",
    },
  });

  drawInvoiceHeader(doc, order, profile);
  drawProfileAndCustomer(doc, order, profile);
  drawMetaStrip(doc, order);
  const totalsY = drawItemsTable(doc, order, profile);
  const totalsStartY = ensureWritableSpace(doc, Math.max(totalsY, 610), 96, profile);
  drawTotals(doc, order, profile, totalsStartY);
  drawFooter(doc, profile);

  return doc;
};
