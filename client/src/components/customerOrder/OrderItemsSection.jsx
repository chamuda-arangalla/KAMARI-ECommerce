import { formatCurrency } from "./orderDetailsUtils";

export default function OrderItemsSection({ items = [] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={`${item.productId}-${item.colour}-${item.size}-${index}`}
          className="flex items-start gap-4"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#d7c9b8] bg-[#ead9c4] text-xs font-semibold text-[#5f564d]">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-[#2c2b28]">
              {item.productName}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {[item.colour, `Size ${item.size}`, `Qty ${item.quantity}`].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#d7c9b8] bg-[#eae0d6] px-2.5 py-0.5 text-[11px] text-[#5f564d]"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-semibold text-[#2c2b28]">
              {formatCurrency(Number(item.unitPrice) * Number(item.quantity))}
            </p>
            <p className="mt-0.5 text-[11px] text-[#8f8376]">
              {formatCurrency(item.unitPrice)} each
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
