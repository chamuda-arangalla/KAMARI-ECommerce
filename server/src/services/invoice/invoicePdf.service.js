import PDFDocument from "pdfkit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import SiteContent from "../../models/SiteContent.js";

const DEFAULT_BRAND_NAME = "KAMARI";
const DEFAULT_CURRENCY = "LKR";
const PAGE_MARGIN = 36;
const FOOTER_HEIGHT = 54;
const AMOUNT_RIGHT_INSET = 12;
const INVOICE_LOGO_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../assets/Kamari-logo.png"
);
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

const getFooterTop = (doc) => doc.page.height - PAGE_MARGIN - FOOTER_HEIGHT;

const getAmountTextBox = (column, inset = AMOUNT_RIGHT_INSET) => ({
  x: column.x,
  width: column.width - inset,
});

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

  doc.rect(0, 0, doc.page.width, 112).fill(INVOICE_THEME.ink);
  doc.roundedRect(PAGE_MARGIN, 27, 160, 48, 5).fill(INVOICE_THEME.cream);
  doc.image(INVOICE_LOGO_PATH, PAGE_MARGIN + 10, 37, {
    fit: [140, 28],
    align: "center",
    valign: "center",
  });

  doc
    .fillColor(INVOICE_THEME.white)
    .font("Helvetica-Bold")
    .fontSize(21)
    .text("INVOICE", rightX, 31, { width: 185, align: "right" });
  doc
    .fillColor(INVOICE_THEME.border)
    .font("Helvetica")
    .fontSize(9)
    .text(`# ${order.orderId}`, rightX, 61, { width: 185, align: "right" })
    .text(formatDate(order.createdAt), rightX, 77, { width: 185, align: "right" });

  return 130;
};

const drawProfileAndCustomer = (doc, order, profile, y) => {
  const contentWidth = getContentWidth(doc);
  const columnGap = 30;
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

  doc.fillColor(INVOICE_THEME.ink).font("Helvetica-Bold").fontSize(8);
  doc.text("FROM", PAGE_MARGIN, y, { width: columnWidth });
  doc.text("BILL TO", billToX, y, { width: columnWidth });

  doc.fillColor(INVOICE_THEME.inkSoft).font("Helvetica").fontSize(9);
  const fromLines = [
    profile.brandName,
    ...profile.address,
    profile.phone,
    profile.email,
  ];
  const fromBottom = drawTextBlock(doc, fromLines, PAGE_MARGIN, y + 16, {
    width: columnWidth,
    lineGap: 2,
  });

  const billToLines = [
    customerName || "Customer",
    customerAddress,
    receiver.phoneNumber,
    receiver.secondaryPhoneNumber,
  ];
  const billToBottom = drawTextBlock(doc, billToLines, billToX, y + 16, {
    width: columnWidth,
    lineGap: 2,
  });

  return Math.max(fromBottom, billToBottom) + 16;
};

const drawMetaStrip = (doc, order, top) => {
  const contentWidth = getContentWidth(doc);
  const columnWidth = contentWidth / 3;
  const columns = [
    ["Payment", order.paymentStatus],
    ["Fulfillment", order.orderStatus],
    ["Order ID", order.orderId],
  ];

  doc
    .roundedRect(PAGE_MARGIN, top, contentWidth, 48, 6)
    .fill(INVOICE_THEME.ivory)
    .stroke(INVOICE_THEME.border);

  columns.forEach(([label, value], index) => {
    const x = PAGE_MARGIN + index * columnWidth;
    doc
      .fillColor(INVOICE_THEME.muted)
      .font("Helvetica-Bold")
      .fontSize(7)
      .text(label.toUpperCase(), x + 14, top + 10, { width: columnWidth - 28 });
    doc
      .fillColor(INVOICE_THEME.ink)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(safeText(value).toUpperCase(), x + 14, top + 25, { width: columnWidth - 28 });
  });

  return top + 62;
};

const drawTableHeader = (doc, y) => {
  const contentWidth = getContentWidth(doc);
  const columns = getTableColumns(doc);

  doc.roundedRect(PAGE_MARGIN, y, contentWidth, 26, 5).fill(INVOICE_THEME.ink);
  doc.fillColor(INVOICE_THEME.white).font("Helvetica-Bold").fontSize(7.5);
  doc.text("PRODUCT", columns.item.x, y + 9, { width: columns.item.width });
  doc.text("QTY", columns.qty.x, y + 9, { width: columns.qty.width, align: "right" });
  doc.text("UNIT PRICE", columns.unit.x, y + 9, {
    width: columns.unit.width,
    align: "right",
  });
  const totalHeaderBox = getAmountTextBox(columns.total);
  doc.text("LINE TOTAL", totalHeaderBox.x, y + 9, {
    width: totalHeaderBox.width,
    align: "right",
  });
};

const drawContinuationLabel = (doc, order, y) => {
  doc
    .fillColor(INVOICE_THEME.muted)
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .text(`INVOICE #${order.orderId} CONTINUED`, PAGE_MARGIN, y, {
      width: getContentWidth(doc),
      align: "right",
    });

  return y + 16;
};

