const brandColor = "#1a1a1a";
const accentColor = "#c8a96e";

const baseLayout = (title, bodyContent) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="background:${brandColor};padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:${accentColor};font-size:28px;letter-spacing:4px;font-weight:300;">KAMARI</h1>
              <p style="margin:6px 0 0;color:#aaa;font-size:12px;letter-spacing:2px;">FASHION STORE</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;color:#999;font-size:12px;">© ${new Date().getFullYear()} Kamari Store. All rights reserved.</p>
              <p style="margin:6px 0 0;color:#999;font-size:12px;">If you have questions, reply to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const productTable = (productDetails) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
    <tr style="background:${brandColor};">
      <th style="padding:10px 12px;color:#fff;text-align:left;font-size:13px;font-weight:600;">Product</th>
      <th style="padding:10px 12px;color:#fff;text-align:center;font-size:13px;font-weight:600;">Color</th>
      <th style="padding:10px 12px;color:#fff;text-align:center;font-size:13px;font-weight:600;">Size</th>
      <th style="padding:10px 12px;color:#fff;text-align:center;font-size:13px;font-weight:600;">Qty</th>
      <th style="padding:10px 12px;color:#fff;text-align:right;font-size:13px;font-weight:600;">Price</th>
    </tr>
    ${productDetails
      .map(
        (item, i) => `
      <tr style="background:${i % 2 === 0 ? "#fff" : "#f9f9f9"};">
        <td style="padding:10px 12px;font-size:13px;color:#333;">${item.productName}</td>
        <td style="padding:10px 12px;font-size:13px;color:#555;text-align:center;">${item.colour}</td>
        <td style="padding:10px 12px;font-size:13px;color:#555;text-align:center;">${item.size}</td>
        <td style="padding:10px 12px;font-size:13px;color:#555;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;font-size:13px;color:#333;text-align:right;">LKR ${(item.unitPrice * item.quantity).toLocaleString()}</td>
      </tr>`
      )
      .join("")}
  </table>
`;

const pricingBlock = (pricing) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
    <tr>
      <td style="padding:6px 0;color:#666;font-size:13px;">Subtotal</td>
      <td style="padding:6px 0;color:#333;font-size:13px;text-align:right;">LKR ${pricing.subTotal.toLocaleString()}</td>
    </tr>
    <tr>
      <td style="padding:6px 0;color:#666;font-size:13px;">Shipping Fee</td>
      <td style="padding:6px 0;color:#333;font-size:13px;text-align:right;">LKR ${pricing.shippingFee.toLocaleString()}</td>
    </tr>
    <tr style="border-top:2px solid ${brandColor};">
      <td style="padding:10px 0 4px;color:${brandColor};font-size:15px;font-weight:bold;">Total</td>
      <td style="padding:10px 0 4px;color:${brandColor};font-size:15px;font-weight:bold;text-align:right;">LKR ${pricing.grandTotal.toLocaleString()}</td>
    </tr>
  </table>
`;

const addressBlock = (receiverDetails) => {
  const loc = receiverDetails.location || {};
  return `
    <p style="margin:0;font-size:13px;color:#333;line-height:1.7;">
      ${receiverDetails.firstName} ${receiverDetails.lastName}<br/>
      ${loc.address || ""}<br/>
      ${loc.district || ""}, ${loc.province || ""}<br/>
      ${loc.country || "Sri Lanka"} ${loc.postalCode || ""}<br/>
      Phone: ${receiverDetails.phoneNumber}
      ${receiverDetails.secondaryPhoneNumber ? `<br/>Alt Phone: ${receiverDetails.secondaryPhoneNumber}` : ""}
    </p>
  `;
};

const badge = (text, color) =>
  `<span style="display:inline-block;padding:4px 12px;background:${color};color:#fff;border-radius:20px;font-size:12px;font-weight:bold;letter-spacing:1px;">${text}</span>`;

// ─── Templates ────────────────────────────────────────────────────────────────

