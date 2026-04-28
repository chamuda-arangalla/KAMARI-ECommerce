import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, ArrowRight } from "lucide-react";

const DELIVERY_FEE = 350;

export default function Checkout({
  subtotal,
  discount,
  deliveryFee,
  total,
  totalItems,
  freeDelivery,
  promoApplied,
  promoCode,
  promoError,
  onPromoChange,
  onApplyPromo,
  onRemovePromo,
}) {
  const [promoOpen, setPromoOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="sticky top-28">
        <div className="border border-gray-100 p-8">
          <h2 className="text-xs tracking-[0.2em] text-black uppercase mb-8 font-semibold">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm mb-6">
            <div className="flex justify-between text-gray-600">
              <span className="tracking-wide">
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <span className="text-black">LKR {subtotal.toLocaleString()}</span>
            </div>

            <AnimatePresence>
              {promoApplied && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-green-600 text-[13px]"
                >
                  <span className="flex items-center gap-1.5">
                    <Tag size={12} />
                    <span>KAMARI10 (10% off)</span>
                    <button
                      onClick={onRemovePromo}
                      className="text-gray-300 hover:text-black ml-1 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </span>
                  <span>– LKR {discount.toLocaleString()}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between text-gray-600">
              <span className="tracking-wide">Delivery</span>
              <span className={freeDelivery ? "text-green-600" : "text-black"}>
                {freeDelivery ? "Free" : `LKR ${DELIVERY_FEE.toLocaleString()}`}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6" />

          <div className="flex justify-between items-baseline mb-8">
            <span className="text-sm tracking-[0.15em] uppercase text-black font-semibold">
              Total
            </span>
            <div className="text-right">
              <p className="text-xl font-light tracking-wide text-black">
                LKR {total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 tracking-wide">Incl. taxes</p>
            </div>
          </div>

          {!promoApplied && (
            <div className="mb-6">
              <button
                onClick={() => setPromoOpen(!promoOpen)}
                className="flex items-center justify-between w-full text-xs tracking-[0.15em] text-gray-600 hover:text-black transition-colors uppercase mb-3"
              >
                <span className="flex items-center gap-2">
                  <Tag size={12} />
                  Promo Code
                </span>
                <span>{promoOpen ? "−" : "+"}</span>
              </button>

              <AnimatePresence>
                {promoOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex border border-gray-200">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => onPromoChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onApplyPromo()}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-3 text-sm tracking-widest text-black placeholder-gray-400 outline-none bg-white uppercase"
                      />
                      <button
                        onClick={onApplyPromo}
                        className="px-5 bg-black text-white text-xs tracking-[0.15em] hover:bg-gray-800 transition-colors"
                      >
                        APPLY
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500 mt-2 tracking-wide">
                        {promoError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-black text-white py-4 flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors"
          >
            <span>Checkout</span>
            <ArrowRight size={13} strokeWidth={1.5} />
          </motion.button>

          <p className="text-center text-xs text-gray-500 mt-5 tracking-widest uppercase">
            Pay in installments with Koko &amp; Mintpay
          </p>

          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
            {["Secure Checkout", "Free Returns", "Authentic"].map((t) => (
              <span
                key={t}
                className="text-[11px] tracking-[0.1em] text-gray-500 uppercase text-center"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}