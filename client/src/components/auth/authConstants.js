export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const REDIRECT_MAP = {
  checkout: "/checkout",
  cart: "/cart",
};

export const resolveCustomerRedirect = (redirect) => {
  if (!redirect) return "/";
  if (REDIRECT_MAP[redirect]) return REDIRECT_MAP[redirect];

  return redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/";
};
