import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoadingScreen from "../components/auth/AuthLoadingScreen";
import { verifyOnePayPayment } from "../services/orderApi";
import { getCustomerToken } from "../utils/customerSession";

// Mirrors OAuthCallbackPage's "external redirect returns to our site" pattern.
// Only our own reference query param is trusted; any other params OnePay appends
// here are ignored — the real payment outcome always comes from the server-side
// verification call, never from the raw redirect URL. No order exists until this
// verification confirms success, so a failed/still-pending payment has nowhere to
// navigate to — the customer is sent back to checkout to retry instead.
const OnePayReturnPage = () => {
  const navigate = useNavigate();
  const processed = useRef(false);
  const [message, setMessage] = useState("Confirming your OnePay payment...");

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");
    const token = getCustomerToken();

    if (!reference || !token) {
      navigate("/checkout", { replace: true });
      return;
    }

    verifyOnePayPayment(reference, token)
      .then((response) => {
        const result = response?.data || {};

        if (result.status === "success" && result.order) {
          navigate(`/orders/${result.order.orderId}`, { replace: true });
        } else {
          setMessage("Your OnePay payment wasn't completed. Redirecting you back to checkout...");
          setTimeout(() => navigate("/checkout", { replace: true }), 2500);
        }
      })
      .catch(() => {
        setMessage("We couldn't confirm your payment automatically. Redirecting you back to checkout...");
        setTimeout(() => navigate("/checkout", { replace: true }), 2500);
      });
  }, [navigate]);

  return <AuthLoadingScreen message={message} />;
};

export default OnePayReturnPage;
