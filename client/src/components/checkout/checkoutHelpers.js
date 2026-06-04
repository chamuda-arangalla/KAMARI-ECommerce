import { PAYMENT_METHODS } from "./constants";

export const createReceiverDraft = () => {
  const customer = JSON.parse(localStorage.getItem("customerUser") || "{}");
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

export const buildOrderPayload = (items, receiverDetails, paymentMethod) => ({
  productDetails: items.map((item) => ({
    productId: item.productId || item.id,
    colour: item.variant,
    size: item.size,
    quantity: Number(item.qty || 1),
  })),
  receiverDetails: {
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
  },
  paymentStatus: paymentMethod === PAYMENT_METHODS.COD ? "COD" : "pending",
});

export const buildUpdatedCustomer = (receiverDetails, updatedUser) => {
  const customer =
    updatedUser || JSON.parse(localStorage.getItem("customerUser") || "{}");
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
