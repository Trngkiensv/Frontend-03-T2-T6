import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types/product";
import type { CartItem, AppliedCoupon } from "../types/cart";

const STORAGE_KEY = "blackglasses-cart";
const FREE_SHIPPING_THRESHOLD = 1000000;
const BASE_SHIPPING_FEE = 30000;

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  finalTotal: number;
  appliedCoupon: AppliedCoupon | null;
  toastMessage: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const rawShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : BASE_SHIPPING_FEE;
  const isCouponFreeShip = appliedCoupon?.code === "FREESHIP";
  const shippingFee = isCouponFreeShip ? 0 : rawShipping;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === "DISCOUNT10") {
      discountAmount = Math.round(subtotal * 0.1);
    } else if (appliedCoupon.code === "BLACKGLASSES") {
      discountAmount = Math.min(50000, subtotal);
    } else if (appliedCoupon.code === "FREESHIP") {
      discountAmount = 0;
    }
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const applyCoupon = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { success: false, message: "Vui lòng nhập mã giảm giá" };
    }
    if (code === "DISCOUNT10") {
      const disc = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code, label: "Giảm 10% đơn hàng", discount: disc });
      return { success: true, message: "Áp dụng mã giảm 10% thành công!" };
    }
    if (code === "FREESHIP") {
      setAppliedCoupon({ code, label: "Miễn phí vận chuyển", discount: rawShipping });
      return { success: true, message: "Áp dụng miễn phí vận chuyển thành công!" };
    }
    if (code === "BLACKGLASSES") {
      setAppliedCoupon({ code, label: "Giảm 50.000đ", discount: 50000 });
      return { success: true, message: "Áp dụng mã giảm 50.000đ thành công!" };
    }
    return {
      success: false,
      message: "Mã không hợp lệ! Thử: DISCOUNT10, FREESHIP hoặc BLACKGLASSES",
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        subtotal,
        shippingFee,
        discountAmount,
        finalTotal,
        appliedCoupon,
        toastMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        showToast,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được dùng bên trong CartProvider");
  }
  return context;
}
