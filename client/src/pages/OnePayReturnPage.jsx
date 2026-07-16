import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoadingScreen from "../components/auth/AuthLoadingScreen";
import { verifyOnePayPayment } from "../services/orderApi";
import { getCustomerToken } from "../utils/customerSession";

// Mirrors OAuthCallbackPage's "external redirect returns to our site" pattern.
// Only our own orderId query param is trusted; any other params OnePay appends
// here are ignored — the real payment outcome always comes from the server-side
// verification call, never from the raw redirect URL.
const OnePayReturnPage = () => {
  const navigate = useNavigate();
  const processed = useRef(false);
  const [message, setMessage] = useState("Confirming your OnePay payment...");

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    const token = getCustomerToken();

    if (!orderId || !token) {
      navigate("/orders", { replace: true });
      return;
    }

    verifyOnePayPayment(orderId, token)
      .then(() => {
        navigate(`/orders/${orderId}`, { replace: true });
      })
      .catch(() => {
        setMessage("We couldn't confirm your payment automatically — check your order status below.");
        setTimeout(() => navigate(`/orders/${orderId}`, { replace: true }), 2500);
      });
  }, [navigate]);

  return <AuthLoadingScreen message={message} />;
};

export default OnePayReturnPage;
