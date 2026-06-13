import CustomerOrderCard from "./CustomerOrderCard";
import CustomerOrdersEmptyState from "./CustomerOrdersEmptyState";
import CustomerOrderSkeletonCard from "./CustomerOrderSkeletonCard";

export default function CustomerOrdersList({ orders, loading, error }) {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8f8376]">
          Order History
        </h2>
        {orders.length > 0 && (
          <span className="rounded-full bg-[#2c2b28] px-3 py-1 text-xs text-[#f3ebe2]">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        )}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <CustomerOrderSkeletonCard key={item} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-[#b7aa9a] bg-[#ead9c4] px-5 py-4 text-sm text-[#544c43]">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && <CustomerOrdersEmptyState />}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <CustomerOrderCard key={order._id} order={order} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
