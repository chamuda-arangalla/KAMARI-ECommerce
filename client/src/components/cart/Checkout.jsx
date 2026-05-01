import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
        <div className="border border-[#3B302A]/10 bg-[#F8F5F2] p-8 rounded-2xl">

          {/* Title */}
          <h2 className="text-sm tracking-[0.2em] text-[#3B302A] uppercase mb-8 font-semibold">
            Order Summary
          </h2>

          {/* Prices */}
          <div className="space-y-4 text-base mb-6">
            <div className="flex justify-between text-[#7D746C]">
              <span>
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <span className="text-[#3B302A]">
                LKR {subtotal.toLocaleString()}
              </span>
            </div>

            {/* Promo Applied */}
            <AnimatePresence>
              {promoApplied && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-[#3B302A] text-[15px]"
                >
                  <span className="flex items-center gap-1.5">
                    <Tag size={12} />
                    <span>KAMARI10 (10% off)</span>
                    <button
                      onClick={onRemovePromo}
                      className="text-[#7D746C] hover:text-[#3B302A] ml-1 transition"
                    >
                      <X size={11} />
                    </button>
                  </span>
                  <span>– LKR {discount.toLocaleString()}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Delivery */}
            <div className="flex justify-between text-[#7D746C]">
              <span>Delivery</span>
              <span className="text-[#3B302A]">
                {freeDelivery ? "Free" : `LKR ${DELIVERY_FEE.toLocaleString()}`}
              </span>
            </div>
          </div>

          <div className="border-t border-[#3B302A]/10 my-6" />

          {/* Total */}
          <div className="flex justify-between items-baseline mb-8">
            <span className="text-base tracking-[0.15em] uppercase text-[#3B302A] font-semibold">
              Total
            </span>
            <div className="text-right">
              <p className="text-2xl font-light text-[#3B302A]">
                LKR {total.toLocaleString()}
              </p>
              <p className="text-sm text-[#7D746C] mt-0.5">
                Incl. taxes
              </p>
            </div>
          </div>

          {/* Promo Input */}
          {!promoApplied && (
            <div className="mb-6">
              <button
                onClick={() => setPromoOpen(!promoOpen)}
                className="flex items-center justify-between w-full text-sm tracking-[0.15em] text-[#7D746C] hover:text-[#3B302A] transition uppercase mb-3"
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
                    <div className="flex border border-[#3B302A]/20">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => onPromoChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onApplyPromo()}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-3 text-base text-[#3B302A] placeholder-[#7D746C] outline-none bg-[#F8F5F2] uppercase"
                      />
                      <button
                        onClick={onApplyPromo}
                        className="px-5 bg-[#E8DED6] text-[#3B302A] text-sm tracking-[0.15em] hover:bg-[#d8c9bd] transition"
                      >
                        APPLY
                      </button>
                    </div>

                    {promoError && (
                      <p className="text-xs text-[#b06a6a] mt-2">
                        {promoError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Checkout Button */}
          <Link to="/checkout">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full rounded-full bg-[#3B302A] text-[#F8F5F2] py-4 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase hover:bg-[#2e2622] transition"
            >
              <span>Checkout</span>
              <ArrowRight size={13} strokeWidth={1.5} />
            </motion.button>
          </Link>

          <p className="text-center text-sm text-[#7D746C] mt-5 tracking-widest uppercase">
            Pay in installments with Koko & Mintpay
          </p>

          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-[#3B302A]/10">
            {["Secure Checkout", "Free Returns", "Authentic"].map((t) => (
              <span
                key={t}
                className="text-xs text-[#7D746C] uppercase text-center"
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