import { Link } from "react-router-dom";
import { ArrowRight, PackageSearch } from "lucide-react";

export default function CustomerOrdersEmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-[#e5ddd5] bg-white py-20 text-center shadow-sm">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#e5ddd5] bg-[#f8f5f2]">
        <PackageSearch size={36} className="text-[#c5bdb6]" strokeWidth={1.4} />
      </div>
      <h3 className="text-xl font-light tracking-wide text-[#3b302a]">
        No orders yet
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#a3948b]">
        When you place your first order it will appear here.
      </p>
      <Link
        to="/shop"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#3b302a] px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#2e2622]"
      >
        Start Shopping <ArrowRight size={14} />
      </Link>
    </div>
  );
}
