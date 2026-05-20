import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, ReceiptText } from "lucide-react";
import { getOrderById } from "../services/orderApi";

const formatCurrency = (value) => `LKR ${Number(value || 0).toLocaleString()}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

export default function CustomerOrderDetailsPage() {
  const { id } = useParams();
  const token = localStorage.getItem("customerToken");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(id, token);
        setOrder(response.data);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, token]);

  if (!token) return <Navigate to="/login" replace />;

  const receiver = order?.receiverDetails;
  const location = receiver?.location;

  return (
    <main className="min-h-screen bg-[#F8F5F2] px-4 pb-16 pt-28 font-['Poppins']">
      <section className="mx-auto max-w-5xl">
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#6b5e55] hover:text-[#3b302a]"
        >
          <ArrowLeft size={16} />
          Back to orders
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3b302a] text-white">
            <ReceiptText size={24} strokeWidth={1.6} />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-[#3b302a]">
              {order?.orderId || "Order Details"}
            </h1>
            <p className="mt-1 text-sm text-[#a3948b]">
              {order ? formatDate(order.createdAt) : "Review your order"}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e5ddd5] bg-white p-6 shadow-[0_20px_60px_rgba(59,48,42,0.10)] md:p-8">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-[#6b5e55]">
              <Loader2 size={18} className="animate-spin" />
              Loading order...
            </div>
          ) : error ? (
            <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <section>
                <h2 className="border-b border-[#e5ddd5] pb-2 text-xs font-semibold uppercase tracking-wider text-[#a3948b]">
                  Products
                </h2>
                <div className="divide-y divide-[#eee7df]">
                  {order.productDetails?.map((item) => (
                    <div
                      key={`${item.productId}-${item.colour}-${item.size}`}
                      className="flex items-start justify-between gap-4 py-5"
                    >
                      <div>
                        <p className="font-semibold text-[#3b302a]">{item.productName}</p>
                        <p className="mt-1 text-sm text-[#a3948b]">
                          {item.colour} · Size {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold text-[#3b302a]">
                        {formatCurrency(Number(item.unitPrice) * Number(item.quantity))}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="space-y-6">
                <section className="rounded-2xl border border-[#e5ddd5] p-5">
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#a3948b]">
                    Receiver
                  </h2>
                  <p className="font-semibold text-[#3b302a]">
                    {receiver?.firstName} {receiver?.lastName}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6b5e55]">
                    {location?.address}
                    <br />
                    {[location?.district, location?.province].filter(Boolean).join(", ")}
                    <br />
                    {[location?.postalCode, location?.country].filter(Boolean).join(", ")}
                  </p>
                  <p className="mt-3 text-sm text-[#6b5e55]">{receiver?.phoneNumber}</p>
                  {receiver?.secondaryPhoneNumber && (
                    <p className="mt-1 text-sm text-[#6b5e55]">
                      {receiver.secondaryPhoneNumber}
                    </p>
                  )}
                </section>

                <section className="rounded-2xl border border-[#e5ddd5] p-5">
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#a3948b]">
                    Summary
                  </h2>
                  <SummaryRow label="Subtotal" value={formatCurrency(order.pricing?.subTotal)} />
                  <SummaryRow label="Delivery" value={formatCurrency(order.pricing?.shippingFee)} />
                  <div className="my-3 h-px bg-[#e5ddd5]" />
                  <SummaryRow
                    label="Total"
                    value={formatCurrency(order.pricing?.grandTotal)}
                    strong
                  />
                  <p className="mt-4 rounded-full bg-[#f8f5f2] px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-[#6b5e55]">
                    {order.paymentStatus}
                  </p>
                </section>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

const SummaryRow = ({ label, value, strong = false }) => (
  <div className={`mb-2 flex justify-between gap-4 ${strong ? "text-[#3b302a]" : "text-[#6b5e55]"}`}>
    <span className={strong ? "font-semibold" : ""}>{label}</span>
    <span className={strong ? "font-semibold" : "font-medium text-[#3b302a]"}>{value}</span>
  </div>
);
