import type { Order } from "../types/order";
import { products } from "./products";

export const initialOrders: Order[] = [
  {
    id: "BG-849201",
    fullName: "Nguyễn Văn Tuấn",
    phone: "0912 345 678",
    address: "Số 12 đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    note: "Giao trong giờ hành chính",
    paymentMethod: "cod",
    items: [
      { ...products[0], quantity: 1 },
      { ...products[2], quantity: 1 },
    ],
    subtotal: 1040000,
    shippingFee: 0,
    discountAmount: 104000,
    finalTotal: 936000,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 phút trước
  },
  {
    id: "BG-731924",
    fullName: "Trần Thị Mai",
    phone: "0988 765 432",
    address: "Tòa Landmark 81, Bình Thạnh, TP. Hồ Chí Minh",
    note: "Gọi trước khi giao 15 phút",
    paymentMethod: "banking",
    items: [{ ...products[1], quantity: 2 }],
    subtotal: 780000,
    shippingFee: 30000,
    discountAmount: 0,
    finalTotal: 810000,
    status: "shipping",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 giờ trước
  },
  {
    id: "BG-612450",
    fullName: "Lê Hoàng Phúc",
    phone: "0903 112 233",
    address: "45 Hàng Bài, Hoàn Kiếm, Hà Nội",
    paymentMethod: "banking",
    items: [
      { ...products[3], quantity: 1 },
      { ...products[7], quantity: 1 },
    ],
    subtotal: 1140000,
    shippingFee: 0,
    discountAmount: 50000,
    finalTotal: 1090000,
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 ngày trước
  },
  {
    id: "BG-529188",
    fullName: "Phạm Minh Anh",
    phone: "0977 445 566",
    address: "78 Nguyễn Huệ, TP. Huế",
    paymentMethod: "cod",
    items: [{ ...products[4], quantity: 1 }],
    subtotal: 420000,
    shippingFee: 30000,
    discountAmount: 0,
    finalTotal: 450000,
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 ngày trước
  },
  {
    id: "BG-418293",
    fullName: "Đỗ Gia Hưng",
    phone: "0934 998 877",
    address: "102 Trần Phú, Hải Châu, Đà Nẵng",
    note: "Hủy do đặt trùng đơn",
    paymentMethod: "cod",
    items: [{ ...products[5], quantity: 1 }],
    subtotal: 350000,
    shippingFee: 30000,
    discountAmount: 0,
    finalTotal: 380000,
    status: "cancelled",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 ngày trước
  },
];
