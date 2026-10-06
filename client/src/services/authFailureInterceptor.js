import axios from "axios";
import {
  clearCustomerSession,
  getCustomerToken,
} from "../utils/customerSession";

let redirectInProgress = false;

const getAuthorizationHeader = (headers) =>
  headers?.get?.("Authorization") ||
  headers?.Authorization ||
  headers?.authorization ||
  "";

const getBearerToken = (headers) => {
  const authorization = String(getAuthorizationHeader(headers));
  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
};

const getCurrentRelativeUrl = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

const redirectToAdminLogin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");

  if (redirectInProgress || window.location.pathname === "/admin/login") return;
  redirectInProgress = true;
  window.location.replace("/admin/login?session=expired");
};

const redirectToCustomerLogin = () => {
  const returnUrl = getCurrentRelativeUrl();
  clearCustomerSession();
  window.dispatchEvent(new Event("kamari:user-updated"));

  if (redirectInProgress || window.location.pathname === "/login") return;
  redirectInProgress = true;
  window.location.replace(
    `/login?session=expired&redirect=${encodeURIComponent(returnUrl)}`,
  );
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const rejectedToken = getBearerToken(error.config?.headers);
    if (!rejectedToken) {
      // Login failures are also 401 responses, but they do not carry a bearer
      // token and must remain visible as ordinary invalid-credential errors.
      return Promise.reject(error);
    }

    const adminToken = localStorage.getItem("adminToken");
    const customerToken = getCustomerToken();

    if (adminToken && rejectedToken === adminToken) {
      redirectToAdminLogin();
    } else if (customerToken && rejectedToken === customerToken) {
      redirectToCustomerLogin();
    }

    return Promise.reject(error);
  },
);
