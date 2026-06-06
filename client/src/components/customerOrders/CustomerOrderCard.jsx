import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import {
  formatCurrency,
  formatDate,
  getStatus,
} from "./customerOrdersUtils";

export default function CustomerOrderCard({ order, index }) {
  const itemCount =
    order.productDetails?.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    ) || 0;
  const items = order.productDetails || [];
  const hasSlip = Boolean(order.paymentSlip?.url);
  const status = order.paymentStatus || "pending";
  const isCodOrder = status.toUpperCase() === "COD";

  return (
    <Link
      to={`/orders/${order._id}`}
      className="group block rounded-2xl border border-[#e5ddd5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c5bdb6] hover:shadow-md"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`h-1 w-full rounded-t-2xl ${getStatus(status).dot}`} />

      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold tracking-wide text-[#3b302a]">
                {order.orderId || order._id}
              </span>
              <OrderStatusBadge status={status} />
              {hasSlip && !isCodOrder && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#d2bba4] bg-[#efe6dc] px-2.5 py-0.5 text-[11px] font-medium text-[#4f3b2d]">
                  Slip uploaded
                </span>
              )}
              {!hasSlip && !isCodOrder && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#dcc8b4] bg-[#f3eadf] px-2.5 py-0.5 text-[11px] font-medium text-[#7a5838]">
                  Slip pending
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-[#a3948b]">
              {formatDate(order.createdAt)} - {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"}
            </p>

            {items.length > 0 && (
              <p className="mt-2 max-w-sm truncate text-xs leading-5 text-[#7d746c]">
                {items.slice(0, 2).map((item) => item.productName).join(" - ")}
                {items.length > 2 && ` - +${items.length - 2} more`}
              </p>
            )}
          </div>

          <div className="flex flex-shrink-0 flex-col items-end gap-2">
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
}
