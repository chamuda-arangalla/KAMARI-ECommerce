import crypto from "crypto";

const KOKO_API_BASE = (process.env.KOKO_API_URL || "https://prodapi.paykoko.com").replace(
  /\/$/,
  ""
);
const MERCHANT_ID = process.env.KOKO_MERCHANT_ID;
const API_KEY = process.env.KOKO_API_KEY;
const PLUGIN_NAME = process.env.KOKO_PLUGIN_NAME || "customapi";
const PLUGIN_VERSION = process.env.KOKO_PLUGIN_VERSION || "1";
const DEFAULT_REFERENCE = process.env.KOKO_REFERENCE || "1234";
const SAMPLE_MERCHANT_ID = "c8cca514bdfa0582cdc40c9703c71e9d";

const parsePEMKey = (keyString) => {
  if (!keyString) return null;

  let key = keyString.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  return key.replace(/\\n/g, "\n");
};

const PRIVATE_KEY = parsePEMKey(process.env.KOKO_PRIVATE_KEY);
const PUBLIC_KEY = parsePEMKey(process.env.KOKO_PUBLIC_KEY);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createKokoValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const createConfigError = (missing) =>
  new Error(`Missing Koko configuration: ${missing.join(", ")}`);

export const validateKokoOrderCreateConfig = () => {
  const missing = [];

  if (!MERCHANT_ID) missing.push("KOKO_MERCHANT_ID");
  if (!API_KEY) missing.push("KOKO_API_KEY");
  if (!PRIVATE_KEY) missing.push("KOKO_PRIVATE_KEY");

  if (missing.length > 0) {
    throw createConfigError(missing);
  }

  if (
    MERCHANT_ID === SAMPLE_MERCHANT_ID &&
    KOKO_API_BASE.includes("prodapi.paykoko.com")
  ) {
    const error = new Error(
      "Koko sample merchant credentials must use https://qaapi.paykoko.com. Use live merchant credentials before switching to production."
    );
    error.statusCode = 400;
    throw error;
  }
};

export const validateKokoCallbackConfig = () => {
  const missing = [];

  if (!PUBLIC_KEY) missing.push("KOKO_PUBLIC_KEY");

  if (missing.length > 0) {
    throw createConfigError(missing);
  }
};

export const validateKokoConfig = () => {
  validateKokoOrderCreateConfig();
  validateKokoCallbackConfig();
};

const createOrderDataString = ({
  orderId,
  amount,
  currency,
  returnUrl,
  cancelUrl,
  responseUrl,
  reference,
  firstName,
  lastName,
  email,
  description,
}) =>
  MERCHANT_ID +
  amount +
  currency +
  PLUGIN_NAME +
  PLUGIN_VERSION +
  returnUrl +
  cancelUrl +
  orderId +
  reference +
  firstName +
  lastName +
  email +
  description +
  API_KEY +
  responseUrl;

const createSignature = (dataString, key) => {
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(dataString);
  signer.end();
  return signer.sign(key, "base64");
};

export const verifyKokoSignature = (dataString, signature) => {
  validateKokoCallbackConfig();

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(dataString);
  verifier.end();
  return verifier.verify(PUBLIC_KEY, signature, "base64");
};

export const createKokoOrderRequest = (paymentParams) => {
  validateKokoOrderCreateConfig();

  const {
    orderId,
    amount,
    currency = "LKR",
    firstName,
    lastName,
    email,
    phoneNumber,
    description,
    returnUrl,
    cancelUrl,
    responseUrl,
    reference = DEFAULT_REFERENCE,
  } = paymentParams;

  const required = {
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
  };
  const missing = Object.entries(required)
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([key]) => key);

  if (missing.length > 0) {
    throw createKokoValidationError(
      `Missing required Koko payment fields: ${missing.join(", ")}`
    );
  }

  const amountValue = Number(amount);
  if (!Number.isFinite(amountValue) || amountValue <= 0) {
    throw createKokoValidationError("Koko payment amount must be greater than zero");
  }

  if (!emailRegex.test(String(email).trim())) {
    throw createKokoValidationError("Customer email is not valid for Koko payment");
  }

  if (!String(firstName).trim() || !String(lastName).trim()) {
    throw createKokoValidationError("Customer first name and last name are required for Koko payment");
  }

  if (!/^\+?[0-9\s-]{7,15}$/.test(String(phoneNumber).trim())) {
    throw createKokoValidationError("Customer phone number is not valid for Koko payment");
  }

  const invalidUrls = Object.entries({ returnUrl, cancelUrl, responseUrl })
    .filter(([, value]) => !isHttpUrl(value))
    .map(([key]) => key);

  if (invalidUrls.length > 0) {
    throw createKokoValidationError(
      `Invalid Koko payment URL fields: ${invalidUrls.join(", ")}`
    );
  }

  const normalizedAmount = Number.isInteger(amountValue)
    ? String(amountValue)
    : String(amount);
  const normalizedFirstName = String(firstName).trim();
  const normalizedLastName = String(lastName).trim();
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPhoneNumber = String(phoneNumber).trim();
  const normalizedReference = String(reference);
  const normalizedDescription = String(description).trim();
  const dataString = createOrderDataString({
    orderId: String(orderId),
    amount: normalizedAmount,
    currency,
    returnUrl,
    cancelUrl,
    responseUrl,
    reference: normalizedReference,
    firstName: normalizedFirstName,
    lastName: normalizedLastName,
    email: normalizedEmail,
    description: normalizedDescription,
  });
  const signature = createSignature(dataString, PRIVATE_KEY);

  // Keep the field names and order aligned with Koko's PHP sample.
  const fields = {
    _mId: MERCHANT_ID,
    api_key: API_KEY,
    _returnUrl: returnUrl,
    _responseUrl: responseUrl,
    _currency: currency,
    _amount: normalizedAmount,
    _reference: normalizedReference,
    _pluginName: PLUGIN_NAME,
    _pluginVersion: PLUGIN_VERSION,
    _cancelUrl: cancelUrl,
    _orderId: String(orderId),
    _firstName: normalizedFirstName,
    _lastName: normalizedLastName,
    _email: normalizedEmail,
    _description: normalizedDescription,
    dataString,
    signature,
    _mobileNo: normalizedPhoneNumber,
  };

  return {
    action: `${KOKO_API_BASE}/api/merchants/orderCreate`,
    method: "POST",
    fields,
  };
};

export const processKokoResponse = (responseData) => {
  validateKokoCallbackConfig();

  const orderId = responseData.orderId || responseData._orderId;
  const trnId = responseData.trnId || responseData._trnId || responseData.transactionId;
  const status = responseData.status || responseData._status;
  const desc = responseData.desc || responseData.description || "";
  const signature = responseData.signature;

  if (!orderId || !trnId || !status || !signature) {
    throw new Error("Missing required Koko callback fields");
  }

  const dataString = String(orderId) + String(trnId) + String(status) + String(desc);

  if (!verifyKokoSignature(dataString, signature)) {
    throw new Error("Invalid Koko callback signature");
  }

  return {
    orderId: String(orderId),
    trnId: String(trnId),
    status: String(status).toUpperCase(),
    description: String(desc),
  };
};

export default {
  createKokoOrderRequest,
  processKokoResponse,
  verifyKokoSignature,
  validateKokoConfig,
  validateKokoOrderCreateConfig,
  validateKokoCallbackConfig,
};
