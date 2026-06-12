const FREE_DELIVERY_THRESHOLD = 10000;

export default function CartHeader({ totalItems }) {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#2C2B28] text-[#EAE0D6] text-center py-2.5 text-sm tracking-[0.18em] font-medium mt-16">
        FREE DELIVERY ON ORDERS OVER LKR {FREE_DELIVERY_THRESHOLD.toLocaleString()}
      </div>

      {/* Header Section */}
      <div className="border-b border-[#2C2B28]/10 bg-[#EAE0D6]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-baseline justify-between">

          <h1 className="text-3xl text-[#2C2B28]">
            Shopping Bag
          </h1>

          <span className="text-base text-[#5F564D] tracking-[0.18em]">
            {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </span>

        </div>
      </div>
    </>
  );
}