export const orderConfirmationTemplate = (order) =>
  baseLayout(
    "Order Confirmed",
    `
    <h2 style="margin:0 0 6px;color:${brandColor};font-size:20px;">Thank you for your order!</h2>
    <p style="margin:0 0 20px;color:#666;font-size:14px;">We've received your order and it's being processed.</p>

    <div style="background:#f9f9f9;border-left:4px solid ${accentColor};padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:${brandColor};letter-spacing:1px;">${order.orderId}</p>
    </div>

    <h3 style="color:${brandColor};font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Items Ordered</h3>
    ${productTable(order.productDetails)}
    ${pricingBlock(order.pricing)}

    <h3 style="color:${brandColor};font-size:14px;margin:24px 0 8px;text-transform:uppercase;letter-spacing:1px;">Delivery Address</h3>
    ${addressBlock(order.receiverDetails)}

    <p style="margin:28px 0 0;font-size:13px;color:#888;">Payment Method: <strong>${order.paymentStatus === "COD" ? "Cash on Delivery" : "Bank Transfer"}</strong></p>
    <p style="margin:20px 0 0;color:#666;font-size:14px;">We'll notify you once your order is on the way. Thank you for shopping with Kamari!</p>
  `
  );

export const adminNewOrderTemplate = (order, customerEmail, adminOrdersUrl) =>
  baseLayout(
    "New Order Received",
    `
    <h2 style="margin:0 0 6px;color:${brandColor};font-size:20px;">New Order Received ${badge("NEW", "#27ae60")}</h2>
    <p style="margin:0 0 20px;color:#666;font-size:14px;">A customer has placed a new order.</p>

    <div style="background:#f9f9f9;border-left:4px solid ${accentColor};padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:${brandColor};letter-spacing:1px;">${order.orderId}</p>
    </div>

    <h3 style="color:${brandColor};font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Customer</h3>
    <p style="margin:0 0 20px;font-size:13px;color:#333;">
      ${order.receiverDetails.firstName} ${order.receiverDetails.lastName}<br/>
      Email: <a href="mailto:${customerEmail}" style="color:${accentColor};">${customerEmail}</a><br/>
      Phone: ${order.receiverDetails.phoneNumber}
    </p>

    <h3 style="color:${brandColor};font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Items</h3>
    ${productTable(order.productDetails)}
    ${pricingBlock(order.pricing)}

    <h3 style="color:${brandColor};font-size:14px;margin:24px 0 8px;text-transform:uppercase;letter-spacing:1px;">Delivery Address</h3>
    ${addressBlock(order.receiverDetails)}

    <p style="margin:20px 0 0;font-size:13px;color:#888;">Payment: <strong>${order.paymentStatus === "COD" ? "Cash on Delivery" : "Bank Transfer"}</strong></p>

    <div style="margin-top:28px;">
      <a href="${adminOrdersUrl}" style="display:inline-block;padding:12px 28px;background:${brandColor};color:#fff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:bold;letter-spacing:1px;">View Orders</a>
    </div>
  `
  );

export const orderShippingTemplate = (order) =>
  baseLayout(
    "Your Order is On the Way!",
    `
    <h2 style="margin:0 0 6px;color:${brandColor};font-size:20px;">Your order is on the way! 🚚</h2>
    <p style="margin:0 0 20px;color:#666;font-size:14px;">Great news! Your order has been dispatched and is heading to you.</p>

    <div style="background:#f9f9f9;border-left:4px solid ${accentColor};padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:${brandColor};letter-spacing:1px;">${order.orderId}</p>
    </div>

    <h3 style="color:${brandColor};font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Delivering To</h3>
    ${addressBlock(order.receiverDetails)}

    <p style="margin:28px 0 0;color:#666;font-size:14px;">Please ensure someone is available at the delivery address. If you have any issues, contact us by replying to this email.</p>
  `
  );

export const orderDeliveredTemplate = (order) =>
  baseLayout(
    "Order Delivered!",
    `
    <h2 style="margin:0 0 6px;color:${brandColor};font-size:20px;">Your order has been delivered!</h2>
    <p style="margin:0 0 20px;color:#666;font-size:14px;">We hope you love your purchase. Thank you for choosing Kamari!</p>

    <div style="background:#f9f9f9;border-left:4px solid #27ae60;padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:${brandColor};letter-spacing:1px;">${order.orderId}</p>
    </div>

    ${productTable(order.productDetails)}

    <p style="margin:20px 0 0;color:#666;font-size:14px;">Enjoyed your experience? Share the love with your friends. We'd love to see you again!</p>
  `
  );

