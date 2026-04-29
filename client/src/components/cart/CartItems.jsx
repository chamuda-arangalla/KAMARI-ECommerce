import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";

const FREE_DELIVERY_THRESHOLD = 10000;

export default function CartItems({ items, afterDiscount, onUpdateQty, onRemove }) {
  const freeDelivery = afterDiscount >= FREE_DELIVERY_THRESHOLD;
  const remaining = FREE_DELIVERY_THRESHOLD - afterDiscount;
  const progressPct = Math.min((afterDiscount / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <div>
      {/* Free Delivery Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 p-5 bg-[#F8F5F2] border border-[#3B302A]/10 rounded-xl"
      >
        <p className="text-xs tracking-[0.16em] text-[#7D746C] mb-3">
          {freeDelivery
            ? "✓ YOU'VE UNLOCKED FREE DELIVERY"
            : `ADD LKR ${remaining.toLocaleString()} MORE FOR FREE DELIVERY`}
        </p>

        <div className="h-[2px] bg-[#3B302A]/10 w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full bg-[#3B302A]"
          />
        </div>
      </motion.div>

      {/* Items */}
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="flex gap-6 py-7 border-b border-[#3B302A]/10 last:border-b-0"
          >
            {/* Image */}
            <div className="w-[110px] h-[138px] flex-shrink-0 overflow-hidden bg-[#E8DED6] rounded-lg">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between flex-1 py-0.5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium tracking-[0.06em] text-[#3B302A] uppercase mb-1">
                    {item.name}
                  </h3>

                  <div className="flex gap-3 text-xs tracking-[0.12em] text-[#7D746C] uppercase">
                    <span>{item.variant}</span>
                    <span>·</span>
                    <span>Size {item.size}</span>
                  </div>
                </div>

                <button
                  onClick={() => onRemove(item.id)}
                  className="text-[#7D746C] hover:text-[#3B302A] transition p-1"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                {/* Qty Controls */}
                <div className="flex items-center border border-[#3B302A]/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-9 h-9 flex items-center justify-center text-[#7D746C] hover:text-[#3B302A] hover:bg-[#E8DED6] transition"
                  >
                    <Minus size={12} />
                  </button>

                  <span className="w-9 h-9 flex items-center justify-center text-sm text-[#3B302A] border-x border-[#3B302A]/20">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-9 h-9 flex items-center justify-center text-[#7D746C] hover:text-[#3B302A] hover:bg-[#E8DED6] transition"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-base font-medium text-[#3B302A] tracking-wide">
                    LKR {(item.price * item.qty).toLocaleString()}
                  </p>

                  {item.qty > 1 && (
                    <p className="text-xs text-[#7D746C]">
                      LKR {item.price.toLocaleString()} each
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Continue Shopping */}
      <div className="mt-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] text-[#7D746C] hover:text-[#3B302A] transition uppercase"
        >
          ← Continue Shopping
        </a>
      </div>
    </div>
  );
}