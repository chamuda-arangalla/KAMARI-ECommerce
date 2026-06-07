import { formatDate } from "./orderDetailsUtils";

export default function OrderHeader({ order, status }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[#8f8376]">
          Order
        </p>
        <h1 className="text-xl font-semibold tracking-wide text-[#2c2b28]">
          {order.orderId}
        </h1>
        <p className="mt-1 text-xs text-[#8f8376]">
          {formatDate(order.createdAt)}
        </p>
      </div>
      <span
        className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide ${status.bg} ${status.text} ${status.border}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </span>
    </div>
  );
}
