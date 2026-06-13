import { formatCurrency } from "./orderDetailsUtils";

export default function OrderPricingSection({ pricing }) {
  return (
    <div className="space-y-2.5">
      {[
        { label: "Subtotal", value: formatCurrency(pricing?.subTotal) },
        { label: "Delivery", value: formatCurrency(pricing?.shippingFee) },
      ].map(({ label, value }) => (
        <div key={label} className="flex justify-between text-sm">
          <span className="text-[#8f8376]">{label}</span>
          <span className="font-medium text-[#2c2b28]">{value}</span>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-[#d7c9b8] pt-3">
        <span className="text-sm font-semibold text-[#2c2b28]">Total</span>
        <span className="text-lg font-semibold text-[#2c2b28]">
          {formatCurrency(pricing?.grandTotal)}
        </span>
      </div>
    </div>
  );
}
