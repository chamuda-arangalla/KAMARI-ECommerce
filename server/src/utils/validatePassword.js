export const PASSWORD_REQUIREMENTS =
  "Password must be 8–72 characters and include an uppercase letter, lowercase letter, number, and special character, with no spaces";

const validatePassword = (password) => {
  if (typeof password !== "string") {
    return { valid: false, reason: PASSWORD_REQUIREMENTS };
  }

  const failures = [];

  if (password.length < 8) failures.push("at least 8 characters");
  if (Buffer.byteLength(password, "utf8") > 72) {
    failures.push("no more than 72 bytes");
  }
  if (!/[A-Z]/.test(password)) failures.push("an uppercase letter");
  if (!/[a-z]/.test(password)) failures.push("a lowercase letter");
  if (!/[0-9]/.test(password)) failures.push("a number");
  if (!/[^A-Za-z0-9\s]/.test(password)) failures.push("a special character");
  if (/\s/.test(password)) failures.push("no spaces");

  return failures.length
    ? {
        valid: false,
        reason: `Password must contain ${failures.join(", ")}`,
      }
    : { valid: true };
};

export default validatePassword;
