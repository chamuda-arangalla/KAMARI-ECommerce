import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import { verifyKokoPayment } from "../services/orderApi";
import { getCustomerToken } from "../utils/customerSession";

export default function KokoReturnPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = getCustomerToken();
  const { clearCart } = useCart();
  const wasCancelled = searchParams.get("cancelled") === "true";
  const verificationStarted = useRef(false);
  const [message, setMessage] = useState(
    wasCancelled
      ? "Koko payment was cancelled."
      : "Verifying your Koko payment...",
  );
  const [failed, setFailed] = useState(wasCancelled);

  useEffect(() => {
    if (!token || !orderId || wasCancelled || verificationStarted.current) return;
    verificationStarted.current = true;

    verifyKokoPayment(orderId, token)
      .then((response) => {
        if (response.status !== "success" || !response.data?.orderId) {
          setFailed(true);
          setMessage(
            response.status === "pending"
              ? "Koko has not confirmed this payment yet."
              : "Koko payment was not successful.",
          );
          return;
        }

        clearCart();
        navigate(`/orders/${encodeURIComponent(response.data.orderId)}`, {
          replace: true,
        });
      })
      .catch((error) => {
        setFailed(true);
        setMessage(
          error.response?.data?.message || "Unable to verify Koko payment.",
        );
      });
  }, [clearCart, navigate, orderId, token, wasCancelled]);

  if (!token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(`/payments/koko/return/${orderId}`)}`}
        replace
      />
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EAE0D6] px-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[#2c2b28]">
          {failed ? "Payment not completed" : "Confirming payment"}
        </h1>
        <p className="mt-3 text-[#8f8376]">{message}</p>
        {failed && (
          <Link
            to="/checkout"
            className="mt-6 inline-flex rounded-xl bg-[#2c2b28] px-6 py-3 font-medium text-white"
          >
            Return to checkout
          </Link>
        )}
      </div>
    </main>
  );
}
