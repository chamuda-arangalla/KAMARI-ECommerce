export default function OrderDivider({ label }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-[#d7c9b8]" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f8376]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#d7c9b8]" />
    </div>
  );
}
