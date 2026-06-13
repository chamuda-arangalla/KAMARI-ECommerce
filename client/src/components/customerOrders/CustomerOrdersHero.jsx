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
    <div className="bg-[#2c2b28] px-6 py-10 text-[#f3ebe2]">
      <div className="mx-auto max-w-4xl">
        <p className="mb-1 text-xs uppercase tracking-[0.28em] text-[#ead9c4]/70">
          My Account
        </p>
        <h1 className="text-4xl">Hello, {firstName}</h1>
        <p className="mt-2 text-sm text-[#eae0d6]/75">
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
                className="rounded-2xl border border-[#ead9c4]/20 bg-[#ead9c4]/10 px-5 py-4 backdrop-blur-sm"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#ead9c4]/15">
                  <Icon size={15} className="text-[#ead9c4]/80" />
                </div>
                <p className="text-lg font-semibold text-[#f3ebe2]">{value}</p>
                <p className="mt-0.5 text-xs text-[#eae0d6]/60">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
