import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft, CheckCircle2, Loader2, MapPin,
  Package, Phone, Upload, X,
} from "lucide-react";
import { getOrderById, uploadPaymentSlip } from "../services/orderApi";

const formatCurrency = (v) => `LKR ${Number(v || 0).toLocaleString()}`;

const formatDate = (v) =>
  v
    ? new Date(v).toLocaleString("en-LK", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "N/A";

const STATUS_MAP = {
  pending:  { label: "Pending",  dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   bar: "bg-amber-400"   },
  complete: { label: "Complete", dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-400" },
  cod:      { label: "COD",      dot: "bg-sky-400",     text: "text-sky-700",     bg: "bg-sky-50",     border: "border-sky-200",     bar: "bg-sky-400"     },
  paid:     { label: "Paid",     dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-400" },
  failed:   { label: "Failed",   dot: "bg-rose-400",    text: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200",    bar: "bg-rose-400"    },
};
const getStatus = (s = "") => STATUS_MAP[s.toLowerCase()] || STATUS_MAP.pending;

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-[#ede7e0]" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c5bdb6]">{label}</span>
      <div className="h-px flex-1 bg-[#ede7e0]" />
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-[#e5ddd5] bg-white shadow-sm overflow-hidden">
      <div className="h-2 bg-[#ede7e0]" />
      <div className="p-8 space-y-5">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-3 w-20 rounded-full bg-[#ede7e0]" />
            <div className="h-6 w-40 rounded-full bg-[#ede7e0]" />
            <div className="h-3 w-32 rounded-full bg-[#ede7e0]" />
          </div>
          <div className="h-7 w-24 rounded-full bg-[#ede7e0]" />
        </div>
        <div className="h-px bg-[#ede7e0]" />
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-48 rounded-full bg-[#ede7e0]" />
              <div className="h-3 w-32 rounded-full bg-[#ede7e0]" />
            </div>
            <div className="h-4 w-20 rounded-full bg-[#ede7e0]" />
          </div>
        ))}
        <div className="h-px bg-[#ede7e0]" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-24 rounded-full bg-[#ede7e0]" />
              <div className="h-3 w-20 rounded-full bg-[#ede7e0]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CustomerOrderDetailsPage() {
  const { id }  = useParams();
  const token   = localStorage.getItem("customerToken");

  const [order,         setOrder]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [slipFile,      setSlipFile]      = useState(null);
  const [slipPreview,   setSlipPreview]   = useState(null);
  const [slipUploading, setSlipUploading] = useState(false);
  const [slipUploaded,  setSlipUploaded]  = useState(false);
  const [slipError,     setSlipError]     = useState("");
  const slipInputRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id, token);
        setOrder(res.data);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  const handleSlipSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    setSlipFile(null);
    setSlipPreview(null);
    setSlipUploaded(false);
    setSlipError("");
    if (slipInputRef.current) slipInputRef.current.value = "";
  };

  if (!token) return <Navigate to="/login" replace />;

  const st       = getStatus(order?.paymentStatus);
  const isCodOrder = order?.paymentStatus?.toUpperCase() === "COD";
  const isPaymentComplete = order?.paymentStatus?.toLowerCase() === "complete";
  const receiver = order?.receiverDetails;
  const location = receiver?.location;

  return (
    <main
      className="min-h-screen bg-[#F8F5F2] pb-20 pt-24"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl px-5">

        {/* Back link */}
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#7d746c] hover:text-[#3b302a] transition-colors"
        >
          <ArrowLeft size={15} /> Back to orders
        </Link>

        {/* Loading */}
        {loading && <Skeleton />}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-600">
            {error}
          </div>
        )}

        {/* ── Single card ── */}
        {!loading && !error && order && (
          <div className="rounded-3xl border border-[#e5ddd5] bg-white shadow-[0_8px_40px_rgba(59,48,42,0.10)] overflow-hidden">

            {/* Status colour bar */}
            <div className={`h-1.5 w-full ${st.bar}`} />

            <div className="px-7 py-7 space-y-6">

              {/* ── Order header ── */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#a3948b] mb-1">Order</p>
                  <h1 className="text-xl font-semibold text-[#3b302a] tracking-wide">{order.orderId}</h1>
                  <p className="mt-1 text-xs text-[#a3948b]">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide flex-shrink-0 ${st.bg} ${st.text} ${st.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>

              <Divider label="Items" />

              {/* ── Products ── */}
              <div className="space-y-4">
                {order.productDetails?.map((item, i) => (
                  <div
                    key={`${item.productId}-${item.colour}-${item.size}-${i}`}
                    className="flex items-start gap-4"
                  >
                    {/* Index circle */}
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f5f2] border border-[#e5ddd5] text-xs font-semibold text-[#7d746c]">
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#3b302a] leading-snug">{item.productName}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {[item.colour, `Size ${item.size}`, `Qty ${item.quantity}`].map((tag) => (
                          <span key={tag} className="rounded-full bg-[#f8f5f2] border border-[#e5ddd5] px-2.5 py-0.5 text-[11px] text-[#6b5e55]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-semibold text-[#3b302a]">
                        {formatCurrency(Number(item.unitPrice) * Number(item.quantity))}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#a3948b]">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Divider label="Pricing" />

              {/* ── Pricing ── */}
              <div className="space-y-2.5">
                {[
                  { label: "Subtotal",  value: formatCurrency(order.pricing?.subTotal) },
                  { label: "Delivery",  value: formatCurrency(order.pricing?.shippingFee) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[#7d746c]">{label}</span>
                    <span className="font-medium text-[#3b302a]">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-[#ede7e0]">
                  <span className="text-sm font-semibold text-[#3b302a]">Total</span>
                  <span className="text-lg font-semibold text-[#3b302a]">
                    {formatCurrency(order.pricing?.grandTotal)}
                  </span>
                </div>
              </div>

              <Divider label="Delivery" />

              {/* ── Receiver ── */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f5f2] border border-[#e5ddd5]">
                    <Package size={13} className="text-[#7d746c]" />
                  </div>
                  <p className="text-sm font-semibold text-[#3b302a] pt-0.5">
                    {receiver?.firstName} {receiver?.lastName}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f5f2] border border-[#e5ddd5]">
                    <MapPin size={13} className="text-[#7d746c]" />
                  </div>
                  <p className="text-sm text-[#6b5e55] leading-6">
                    {location?.address}<br />
                    {[location?.district, location?.province].filter(Boolean).join(", ")}<br />
                    {[location?.postalCode, location?.country].filter(Boolean).join(", ")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f5f2] border border-[#e5ddd5]">
                    <Phone size={13} className="text-[#7d746c]" />
                  </div>
                  <div className="text-sm text-[#6b5e55]">
                    <p>{receiver?.phoneNumber}</p>
                    {receiver?.secondaryPhoneNumber && <p>{receiver.secondaryPhoneNumber}</p>}
                  </div>
                </div>
              </div>

              <Divider label={isCodOrder ? "Payment" : "Payment Slip"} />

              {/* ── Payment slip ── */}
              {isCodOrder ? (
                <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                  This order is Cash on Delivery. Please pay when your order arrives.
                </div>
              ) : (
              <div>
                {/* Success */}
                {slipUploaded && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={15} className="flex-shrink-0" />
                    Payment slip uploaded successfully!
                  </div>
                )}

                {isPaymentComplete && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={15} className="flex-shrink-0" />
                    Payment verified.
                  </div>
                )}

                {/* Existing slip */}
                {order.paymentSlip?.url && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        {isPaymentComplete ? "" : "Slip uploaded"}
                      </span>
                      {!isPaymentComplete && (
                        <button
                          type="button"
                          onClick={() => slipInputRef.current?.click()}
                          className="text-xs text-[#a3948b] underline underline-offset-2 hover:text-[#3b302a] transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit"
                        >
                          Replace
                        </button>
                      )}
                    </div>
                    <a href={order.paymentSlip.url} target="_blank" rel="noopener noreferrer"
                      className="block overflow-hidden rounded-xl border border-[#e5ddd5]">
                      <img src={order.paymentSlip.url} alt="Payment slip"
                        className="w-full max-h-52 object-contain bg-[#f8f5f2]" />
                    </a>
                  </div>
                )}

                {/* Preview */}
                {slipPreview && (
                  <div className="mb-4">
                    <img src={slipPreview} alt="Preview"
                      className="w-full max-h-48 object-contain rounded-xl border border-[#e5ddd5] bg-[#f8f5f2]" />
                    <button type="button" onClick={handleSlipRemove}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-[#a3948b] hover:text-rose-600 transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit">
                      <X size={11} /> Remove
                    </button>
                  </div>
                )}

                {/* Drop zone */}
                {!slipPreview && !isPaymentComplete && (
                  <button
                    type="button"
                    onClick={() => slipInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 py-7 border-2 border-dashed border-[#ddd8d2] rounded-2xl bg-[#fdfcfb] hover:border-[#3b302a] hover:bg-[#faf8f6] transition-all cursor-pointer font-inherit"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0ebe5] border border-[#e5ddd5]">
                      <Upload size={18} className="text-[#a3948b]" />
                    </div>
                    <span className="text-sm font-medium text-[#3b302a]">
                      {order.paymentSlip?.url ? "Upload new slip" : "Upload payment slip"}
                    </span>
                    <span className="text-xs text-[#a3948b]">JPG, PNG or WEBP · Max 5MB</span>
                  </button>
                )}

                {!isPaymentComplete && (
                  <input ref={slipInputRef} type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden" onChange={handleSlipSelect} />
                )}

                {slipError && (
                  <p className="mt-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-xs text-rose-600">
                    {slipError}
                  </p>
                )}

                {slipFile && !slipUploaded && !isPaymentComplete && (
                  <button
                    type="button"
                    onClick={handleSlipUpload}
                    disabled={slipUploading}
                    className="mt-4 w-full rounded-xl bg-[#3b302a] py-3.5 text-sm font-semibold text-white hover:bg-[#2e2622] disabled:opacity-60 transition-all"
                  >
                    {slipUploading ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 size={14} className="animate-spin" /> Uploading...
                      </span>
                    ) : "Submit Payment Slip"}
                  </button>
                )}
              </div>
              )}

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
