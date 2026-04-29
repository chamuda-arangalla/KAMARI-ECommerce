const FREE_DELIVERY_THRESHOLD = 10000;

export default function CartHeader({ totalItems }) {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#3B302A] text-[#F8F5F2] text-center py-2.5 text-xs tracking-[0.18em] font-medium mt-16">
        FREE DELIVERY ON ORDERS OVER LKR {FREE_DELIVERY_THRESHOLD.toLocaleString()}
      </div>

      {/* Header Section */}
      <div className="border-b border-[#3B302A]/10 bg-[#F8F5F2]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-baseline justify-between">
          
          <h1 className="text-2xl font-light tracking-[0.18em] text-[#3B302A] uppercase">
            Shopping Bag
          </h1>

          <span className="text-sm text-[#7D746C] tracking-[0.18em]">
            {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </span>

        </div>
      </div>
    </>
  );
}