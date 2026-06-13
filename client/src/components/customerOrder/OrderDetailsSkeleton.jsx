export default function OrderDetailsSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-[#d7c9b8] bg-[#f3ebe2] shadow-sm">
      <div className="h-2 bg-[#d7c9b8]" />
      <div className="space-y-5 p-8">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-3 w-20 rounded-full bg-[#d7c9b8]" />
            <div className="h-6 w-40 rounded-full bg-[#d7c9b8]" />
            <div className="h-3 w-32 rounded-full bg-[#d7c9b8]" />
          </div>
          <div className="h-7 w-24 rounded-full bg-[#d7c9b8]" />
        </div>
        <div className="h-px bg-[#d7c9b8]" />
        {[1, 2].map((item) => (
          <div key={item} className="flex justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded-full bg-[#d7c9b8]" />
              <div className="h-3 w-32 rounded-full bg-[#d7c9b8]" />
            </div>
            <div className="h-4 w-20 rounded-full bg-[#d7c9b8]" />
          </div>
        ))}
        <div className="h-px bg-[#d7c9b8]" />
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex justify-between">
              <div className="h-3 w-24 rounded-full bg-[#d7c9b8]" />
              <div className="h-3 w-20 rounded-full bg-[#d7c9b8]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
