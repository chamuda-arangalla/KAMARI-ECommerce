import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";

const FREE_DELIVERY_THRESHOLD = 10000;

export default function CartItems({ items, afterDiscount, onUpdateQty, onRemove }) {
  const freeDelivery = afterDiscount >= FREE_DELIVERY_THRESHOLD;
  const remaining = FREE_DELIVERY_THRESHOLD - afterDiscount;
  const progressPct = Math.min((afterDiscount / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 p-5 bg-gray-50 border border-gray-100"
      >
        <p className="text-xs tracking-[0.16em] text-gray-600 mb-3">
          {freeDelivery
            ? "✓  YOU'VE UNLOCKED FREE DELIVERY"
            : `ADD LKR ${remaining.toLocaleString()} MORE FOR FREE DELIVERY`}
        </p>
        <div className="h-[2px] bg-gray-200 w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full bg-black"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="flex gap-6 py-7 border-b border-gray-100 last:border-b-0"
          >
            <div className="w-[110px] h-[138px] flex-shrink-0 overflow-hidden bg-gray-50">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col justify-between flex-1 py-0.5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium tracking-[0.06em] text-black uppercase mb-1">
                    {item.name}
                  </h3>
                  <div className="flex gap-3 text-xs tracking-[0.12em] text-gray-500 uppercase">
                    <span>{item.variant}</span>
                    <span>·</span>
                    <span>Size {item.size}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-gray-400 hover:text-black transition-colors p-1"
                  aria-label="Remove item"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center border border-gray-200">
                  <button
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={12} strokeWidth={1.5} />
                  </button>
                  <span className="w-9 h-9 flex items-center justify-center text-sm text-black border-x border-gray-200">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={12} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-base font-medium text-black tracking-wide">
                    LKR {(item.price * item.qty).toLocaleString()}
                  </p>
                  {item.qty > 1 && (
                    <p className="text-xs text-gray-500">
                      LKR {item.price.toLocaleString()} each
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="mt-8">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] text-gray-500 hover:text-black transition-colors uppercase"
        >
          ← Continue Shopping
        </a>
      </div>
    </div>
  );
}