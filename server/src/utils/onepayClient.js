import crypto from "crypto";
import onepayConfig from "../config/onepay.js";

const { appId, appToken, hashSalt, baseUrl } = onepayConfig;

const buildHash = ({ amount, currency }) =>
  crypto
    .createHash("sha256")
    .update(`${appId}${currency}${amount}${hashSalt}`)
    .digest("hex");

// Confirmed against OnePay's live API and their official onepayjs SDK source
// (onepayv2.js -> triggerPayAPI): the Authorization header is the raw app token,
// with no "Bearer " prefix. ONEPAY_APP_TOKEN is a third credential, separate from
// ONEPAY_APP_ID and ONEPAY_HASH_SALT, issued alongside them in the merchant portal.
const postJson = async (path, body) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: appToken,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data?.message || `OnePay request to ${path} failed with status ${response.status}`
    );
    error.statusCode = response.status;
    error.details = data;
    throw error;
  }

  return data;
};

// Response shape confirmed from OnePay's official onepayjs SDK source
// (onepayv2.js -> triggerPayAPI): { data: { gateway: { redirect_url }, ipg_transaction_id } }.
// Falls back to a couple of other plausible shapes defensively, and logs the raw
// payload, in case this differs slightly for the server-side (non-JS-SDK) API path.
export const createCheckoutLink = async ({
  amount,
  currency,
  reference,
  customer,
  redirectUrl,
}) => {
  const hash = buildHash({ amount, currency });

  const data = await postJson("/checkout/link/", {
    app_id: appId,
    amount,
    currency,
    hash,
    reference,
    customer_first_name: customer.firstName,
    customer_last_name: customer.lastName,
    customer_phone_number: customer.phoneNumber,
    customer_email: customer.email,
    transaction_redirect_url: redirectUrl,
  });

  console.log("[OnePay] create-checkout-link raw response:", JSON.stringify(data));

  const redirectTo =
    data?.data?.gateway?.redirect_url ??
    data?.redirect_url ??
    data?.data?.redirect_url ??
    data?.payment_link ??
    null;
  const transactionId =
    data?.data?.ipg_transaction_id ??
    data?.transaction_id ??
    data?.data?.transaction_id ??
    null;

  if (!redirectTo) {
    const error = new Error("OnePay did not return a redirect URL");
    error.details = data;
    throw error;
  }

  return { redirectUrl: redirectTo, transactionId, raw: data };
};

export const getTransactionStatus = async ({ onepayTransactionId }) => {
  const data = await postJson("/transaction/status/", {
    app_id: appId,
    onepay_transaction_id: onepayTransactionId,
  });

  console.log("[OnePay] transaction-status raw response:", JSON.stringify(data));

  // Not exercised by the official onepayjs SDK (it relies on the Firestore push
  // channel instead), so this shape is still unconfirmed against a real sandbox
  // response — check both a nested "data" wrapper and top-level, same as the
  // now-confirmed checkout/link response, and narrow once observed.
  const payload = data?.data ?? data;
  const success =
    payload?.status === true ||
    payload?.status === 1 ||
    String(payload?.status ?? "").toUpperCase() === "SUCCESS";

  return {
    success,
    transactionId: payload?.ipg_transaction_id ?? onepayTransactionId,
    amount: payload?.amount,
    currency: payload?.currency,
    paidOn: payload?.paid_on,
    raw: data,
  };
};

export const onepayIsConfigured = () => Boolean(appId && appToken && hashSalt);
