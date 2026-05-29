import dns from "dns/promises";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = async (email) => {
  if (!emailRegex.test(email)) {
    return { valid: false, reason: "Invalid email format" };
  }

  const domain = email.split("@")[1];

  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return { valid: false, reason: "Email domain does not exist" };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: "Email domain does not exist" };
  }
};

export default validateEmail;
