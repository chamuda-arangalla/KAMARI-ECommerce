const buildCustomerAddress = ({
  firstName,
  lastName,
  phone,
  addressLine1,
  addressLine2,
  city,
  district,
  postalCode,
}) => {
  if (!addressLine1 && !city && !district && !phone) return [];

  return [
    {
      fullName: `${firstName || ""} ${lastName || ""}`.trim(),
      phone: phone || "",
      addressLine1: addressLine1 || "",
      addressLine2: addressLine2 || "",
      city: city || "",
      district: district || "",
      postalCode: postalCode || "",
      country: "Sri Lanka",
      isDefault: true,
    },
  ];
};

export default buildCustomerAddress;