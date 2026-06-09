const buildCustomerAddress = ({
  firstName,
  lastName,
  phone,
  addressLine1,
  addressLine2,
  city,
  district,
  province,
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
      province: province || "",
      postalCode: postalCode || "",
      country: "Sri Lanka",
      isDefault: true,
    },
  ];
};

export default buildCustomerAddress;
