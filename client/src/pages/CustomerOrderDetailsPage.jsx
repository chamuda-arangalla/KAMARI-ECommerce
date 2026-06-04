import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CustomerOrderCard from "../components/customerOrder/CustomerOrderCard";
import OrderDetailsSkeleton from "../components/customerOrder/OrderDetailsSkeleton";
import { getStatus } from "../components/customerOrder/orderDetailsUtils";
import { getOrderById, uploadPaymentSlip } from "../services/orderApi";

export default function CustomerOrderDetailsPage() {
  const { id } = useParams();
  const token = localStorage.getItem("customerToken");

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

    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id, token);
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, token]);

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
    <main
      className="min-h-screen bg-[#F8F5F2] pb-20 pt-24"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl px-5">
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#7d746c] transition-colors hover:text-[#3b302a]"
        >
          <ArrowLeft size={15} /> Back to orders
        </Link>

        {loading && <OrderDetailsSkeleton />}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-600">
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
