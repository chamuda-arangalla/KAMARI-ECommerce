import crypto from "node:crypto";

const API_BASE = (process.env.KOKO_API_URL || "https://qaapi.paykoko.com").replace(
  /\/$/,
  "",
);
const MERCHANT_ID = process.env.KOKO_MERCHANT_ID;
const API_KEY = process.env.KOKO_API_KEY;
const PLUGIN_NAME = process.env.KOKO_PLUGIN_NAME || "customapi";
const PLUGIN_VERSION = process.env.KOKO_PLUGIN_VERSION || "1";
const REFERENCE = process.env.KOKO_REFERENCE || "1234";

const readPem = (value) =>
  value
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");

const PRIVATE_KEY = readPem(process.env.KOKO_PRIVATE_KEY);
const PUBLIC_KEY = readPem(process.env.KOKO_PUBLIC_KEY);

const requireValues = (values) => {
  const missing = Object.entries(values)
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(`Missing Koko configuration or fields: ${missing.join(", ")}`);
  }
};

const sign = (dataString) => {
  requireValues({ KOKO_PRIVATE_KEY: PRIVATE_KEY });
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(dataString);
  signer.end();
  return signer.sign(PRIVATE_KEY, "base64");
};

const verify = (dataString, signature) => {
  requireValues({ KOKO_PUBLIC_KEY: PUBLIC_KEY });
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(dataString);
  verifier.end();
  return verifier.verify(PUBLIC_KEY, signature, "base64");
};

// Mirrors sample-koko-order-create.php field-for-field.
export const createKokoPaymentForm = ({
  orderId,
  amount,
  firstName,
  lastName,
  email,
  phoneNumber,
  description,
  returnUrl,
  cancelUrl,
  responseUrl,
}) => {
  requireValues({
    KOKO_MERCHANT_ID: MERCHANT_ID,
    KOKO_API_KEY: API_KEY,
    KOKO_PRIVATE_KEY: PRIVATE_KEY,
    orderId,
    amount,
    firstName,
    lastName,
    email,
    phoneNumber,
    description,
    returnUrl,
    cancelUrl,
    responseUrl,
  });

  const values = {
    orderId: String(orderId),
    amount: String(amount),
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    email: String(email).trim().toLowerCase(),
    phoneNumber: String(phoneNumber).trim(),
    description: String(description),
  };

  const dataString =
    MERCHANT_ID +
    values.amount +
    "LKR" +
    PLUGIN_NAME +
    PLUGIN_VERSION +
    returnUrl +
    cancelUrl +
    values.orderId +
    REFERENCE +
    values.firstName +
    values.lastName +
    values.email +
    values.description +
    API_KEY +
    responseUrl;

  return {
    action: `${API_BASE}/api/merchants/orderCreate`,
    method: "POST",
    fields: {
      _mId: MERCHANT_ID,
      api_key: API_KEY,
      _returnUrl: returnUrl,
      _responseUrl: responseUrl,
      _currency: "LKR",
      _amount: values.amount,
      _reference: REFERENCE,
      _pluginName: PLUGIN_NAME,
      _pluginVersion: PLUGIN_VERSION,
      _cancelUrl: cancelUrl,
      _orderId: values.orderId,
      _firstName: values.firstName,
      _lastName: values.lastName,
      _email: values.email,
      _description: values.description,
      dataString,
      signature: sign(dataString),
      _mobileNo: values.phoneNumber,
    },
  };
};

export const processKokoResponse = (response) => {
  const payload = response?.content || response?.data || response;
  const orderId = payload?.orderId || payload?._orderId;
  const trnId = payload?.trnId || payload?._trnId || payload?.transactionId;
  const status = payload?.status || payload?._status;
  const desc = payload?.desc || payload?.description || "";
  const signature = payload?.signature;

  requireValues({ orderId, trnId, status, signature });

  if (!verify(`${orderId}${trnId}${status}${desc}`, signature)) {
    throw new Error("Invalid Koko response signature");
  }

  return {
    orderId: String(orderId),
    trnId: String(trnId),
    status: String(status).toUpperCase(),
    description: String(desc),
  };
};

export const viewKokoOrder = async (orderId) => {
  requireValues({
    KOKO_MERCHANT_ID: MERCHANT_ID,
    KOKO_API_KEY: API_KEY,
    KOKO_PRIVATE_KEY: PRIVATE_KEY,
    KOKO_PUBLIC_KEY: PUBLIC_KEY,
    orderId,
  });

  const normalizedOrderId = String(orderId);
  const dataString =
    MERCHANT_ID +
    PLUGIN_NAME +
    PLUGIN_VERSION +
    normalizedOrderId +
    API_KEY;

  const response = await fetch(`${API_BASE}/api/merchants/orderView`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      _mId: MERCHANT_ID,
      _pluginName: PLUGIN_NAME,
      _pluginVersion: PLUGIN_VERSION,
      api_key: API_KEY,
      _orderId: normalizedOrderId,
      signature: sign(dataString),
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Koko Order View request failed (${response.status})`);
  }

  const result = processKokoResponse(await response.json());
  if (result.orderId !== normalizedOrderId) {
    throw new Error("Koko returned a different order ID");
  }

  return result;
};
