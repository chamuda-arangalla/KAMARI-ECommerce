import { useEffect, useState } from "react";
import { CartContext } from "./cartContextValue";

// Free delivery is currently disabled.
// const FREE_DELIVERY_THRESHOLD = 10000;
const DELIVERY_FEE = 350;
const CART_STORAGE_KEY = "kamariCartItems";

const getStoredItems = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(getStoredItems);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

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

  const handleAddItem = (item) => {
    const quantity = Number(item.qty || 1);

    setItems((prev) => {
      const existingItem = prev.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.variant === item.variant &&
          cartItem.size === item.size,
      );

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.variant === item.variant &&
          cartItem.size === item.size
            ? { ...cartItem, qty: cartItem.qty + quantity }
            : cartItem,
        );
      }

      return [...prev, { ...item, qty: quantity }];
    });

    setIsDrawerOpen(true);
  };

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

  const clearCart = () => {
    setItems([]);
    handleRemovePromo();
    setIsDrawerOpen(false);
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const afterDiscount = subtotal - discount;
  // const freeDelivery = afterDiscount >= FREE_DELIVERY_THRESHOLD;
  // const deliveryFee = items.length === 0 || freeDelivery ? 0 : DELIVERY_FEE;
  const deliveryFee = items.length === 0 ? 0 : DELIVERY_FEE;
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
        // freeDelivery,
        deliveryFee,
        total,
        handleUpdateQty,
        handleAddItem,
        handleRemove,
        handlePromoChange,
        handleApplyPromo,
        handleRemovePromo,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
