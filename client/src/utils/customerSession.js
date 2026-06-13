const CUSTOMER_TOKEN_KEY = "customerToken";
const CUSTOMER_USER_KEY = "customerUser";

export const clearLegacyCustomerSession = () => {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_USER_KEY);
};

export const getCustomerToken = () => sessionStorage.getItem(CUSTOMER_TOKEN_KEY);

export const getCustomerUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(CUSTOMER_USER_KEY) || "null");
  } catch {
    return null;
  }
};

export const setCustomerSession = (token, user) => {
  clearLegacyCustomerSession();
  sessionStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  sessionStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
};

export const updateCustomerSessionUser = (user) => {
  sessionStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
};

export const clearCustomerSession = () => {
  sessionStorage.removeItem(CUSTOMER_TOKEN_KEY);
  sessionStorage.removeItem(CUSTOMER_USER_KEY);
  clearLegacyCustomerSession();
};
