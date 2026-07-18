import { PAYMENT_METHODS, PAYMENT_TYPES } from "./constants";
import { getCustomerUser } from "../../utils/customerSession";

export const createReceiverDraft = () => {
  const customer = getCustomerUser() || {};
  const address =
    customer.addresses?.find((item) => item.isDefault) ||
    customer.addresses?.[0];

  return {
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    address: address?.addressLine1 || "",
    district: address?.district || address?.city || "",
    province: address?.province || "",
    country: address?.country || "Sri Lanka",
    postalCode: address?.postalCode || "",
    phoneNumber: customer.phone || address?.phone || "",
    secondaryPhoneNumber: "",
  };
};

const buildProductDetailsPayload = (items) =>
  items.map((item) => ({
    productId: item.productId || item.id,
    colour: item.variant,
    size: item.size,
    quantity: Number(item.qty || 1),
  }));

const buildReceiverPayload = (receiverDetails) => ({
  firstName: receiverDetails.firstName.trim(),
  lastName: receiverDetails.lastName.trim(),
  location: {
    address: receiverDetails.address.trim(),
    district: receiverDetails.district.trim(),
    province: receiverDetails.province.trim(),
    country: receiverDetails.country.trim() || "Sri Lanka",
    postalCode: receiverDetails.postalCode.trim(),
  },
  phoneNumber: receiverDetails.phoneNumber.trim(),
  secondaryPhoneNumber: receiverDetails.secondaryPhoneNumber.trim(),
});

export const buildOrderPayload = (items, receiverDetails, paymentMethod) => ({
  productDetails: buildProductDetailsPayload(items),
  receiverDetails: buildReceiverPayload(receiverDetails),
  paymentMethod,
  paymentType:
    paymentMethod === PAYMENT_METHODS.KOKO
      ? PAYMENT_TYPES.KOKO
      : paymentMethod === PAYMENT_METHODS.COD
        ? PAYMENT_TYPES.CASH_ON_DELIVERY
        : PAYMENT_TYPES.BANK_TRANSFER,
  paymentStatus: paymentMethod === PAYMENT_METHODS.COD ? "COD" : "pending",
});

export const buildOnePayCheckoutPayload = (items, receiverDetails) => ({
  productDetails: buildProductDetailsPayload(items),
  receiverDetails: buildReceiverPayload(receiverDetails),
});

export const buildUpdatedCustomer = (receiverDetails, updatedUser) => {
  const customer = updatedUser || getCustomerUser() || {};
  const existingAddresses = Array.isArray(customer.addresses)
    ? customer.addresses
    : [];
  const address = {
    fullName: `${receiverDetails.firstName || ""} ${
      receiverDetails.lastName || ""
    }`.trim(),
    phone: receiverDetails.phoneNumber,
    addressLine1: receiverDetails.address,
    addressLine2: "",
    city: receiverDetails.district,
    district: receiverDetails.district,
    province: receiverDetails.province,
    postalCode: receiverDetails.postalCode,
    country: receiverDetails.country || "Sri Lanka",
    isDefault: true,
  };

  return {
    ...customer,
    ...updatedUser,
    firstName: receiverDetails.firstName,
    lastName: receiverDetails.lastName,
    phone: receiverDetails.phoneNumber,
    addresses: [address, ...existingAddresses.filter((item) => !item.isDefault)],
  };
};
