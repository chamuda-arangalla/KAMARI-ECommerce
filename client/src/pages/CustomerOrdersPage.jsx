import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import CustomerOrdersHero from "../components/customerOrders/CustomerOrdersHero";
import CustomerOrdersList from "../components/customerOrders/CustomerOrdersList";
import { getStoredCustomer } from "../components/customerOrders/customerOrdersUtils";
import { getOrdersByUserId } from "../services/orderApi";
import { getCustomerToken } from "../utils/customerSession";

export default function CustomerOrdersPage() {
  const token = getCustomerToken();
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
    <main className="min-h-screen bg-[#EAE0D6] pb-20 pt-24">
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
