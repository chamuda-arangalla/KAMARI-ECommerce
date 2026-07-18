import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CustomerOrderCard from "../components/customerOrder/CustomerOrderCard";
import OrderDetailsSkeleton from "../components/customerOrder/OrderDetailsSkeleton";
import { getStatus } from "../components/customerOrder/orderDetailsUtils";
import { useCart } from "../context/useCart";
import { getOrderById, uploadPaymentSlip } from "../services/orderApi";
import { getCustomerToken } from "../utils/customerSession";

export default function CustomerOrderDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const token = getCustomerToken();
  const { clearCart } = useCart();
  const clearedKokoCartRef = useRef(false);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [slipUploading, setSlipUploading] = useState(false);
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [slipError, setSlipError] = useState("");
  const slipInputRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    const query = new URLSearchParams(location.search);
    const isSuccessfulKokoReturn =
      (query.get("payment") === "koko" ||
        (query.has("trnId") && query.has("orderId"))) &&
      query.get("status")?.toUpperCase() === "SUCCESS";

    const loadOrder = async () => {
      setLoading(true);
      setError("");

      for (let attempt = 0; attempt < 6 && !cancelled; attempt += 1) {
        try {
          const res = await getOrderById(id, token);
          if (!cancelled) setOrder(res.data);
          break;
        } catch (err) {
          const shouldRetry =
            isSuccessfulKokoReturn &&
            err.response?.status === 404 &&
            attempt < 5;

          if (!shouldRetry) {
            if (!cancelled) {
              setError(err.response?.data?.message || "Failed to load order");
            }
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }

      if (!cancelled) setLoading(false);
    };

    loadOrder();
    return () => {
      cancelled = true;
    };
  }, [id, location.search, token]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    const isKokoReturn =
      query.get("payment") === "koko" ||
      (query.has("trnId") && query.has("orderId"));
    const isSuccessfulReturn =
      query.get("status")?.toUpperCase() === "SUCCESS";

    if (!clearedKokoCartRef.current && isKokoReturn && isSuccessfulReturn) {
      clearedKokoCartRef.current = true;
      clearCart();
    }
  }, [clearCart, location.search]);

  useEffect(() => {
    return () => {
      if (slipPreview) URL.revokeObjectURL(slipPreview);
    };
  }, [slipPreview]);

  if (!token) return <Navigate to="/login" replace />;

  const handleSlipSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlipFile(file);
    setSlipPreview(URL.createObjectURL(file));
    setSlipUploaded(false);
    setSlipError("");
  };

  const handleSlipUpload = async () => {
    if (!slipFile || !order) return;

    setSlipUploading(true);
    setSlipError("");

    try {
      const res = await uploadPaymentSlip(order._id, slipFile, token);
      setOrder((prev) => ({ ...prev, paymentSlip: res.data }));
      setSlipUploaded(true);
      setSlipFile(null);
      setSlipPreview(null);
    } catch {
      setSlipError("Upload failed. Please try again.");
    } finally {
      setSlipUploading(false);
    }
  };

  const handleSlipRemove = () => {
    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlipFile(null);
    setSlipPreview(null);
    setSlipUploaded(false);
    setSlipError("");
    if (slipInputRef.current) slipInputRef.current.value = "";
  };

  const status = getStatus(order?.paymentStatus);
  const isCodOrder = order?.paymentStatus?.toUpperCase() === "COD";
  const isPaymentComplete = order?.paymentStatus?.toLowerCase() === "complete";

  return (
    <main className="min-h-screen bg-[#EAE0D6] pb-20 pt-24">
      <div className="mx-auto max-w-2xl px-5">
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#8f8376] transition-colors hover:text-[#2c2b28]"
        >
          <ArrowLeft size={15} /> Back to orders
        </Link>

        {loading && <OrderDetailsSkeleton />}

        {!loading && error && (
          <div className="rounded-2xl border border-[#b7aa9a] bg-[#ead9c4] px-5 py-4 text-sm text-[#544c43]">
            {error}
          </div>
        )}

        {!loading && !error && order && (
          <CustomerOrderCard
            order={order}
            status={status}
            isCodOrder={isCodOrder}
            isPaymentComplete={isPaymentComplete}
            slipFile={slipFile}
            slipInputRef={slipInputRef}
            slipPreview={slipPreview}
            slipUploaded={slipUploaded}
            slipUploading={slipUploading}
            slipError={slipError}
            onSlipRemove={handleSlipRemove}
            onSlipSelect={handleSlipSelect}
            onSlipUpload={handleSlipUpload}
          />
        )}
      </div>
    </main>
  );
}
