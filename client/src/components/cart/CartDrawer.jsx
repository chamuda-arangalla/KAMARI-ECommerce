import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "../../styles/cart/CartDrawer.css";

const FREE_DELIVERY_THRESHOLD = 10000;

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    totalItems,
    afterDiscount,
    total,
    freeDelivery,
    deliveryFee,
    handleRemove,
  } = useCart();

  const remaining = FREE_DELIVERY_THRESHOLD - afterDiscount;
  const progressPct = Math.min((afterDiscount / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.38, ease: [0.32, 0, 0.15, 1] }}
            className="cart-drawer fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-[#F8F5F2]"
          >

            <div className="flex items-center justify-between border-b border-[#3B302A]/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-[#3B302A]" />
                <span className="cart-drawer-header-title">Shopping Bag</span>
                {totalItems > 0 && (
                  <span className="cart-drawer-badge">{totalItems}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center text-[#7D746C] transition hover:text-[#3B302A] cursor-pointer"
                aria-label="Close cart"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag size={40} strokeWidth={1} className="mb-4 text-[#3B302A]/20" />
                  <p className="cart-empty-title">Your bag is empty</p>
                  <p className="cart-empty-subtitle">Add something you love.</p>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="cart-empty-btn"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden", marginBottom: 0 }}
                      transition={{ duration: 0.28 }}
                      className="flex gap-4 border-b border-[#3B302A]/10 py-5 last:border-b-0"
                    >

                      <div className="h-[110px] w-[85px] flex-shrink-0 overflow-hidden rounded-lg bg-[#E8DED6]">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-1 flex-col py-0.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="cart-item-name">{item.name}</p>
                            <p className="cart-item-meta">
                              {item.variant} · Size {item.size}
                            </p>
                            <p className="cart-item-price">
                              LKR {(item.price * item.qty).toLocaleString()}
                            </p>
                            {item.qty > 1 && (
                              <p className="cart-item-price-each">
                                Qty {item.qty} · LKR {item.price.toLocaleString()} each
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="ml-2 text-[#7D746C] transition hover:text-[#3B302A] cursor-pointer"
                            aria-label="Remove item"
                          >
                            <X size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#3B302A]/10 bg-[#F8F5F2] px-6 py-5">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="cart-footer-subtotal-label">
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                  <span className="cart-footer-subtotal-value">
                    LKR {total.toLocaleString()}
                  </span>
                </div>
                <p className="cart-footer-delivery-note">
                  {freeDelivery
                    ? "Free delivery included"
                    : `+ LKR ${deliveryFee.toLocaleString()} delivery`}
                </p>

                <div className="cart-footer-actions">
                  <Link
                    to="/cart"
                    onClick={() => setIsDrawerOpen(false)}
                    className="cart-btn-view"
                  >
                    View Full Bag
                  </Link>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="cart-btn-checkout"
                  >
                    <span>Checkout</span>
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
