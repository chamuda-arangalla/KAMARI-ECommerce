import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ChevronRight, Loader2, PackageSearch } from "lucide-react";
import { getOrdersByUserId } from "../services/orderApi";

const getStoredCustomer = () => JSON.parse(localStorage.getItem("customerUser") || "{}");

const formatCurrency = (value) => `LKR ${Number(value || 0).toLocaleString()}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

export default function CustomerOrdersPage() {
  const token = localStorage.getItem("customerToken");
  const customer = useMemo(() => getStoredCustomer(), []);
  const userId = customer.id || customer._id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !userId) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrdersByUserId(userId, token);
        setOrders(response.data || []);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, userId]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <main className="min-h-screen bg-[#F8F5F2] px-4 pb-16 pt-28 font-['Poppins']">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3b302a] text-white">
            <PackageSearch size={24} strokeWidth={1.6} />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-[#3b302a]">My Orders</h1>
            <p className="mt-1 text-sm text-[#a3948b]">View your KAMARI order history</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#e5ddd5] bg-white shadow-[0_20px_60px_rgba(59,48,42,0.10)]">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-[#6b5e55]">
              <Loader2 size={18} className="animate-spin" />
              Loading orders...
            </div>
          ) : error ? (
            <p className="m-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          ) : orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-medium text-[#3b302a]">No orders yet</p>
              <p className="mt-2 text-sm text-[#a3948b]">Your future orders will appear here.</p>
              <Link
                to="/shop"
                className="mt-6 inline-flex rounded-xl bg-[#3b302a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2e2622]"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#eee7df]">
              {orders.map((order) => {
                const itemCount = order.productDetails?.reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0,
                );

                return (
                  <Link
                    key={order._id}
                    to={`/orders/${order._id}`}
                    className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-[#fcfaf7]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#3b302a]">
                        {order.orderId || order._id}
                      </p>
                      <p className="mt-1 text-sm text-[#a3948b]">
                        {formatDate(order.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#3b302a]">
                          {formatCurrency(order.pricing?.grandTotal)}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-[#a3948b]">
                          {order.paymentStatus}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-[#a3948b]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
