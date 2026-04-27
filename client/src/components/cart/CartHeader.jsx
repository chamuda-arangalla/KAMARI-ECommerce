const FREE_DELIVERY_THRESHOLD = 10000;

export default function CartHeader({ totalItems }) {
  return (
    <>
      <div className="bg-black text-white text-center py-2.5 text-xs tracking-[0.18em] font-medium mt-16">
        FREE DELIVERY ON ORDERS OVER LKR {FREE_DELIVERY_THRESHOLD.toLocaleString()}
      </div>

      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-baseline justify-between">
          <h1 className="text-2xl font-light tracking-[0.12em] text-black uppercase">
            Shopping Bag
          </h1>
          <span className="text-sm text-gray-600 tracking-widest">
            {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </span>
        </div>
      </div>
    </>
  );
}