const getTableColumns = (doc) => {
  const contentWidth = getContentWidth(doc);
  const totalWidth = 112;
  const unitWidth = 100;
  const quantityWidth = 32;
  const gap = 10;
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
  let y = drawMetaStrip(
    doc,
    order,
    drawProfileAndCustomer(doc, order, profile, drawInvoiceHeader(doc, order, profile)),
  );

  drawTableHeader(doc, y);
  y += 34;

  order.productDetails.forEach((item, index) => {
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
      .fontSize(9.5)
      .heightOfString(item.productName, { width: columns.item.width });
    const metaHeight = doc
      .font("Helvetica")
      .fontSize(7.5)
      .heightOfString(metaText, { width: columns.item.width });
    const unitHeight = doc
      .font("Helvetica")
      .fontSize(8)
      .heightOfString(formatCurrency(invoiceUnitPrice, profile.currency), {
        width: columns.unit.width,
        align: "right",
      });
    const totalHeight = doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .heightOfString(formatCurrency(itemTotal, profile.currency), {
        width: columns.total.width,
        align: "right",
      });
    const textHeight = productNameHeight + (metaText ? metaHeight + 3 : 0);
    const rowHeight = Math.max(34, textHeight + 16, unitHeight + 16, totalHeight + 16);

    y = ensureWritableSpace(doc, y, rowHeight + 10, profile);

    if (y === PAGE_MARGIN) {
      y = drawContinuationLabel(doc, order, y);
      drawTableHeader(doc, y);
      y += 34;
    }

    if (index % 2 === 1) {
      doc.rect(PAGE_MARGIN, y - 6, getContentWidth(doc), rowHeight).fill(INVOICE_THEME.ivory);
    }

    doc.fillColor(INVOICE_THEME.ink).font("Helvetica-Bold").fontSize(9.5);
    doc.text(item.productName, columns.item.x, y, { width: columns.item.width });
    doc
      .fillColor(INVOICE_THEME.muted)
      .font("Helvetica")
      .fontSize(7.5)
      .text(metaText, columns.item.x, y + productNameHeight + 4, {
        width: columns.item.width,
      });

    doc.fillColor(INVOICE_THEME.inkSoft).font("Helvetica").fontSize(8);
    doc.text(String(item.quantity), columns.qty.x, y + 1, {
      width: columns.qty.width,
      align: "right",
    });
    doc.text(formatCurrency(invoiceUnitPrice, profile.currency), columns.unit.x, y + 1, {
      width: columns.unit.width,
      align: "right",
    });
    const totalValueBox = getAmountTextBox(columns.total);
    doc
      .font("Helvetica-Bold")
      .fillColor(INVOICE_THEME.ink)
      .fontSize(8)
      .text(formatCurrency(itemTotal, profile.currency), totalValueBox.x, y + 1, {
        width: totalValueBox.width,
        align: "right",
      });

    y += rowHeight;
    doc
      .moveTo(PAGE_MARGIN, y - 6)
      .lineTo(contentRight, y - 6)
      .strokeColor(INVOICE_THEME.rule)
      .stroke();
  });

  return y + 8;
};

const drawTotals = (doc, order, profile, y) => {
  const pricing = order.pricing || {};
  const width = Math.min(240, getContentWidth(doc));
  const x = PAGE_MARGIN + getContentWidth(doc) - width;
  const rows = [
    ["Subtotal", pricing.subTotal],
    ["Shipping", pricing.shippingFee],
    ["Grand Total", pricing.grandTotal],
  ];

  rows.forEach(([label, value], index) => {
    const isGrandTotal = index === rows.length - 1;
    const rowY = y + index * 24;
    const labelWidth = 88;
    const valueX = x + 92;
    const valueWidth = width - 92 - AMOUNT_RIGHT_INSET;

    if (isGrandTotal) {
      doc.roundedRect(x - 10, rowY - 6, width + 10, 30, 5).fill(INVOICE_THEME.sand);
    }

    doc
      .fillColor(isGrandTotal ? INVOICE_THEME.ink : INVOICE_THEME.inkSoft)
      .font(isGrandTotal ? "Helvetica-Bold" : "Helvetica")
      .fontSize(isGrandTotal ? 11 : 9)
      .text(label, x, isGrandTotal ? rowY + 3 : rowY, { width: labelWidth });

    doc.text(formatCurrency(value, profile.currency), valueX, isGrandTotal ? rowY + 3 : rowY, {
      width: valueWidth,
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
    .fontSize(7.5)
    .text("Thank you for shopping with us.", PAGE_MARGIN, y + 12, { width: contentWidth / 2 });
  doc.text(profile.brandName, PAGE_MARGIN + contentWidth / 2, y + 12, {
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

  const totalsY = drawItemsTable(doc, order, profile);
  const totalsStartY = ensureWritableSpace(doc, totalsY, 82, profile);
  drawTotals(doc, order, profile, totalsStartY);
  drawFooter(doc, profile);

  return doc;
};
