import type { Order } from "../types/order";
import { initialOrders } from "../data/initialOrders";

const ORDERS_KEY = "blackglasses-orders";

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return JSON.parse(raw) as Order[];
  } catch {
    return initialOrders;
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export function addOrder(newOrder: Order): void {
  const current = loadOrders();
  const updated = [newOrder, ...current];
  saveOrders(updated);
}
