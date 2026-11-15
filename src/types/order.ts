import type { CartItem } from "./cart";

export type OrderStatus = "pending" | "shipping" | "completed" | "cancelled";

export interface Order {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: "cod" | "banking";
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  finalTotal: number;
  status: OrderStatus;
  createdAt: string;
}
