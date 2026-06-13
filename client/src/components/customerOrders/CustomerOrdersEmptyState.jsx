import { Link } from "react-router-dom";
import { ArrowRight, PackageSearch } from "lucide-react";

export default function CustomerOrdersEmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-[#d7c9b8] bg-[#f3ebe2] py-20 text-center shadow-sm">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#d7c9b8] bg-[#ead9c4]">
        <PackageSearch size={36} className="text-[#8f8376]" strokeWidth={1.4} />
      </div>
      <h3 className="text-xl text-[#2c2b28]">
        No orders yet
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#8f8376]">
        When you place your first order it will appear here.
      </p>
      <Link
        to="/shop"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2c2b28] px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f3ebe2] transition-colors hover:bg-[#544c43]"
      >
        Start Shopping <ArrowRight size={14} />
      </Link>
    </div>
  );
}
