import { Package, Receipt, ShoppingBag } from "lucide-react";
import { formatCurrency } from "./customerOrdersUtils";

export default function CustomerOrdersHero({
  firstName,
  loading,
  error,
  orders,
  pendingCount,
  totalSpent,
}) {
  return (
    <div className="bg-[#3b302a] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="mb-1 text-xs uppercase tracking-[0.28em] text-white/50">
          My Account
        </p>
        <h1 className="text-4xl font-light tracking-wide">Hello, {firstName}</h1>
        <p className="mt-2 text-sm text-white/60">
          Here's a summary of your KAMARI orders.
        </p>

        {!loading && !error && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: Receipt, label: "Total Orders", value: orders.length },
              { icon: Package, label: "Pending", value: pendingCount },
              {
                icon: ShoppingBag,
                label: "Total Spent",
                value: formatCurrency(totalSpent),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Icon size={15} className="text-white/70" />
                </div>
                <p className="text-lg font-semibold text-white">{value}</p>
                <p className="mt-0.5 text-xs text-white/50">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
