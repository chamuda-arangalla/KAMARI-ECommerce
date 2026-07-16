import { useEffect, useRef, useState } from "react";
import { CartContext } from "./cartContextValue";
import { getCustomerUser } from "../utils/customerSession";

// Free delivery is currently disabled.
// const FREE_DELIVERY_THRESHOLD = 10000;
const DELIVERY_FEE = 10;
const LEGACY_CART_STORAGE_KEY = "kamariCartItems";
const GUEST_CART_STORAGE_KEY = "kamariCartItems:guest";

const getCartStorage = (storageKey) =>
  storageKey === GUEST_CART_STORAGE_KEY ? sessionStorage : localStorage;

const getCustomerCartStorageKey = () => {
  try {
    const customer = getCustomerUser();
    const customerId = customer?._id || customer?.id || customer?.email;
    return customerId
      ? `kamariCartItems:customer:${customerId}`
      : GUEST_CART_STORAGE_KEY;
  } catch {
    return GUEST_CART_STORAGE_KEY;
  }
};

const getStoredItems = (storageKey) => {
  try {
    if (storageKey === GUEST_CART_STORAGE_KEY) {
      localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
      localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    }

    const stored = getCartStorage(storageKey).getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const mergeCartItems = (currentItems, incomingItems) => {
  const merged = [...currentItems];

  incomingItems.forEach((item) => {
    const existingIndex = merged.findIndex(
      (current) =>
        current.id === item.id &&
        current.variant === item.variant &&
        current.size === item.size,
    );

    if (existingIndex === -1) {
      merged.push(item);
    } else {
      merged[existingIndex] = {
        ...merged[existingIndex],
        qty: merged[existingIndex].qty + item.qty,
      };
    }
  });

  return merged;
};

export function CartProvider({ children }) {
  const [storageKey, setStorageKey] = useState(getCustomerCartStorageKey);
  const storageKeyRef = useRef(storageKey);
  const [items, setItems] = useState(() => getStoredItems(storageKey));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    storageKeyRef.current = storageKey;
    getCartStorage(storageKey).setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  useEffect(() => {
    const handleUserChange = () => {
      const nextStorageKey = getCustomerCartStorageKey();
      const previousStorageKey = storageKeyRef.current;
      let nextItems = getStoredItems(nextStorageKey);

      if (
        previousStorageKey === GUEST_CART_STORAGE_KEY &&
        nextStorageKey !== GUEST_CART_STORAGE_KEY
      ) {
        nextItems = mergeCartItems(nextItems, getStoredItems(GUEST_CART_STORAGE_KEY));
        sessionStorage.removeItem(GUEST_CART_STORAGE_KEY);
      }

      storageKeyRef.current = nextStorageKey;
      setStorageKey(nextStorageKey);
      setItems(nextItems);
      setPromoApplied(false);
      setPromoCode("");
      setPromoError("");
      setIsDrawerOpen(false);
    };

    window.addEventListener("kamari:user-updated", handleUserChange);
    return () => window.removeEventListener("kamari:user-updated", handleUserChange);
  }, []);

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
    getCartStorage(storageKeyRef.current).removeItem(storageKeyRef.current);
    setItems([]);
    handleRemovePromo();
    setIsDrawerOpen(false);
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const afterDiscount = subtotal - discount;
  // const freeDelivery = afterDiscount >= FREE_DELIVERY_THRESHOLD;
  // const deliveryFee for the Total value >= LKR 10,000;
  let deliveryFee;
  if ( afterDiscount >= 10000){
    deliveryFee = 0;
  }
  else{
    deliveryFee = items.length === 0 ? 0 : DELIVERY_FEE;
  }

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
