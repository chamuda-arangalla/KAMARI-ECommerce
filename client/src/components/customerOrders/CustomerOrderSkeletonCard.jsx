export default function CustomerOrderSkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#d7c9b8] bg-[#f3ebe2] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-32 rounded-full bg-[#d7c9b8]" />
          <div className="h-3 w-48 rounded-full bg-[#d7c9b8]" />
          <div className="h-3 w-40 rounded-full bg-[#d7c9b8]" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-6 w-20 rounded-full bg-[#d7c9b8]" />
          <div className="h-4 w-24 rounded-full bg-[#d7c9b8]" />
        </div>
      </div>
    </div>
  );
}
