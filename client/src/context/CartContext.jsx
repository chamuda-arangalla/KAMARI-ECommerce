import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

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

export function CartProvider({ children }) {
  const [items, setItems] = useState(initialItems);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const handleUpdateQty = (id, delta) =>
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );

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
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        setIsDrawerOpen,
        promoCode,
        promoApplied,
        promoError,
        totalItems,
        subtotal,
        discount,
        afterDiscount,
        freeDelivery,
        deliveryFee,
        total,
        handleUpdateQty,
        handleRemove,
        handlePromoChange,
        handleApplyPromo,
        handleRemovePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