export const orderCancelledTemplate = (order) =>
  baseLayout(
    "Order Cancelled",
    `
    <h2 style="margin:0 0 6px;color:${brandColor};font-size:20px;">Your order has been cancelled</h2>
    <p style="margin:0 0 20px;color:#666;font-size:14px;">We're sorry to inform you that your order has been cancelled. If you believe this is a mistake, please contact us.</p>

    <div style="background:#f9f9f9;border-left:4px solid #e74c3c;padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:${brandColor};letter-spacing:1px;">${order.orderId}</p>
    </div>

    ${productTable(order.productDetails)}
    ${pricingBlock(order.pricing)}

    <p style="margin:20px 0 0;color:#666;font-size:14px;">If a payment was made, a refund will be processed shortly. Feel free to place a new order anytime.</p>
  `
  );

export const paymentConfirmedTemplate = (order) =>
  baseLayout(
    "Payment Confirmed",
    `
    <h2 style="margin:0 0 6px;color:${brandColor};font-size:20px;">Payment confirmed!</h2>
    <p style="margin:0 0 20px;color:#666;font-size:14px;">Your payment has been verified. Your order will now be processed for shipping.</p>

    <div style="background:#f9f9f9;border-left:4px solid #27ae60;padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:${brandColor};letter-spacing:1px;">${order.orderId}</p>
    </div>

    ${pricingBlock(order.pricing)}

    <p style="margin:20px 0 0;color:#666;font-size:14px;">Thank you for your payment. We'll notify you once your order ships.</p>
  `
  );

export const paymentFailedTemplate = (order) =>
  baseLayout(
    "Payment Failed",
    `
    <h2 style="margin:0 0 6px;color:${brandColor};font-size:20px;">Payment could not be processed</h2>
    <p style="margin:0 0 20px;color:#666;font-size:14px;">Unfortunately, your payment for the following order could not be verified. Please upload a valid payment slip or contact us for assistance.</p>

    <div style="background:#f9f9f9;border-left:4px solid #e74c3c;padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:${brandColor};letter-spacing:1px;">${order.orderId}</p>
    </div>

    ${pricingBlock(order.pricing)}

    <p style="margin:20px 0 0;color:#666;font-size:14px;">If you have already made a payment, please re-upload your payment slip. We apologize for the inconvenience.</p>
  `
  );

export const adminPaymentSlipTemplate = (order, customerEmail, adminOrdersUrl) =>
  baseLayout(
    "Payment Slip Uploaded — Action Required",
    `
    <h2 style="margin:0 0 6px;color:${brandColor};font-size:20px;">Payment slip uploaded ${badge("ACTION REQUIRED", "#e67e22")}</h2>
    <p style="margin:0 0 20px;color:#666;font-size:14px;">A customer has uploaded a payment slip. Please verify and update the payment status.</p>

    <div style="background:#f9f9f9;border-left:4px solid ${accentColor};padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:${brandColor};letter-spacing:1px;">${order.orderId}</p>
    </div>

    <h3 style="color:${brandColor};font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Customer</h3>
    <p style="margin:0 0 20px;font-size:13px;color:#333;">
      ${order.receiverDetails.firstName} ${order.receiverDetails.lastName}<br/>
      Email: <a href="mailto:${customerEmail}" style="color:${accentColor};">${customerEmail}</a><br/>
      Phone: ${order.receiverDetails.phoneNumber}
    </p>

    ${pricingBlock(order.pricing)}

    <div style="margin-top:24px;display:flex;gap:12px;">
      <a href="${order.paymentSlip?.url || "#"}" style="display:inline-block;padding:12px 24px;background:${brandColor};color:#fff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:bold;margin-right:12px;">View Payment Slip</a>
      <a href="${adminOrdersUrl}" style="display:inline-block;padding:12px 24px;background:${accentColor};color:#fff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:bold;">View Orders</a>
    </div>
  `
  );
