import { useState } from "react";
import { motion } from "framer-motion";
import CartHeader from "../components/cart/CartHeader";
import CartItems from "../components/cart/CartItems";
import Checkout from "../components/cart/Checkout";

const initialItems = [
  {
    id: 1,
    name: "Inndia Corset Top",
    variant: "Ivory",
    size: "S",
    price: 4590,
    qty: 1,
    img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=80",
  },
  {
    id: 2,
    name: "Marbella Midi Dress",
    variant: "Sage",
    size: "M",
    price: 7990,
    qty: 1,
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
  },
  {
    id: 3,
    name: "Sylvia Bodysuit",
    variant: "Black",
    size: "S",
    price: 4590,
    qty: 2,
    img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80",
  },
];

const FREE_DELIVERY_THRESHOLD = 10000;
const DELIVERY_FEE = 350;

export default function Cart() {
  const [items, setItems] = useState(initialItems);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const handleUpdateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemove = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const handlePromoChange = (value) => {
    setPromoCode(value);
    setPromoError("");
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code.");
      return;
    }
    if (promoCode.trim().toUpperCase() === "KAMARI10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("This code is invalid or has expired.");
      setPromoApplied(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoCode("");
    setPromoError("");
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const afterDiscount = subtotal - discount;
  const freeDelivery = afterDiscount >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = freeDelivery ? 0 : DELIVERY_FEE;
  const total = afterDiscount + deliveryFee;

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
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
          <h2 className="text-xl font-light tracking-[0.1em] text-gray-800 mb-3">
            YOUR BAG IS EMPTY
          </h2>
          <p className="text-sm text-gray-400 mb-10 tracking-wide">
            Looks like you haven't added anything yet.
          </p>
          <a
            href="#"
            className="inline-block border border-black px-10 py-3 text-xs tracking-[0.2em] text-black hover:bg-black hover:text-white transition-all duration-200"
          >
            CONTINUE SHOPPING
          </a>
        </motion.div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <CartItems
            items={items}
            afterDiscount={afterDiscount}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
          />

          <Checkout
            subtotal={subtotal}
            discount={discount}
            deliveryFee={deliveryFee}
            total={total}
            totalItems={totalItems}
            freeDelivery={freeDelivery}
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