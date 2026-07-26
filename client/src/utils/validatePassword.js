export const PASSWORD_REQUIREMENTS =
  "Use 8–72 characters with uppercase, lowercase, number, and special character. Spaces are not allowed.";

export const validatePassword = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (new TextEncoder().encode(password).length > 72) {
    return "Password must be no more than 72 bytes";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include an uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include a lowercase letter";
  }
  if (!/[0-9]/.test(password)) return "Password must include a number";
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return "Password must include a special character";
  }
  if (/\s/.test(password)) return "Password cannot contain spaces";
  return "";
};
