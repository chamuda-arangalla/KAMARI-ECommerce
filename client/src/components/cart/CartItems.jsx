import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

/*
Free delivery progress is currently disabled.

const FREE_DELIVERY_THRESHOLD = 10000;
const freeDelivery = afterDiscount >= FREE_DELIVERY_THRESHOLD;
const remaining = FREE_DELIVERY_THRESHOLD - afterDiscount;
const progressPct = Math.min(
  (afterDiscount / FREE_DELIVERY_THRESHOLD) * 100,
  100,
);

Messages:
- "YOU'VE UNLOCKED FREE DELIVERY"
- `ADD Rs ${remaining.toLocaleString()} MORE FOR FREE DELIVERY`
*/

export default function CartItems({ items, onUpdateQty, onRemove }) {
  return (
    <div>
      {/* Items */}
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="flex gap-6 py-7 border-b border-[#2C2B28]/10 last:border-b-0"
          >
            {/* Image */}
            <div className="h-[110px] w-[110px] flex-shrink-0 overflow-hidden rounded-lg bg-[#E8DED6]">
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
                  <h3 className="text-xl font-medium tracking-[0.06em] text-[#2C2B28] capitalize mb-1">
                    {item.name}
                  </h3>
                  <div className="flex gap-3 text-base tracking-[0.12em] text-[#5F564D] capitalize">
                    <span>{item.variant}</span>
                    <span>·</span>
                    <span>Size {item.size}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-[#5F564D] hover:text-[#2C2B28] transition p-1"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                {/* Qty Controls */}
                <div className="flex items-center border border-[#2C2B28]/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-11 h-11 flex items-center justify-center text-[#5F564D] hover:text-[#2C2B28] hover:bg-[#E8DED6] transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-11 h-11 flex items-center justify-center text-base text-[#2C2B28] border-x border-[#2C2B28]/20">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-11 h-11 flex items-center justify-center text-[#5F564D] hover:text-[#2C2B28] hover:bg-[#E8DED6] transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-xl font-medium text-[#2C2B28] tracking-wide">
                    Rs {(item.price * item.qty).toLocaleString()}
                  </p>
                  {item.qty > 1 && (
                    <p className="text-base text-[#5F564D]">
                      Rs {item.price.toLocaleString()} each
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
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-base tracking-[0.15em] text-[#5F564D] hover:text-[#2C2B28] transition"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
