export default function OrderDivider({ label }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-[#ede7e0]" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c5bdb6]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#ede7e0]" />
    </div>
  );
}
