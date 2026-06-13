import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import CartHeader from "../components/cart/CartHeader";
import CartItems from "../components/cart/CartItems";
import Checkout from "../components/cart/Checkout";

export default function Cart() {
  const {
    items,
    totalItems,
    subtotal,
    discount,
    // afterDiscount,
    // freeDelivery,
    deliveryFee,
    total,
    promoCode,
    promoApplied,
    promoError,
    handleUpdateQty,
    handleRemove,
    handlePromoChange,
    handleApplyPromo,
    handleRemovePromo,
  } = useCart();

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--kamari-font-body)" }}
    >
      <CartHeader totalItems={totalItems} />

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto px-6 py-32 text-center"
        >
          <p className="text-6xl mb-8 text-gray-200">○</p>
          <h2 className="text-2xl text-gray-800 mb-3">
            YOUR BAG IS EMPTY
          </h2>
          <p className="text-base text-gray-400 mb-10 tracking-wide">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/"
            className="inline-block rounded-full bg-[#E8DED6] px-10 py-3 text-sm uppercase tracking-[0.18em] text-[#2C2B28] transition hover:bg-[#d8c9bd]"
          >
            CONTINUE SHOPPING
          </Link>
        </motion.div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Free delivery disabled: CartItems previously received afterDiscount. */}
          <CartItems
            items={items}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
          />

          {/* Free delivery disabled: Checkout previously received freeDelivery. */}
          <Checkout
            subtotal={subtotal}
            discount={discount}
            deliveryFee={deliveryFee}
            total={total}
            totalItems={totalItems}
            promoApplied={promoApplied}
            promoCode={promoCode}
            promoError={promoError}
            onPromoChange={handlePromoChange}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
          />
        </div>
      )}
    </div>
  );
}
