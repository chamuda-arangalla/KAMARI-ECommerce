import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, Package, PackageSearch, Receipt, ShoppingBag } from "lucide-react";
import { getOrdersByUserId } from "../services/orderApi";

const getStoredCustomer = () => JSON.parse(localStorage.getItem("customerUser") || "{}");

const formatCurrency = (v) => `LKR ${Number(v || 0).toLocaleString()}`;

const formatDate = (v) =>
  v ? new Date(v).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" }) : "—";

const STATUS_MAP = {
  pending:  { label: "Pending",   bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400"   },
  complete: { label: "Complete",  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  cod:      { label: "COD",       bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",     dot: "bg-sky-400"     },
  paid:     { label: "Paid",      bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  failed:   { label: "Failed",    bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    dot: "bg-rose-400"    },
};

const getStatus = (s = "") => STATUS_MAP[s.toLowerCase()] || STATUS_MAP.pending;

function StatusBadge({ status }) {
  const s = getStatus(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${s.bg} ${s.text} ${s.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e5ddd5] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-32 rounded-full bg-[#ede7e0]" />
          <div className="h-3 w-48 rounded-full bg-[#ede7e0]" />
          <div className="h-3 w-40 rounded-full bg-[#ede7e0]" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-6 w-20 rounded-full bg-[#ede7e0]" />
          <div className="h-4 w-24 rounded-full bg-[#ede7e0]" />
        </div>
      </div>
    </div>
  );
}

export default function CustomerOrdersPage() {
  const token    = localStorage.getItem("customerToken");
  const customer = useMemo(() => getStoredCustomer(), []);
  const userId   = customer.id || customer._id;
  const firstName = customer.firstName || "there";

  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!token || !userId) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getOrdersByUserId(userId, token);
        setOrders(res.data || []);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, userId]);

  if (!token) return <Navigate to="/login" replace />;

  const pendingCount  = orders.filter((o) => o.paymentStatus?.toLowerCase() === "pending").length;
  const totalSpent    = orders.reduce((s, o) => s + Number(o.pricing?.grandTotal || 0), 0);

  return (
    <main
      className="min-h-screen bg-[#F8F5F2] pb-20 pt-24"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* ── Hero banner ── */}
      <div className="bg-[#3b302a] px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-1 text-xs uppercase tracking-[0.28em] text-white/50">My Account</p>
          <h1 className="text-4xl font-light tracking-wide">
            Hello, {firstName} 👋
          </h1>
          <p className="mt-2 text-sm text-white/60">Here's a summary of your KAMARI orders.</p>

          {/* Stats row */}
          {!loading && !error && (
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Receipt,     label: "Total Orders",   value: orders.length },
                { icon: Package,     label: "Pending",        value: pendingCount   },
                { icon: ShoppingBag, label: "Total Spent",    value: formatCurrency(totalSpent) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <Icon size={15} className="text-white/70" />
                  </div>
                  <p className="text-lg font-semibold text-white">{value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Orders list ── */}
      <div className="mx-auto max-w-4xl px-6 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7d746c]">
            Order History
          </h2>
          {orders.length > 0 && (
            <span className="rounded-full bg-[#3b302a] px-3 py-1 text-xs text-white">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-600">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl border border-[#e5ddd5] bg-white py-20 text-center shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f5f2] border border-[#e5ddd5]">
              <PackageSearch size={36} className="text-[#c5bdb6]" strokeWidth={1.4} />
            </div>
            <h3 className="text-xl font-light text-[#3b302a] tracking-wide">No orders yet</h3>
            <p className="mt-2 max-w-xs text-sm text-[#a3948b] leading-relaxed">
              When you place your first order it will appear here.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#3b302a] px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#2e2622] transition-colors"
            >
              Start Shopping <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Order cards */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const itemCount  = order.productDetails?.reduce((s, i) => s + Number(i.quantity || 0), 0) || 0;
              const items      = order.productDetails || [];
              const hasSlip    = !!order.paymentSlip?.url;
              const status     = order.paymentStatus || "pending";
              const isCodOrder = status.toUpperCase() === "COD";

              return (
                <Link
                  key={order._id}
                  to={`/orders/${order._id}`}
                  className="group block rounded-2xl border border-[#e5ddd5] bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-[#c5bdb6]"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* Card top bar — status colour strip */}
                  <div className={`h-1 w-full rounded-t-2xl ${getStatus(status).dot}`} />

                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between gap-4">

                      {/* Left */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-semibold text-[#3b302a] tracking-wide">
                            {order.orderId || order._id}
                          </span>
                          <StatusBadge status={status} />
                          {hasSlip && !isCodOrder && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                              ✓ Slip uploaded
                            </span>
                          )}
                          {!hasSlip && !isCodOrder && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-600">
                              Slip pending
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs text-[#a3948b]">
                          {formatDate(order.createdAt)} &nbsp;·&nbsp; {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>

                        {/* Product names */}
                        {items.length > 0 && (
                          <p className="mt-2 text-xs text-[#7d746c] truncate max-w-sm leading-5">
                            {items.slice(0, 2).map((i) => i.productName).join(" · ")}
                            {items.length > 2 && ` · +${items.length - 2} more`}
                          </p>
                        )}
                      </div>

                      {/* Right */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="text-base font-semibold text-[#3b302a]">
                          {formatCurrency(order.pricing?.grandTotal)}
                        </p>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8f5f2] text-[#a3948b] transition-all group-hover:bg-[#3b302a] group-hover:text-white">
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
