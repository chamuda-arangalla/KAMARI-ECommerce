import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import CustomerOrdersHero from "../components/customerOrders/CustomerOrdersHero";
import CustomerOrdersList from "../components/customerOrders/CustomerOrdersList";
import { getStoredCustomer } from "../components/customerOrders/customerOrdersUtils";
import { getOrdersByUserId } from "../services/orderApi";

export default function CustomerOrdersPage() {
  const token = localStorage.getItem("customerToken");
  const customer = useMemo(() => getStoredCustomer(), []);
  const userId = customer.id || customer._id;
  const firstName = customer.firstName || "there";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !userId) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getOrdersByUserId(userId, token);
        setOrders(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, userId]);

  if (!token) return <Navigate to="/login" replace />;

  const pendingCount = orders.filter(
    (order) => order.paymentStatus?.toLowerCase() === "pending",
  ).length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.pricing?.grandTotal || 0),
    0,
  );

  return (
    <main
      className="min-h-screen bg-[#F8F5F2] pb-20 pt-24"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <CustomerOrdersHero
        firstName={firstName}
        loading={loading}
        error={error}
        orders={orders}
        pendingCount={pendingCount}
        totalSpent={totalSpent}
      />
      <CustomerOrdersList orders={orders} loading={loading} error={error} />
    </main>
  );
}
