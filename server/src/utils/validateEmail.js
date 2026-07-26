const emailRegex =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

const validateEmail = (email) => {
  if (typeof email !== "string") {
    return { valid: false, reason: "Invalid email format" };
  }

  const [localPart] = email.split("@");
  const isValid =
    email.length <= 254 &&
    localPart?.length <= 64 &&
    emailRegex.test(email);

  if (!isValid) {
    return { valid: false, reason: "Invalid email format" };
  }

  return { valid: true };
};

export default validateEmail;
