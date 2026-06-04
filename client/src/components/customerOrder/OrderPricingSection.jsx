import { formatCurrency } from "./orderDetailsUtils";

export default function OrderPricingSection({ pricing }) {
  return (
    <div className="space-y-2.5">
      {[
        { label: "Subtotal", value: formatCurrency(pricing?.subTotal) },
        { label: "Delivery", value: formatCurrency(pricing?.shippingFee) },
      ].map(({ label, value }) => (
        <div key={label} className="flex justify-between text-sm">
          <span className="text-[#7d746c]">{label}</span>
          <span className="font-medium text-[#3b302a]">{value}</span>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-[#ede7e0] pt-3">
        <span className="text-sm font-semibold text-[#3b302a]">Total</span>
        <span className="text-lg font-semibold text-[#3b302a]">
          {formatCurrency(pricing?.grandTotal)}
        </span>
      </div>
    </div>
  );
}
