import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

export default function Checkout() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    shippingFee,
    discountAmount,
    finalTotal,
    appliedCoupon,
    clearCart,
  } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking">("cod");

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");

  if (items.length === 0 && !orderSuccess) {
    return (
      <main className="container py-5 text-center">
        <div className="py-4">
          <div className="fs-1 mb-3">🛍️</div>
          <h2>Chưa có sản phẩm nào để thanh toán</h2>
          <p className="text-muted">
            Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
          </p>
          <Link to="/" className="btn btn-dark mt-2">
            Về trang chủ mua sắm
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!");
      return;
    }

    const orderId = `BG-${Math.floor(100000 + Math.random() * 900000)}`;
    setCreatedOrderId(orderId);
    setOrderSuccess(true);
    clearCart();
  };

  if (orderSuccess) {
    return (
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 text-center">
            <div className="card shadow-sm border-0 p-4 p-md-5 rounded-4">
              <div className="display-4 mb-3">🎉</div>
              <h1 className="h3 fw-bold text-success mb-2">Đặt hàng thành công!</h1>
              <p className="text-muted mb-4">
                Cảm ơn bạn đã mua sắm tại <strong>BLACKGLASSES</strong>. Đơn hàng của bạn đang được xử lý.
              </p>

              <div className="bg-light p-3 rounded-3 text-start mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Mã đơn hàng:</span>
                  <span className="fw-bold">{createdOrderId}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Người nhận:</span>
                  <span className="fw-semibold">{fullName} - {phone}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Địa chỉ nhận hàng:</span>
                  <span className="text-end">{address}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Hình thức thanh toán:</span>
                  <span>{paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản QR ngân hàng"}</span>
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-center">
                <Link to="/" className="btn btn-dark px-4 py-2">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4 text-start">
      <nav aria-label="breadcrumb" className="mb-3 small text-muted">
        <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="text-decoration-none text-muted">Giỏ hàng</Link>
        <span className="mx-2">/</span>
        <span className="text-dark">Thanh toán</span>
      </nav>

      <h1 className="h4 fw-bold mb-4">Thông tin thanh toán</h1>

      <div className="row g-4">
        {/* Form thông tin giao hàng */}
        <div className="col-12 col-lg-7">
          <form className="card border p-4 rounded-4 shadow-sm" onSubmit={handleSubmitOrder}>
            <h2 className="h5 fw-bold mb-3">1. Thông tin người nhận</h2>

            <div className="mb-3">
              <label htmlFor="fullname" className="form-label small fw-semibold">
                Họ và tên <span className="text-danger">*</span>
              </label>
              <input
                id="fullname"
                type="text"
                className="form-control"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label small fw-semibold">
                Số điện thoại <span className="text-danger">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                className="form-control"
                placeholder="0912 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label small fw-semibold">
                Địa chỉ giao hàng <span className="text-danger">*</span>
              </label>
              <textarea
                id="address"
                className="form-control"
                rows={3}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="note" className="form-label small fw-semibold">
                Ghi chú đơn hàng (tùy chọn)
              </label>
              <input
                id="note"
                type="text"
                className="form-control"
                placeholder="Giao giờ hành chính, gọi trước khi giao..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <h2 className="h5 fw-bold mb-3">2. Phương thức thanh toán</h2>
            <div className="d-flex flex-column gap-2 mb-4">
              <label className="border rounded-3 p-3 d-flex align-items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div>
                  <div className="fw-semibold">Thanh toán khi nhận hàng (COD)</div>
                  <small className="text-muted">Nhận hàng kiểm tra rồi mới thanh toán tiền mặt</small>
                </div>
              </label>

              <label className="border rounded-3 p-3 d-flex align-items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "banking"}
                  onChange={() => setPaymentMethod("banking")}
                />
                <div>
                  <div className="fw-semibold">Chuyển khoản QR ngân hàng</div>
                  <small className="text-muted">Quét mã VietQR tiện lợi, xác nhận đơn tự động</small>
                </div>
              </label>
            </div>

            <button type="submit" className="btn btn-dark py-2 rounded-3 fw-bold">
              Xác nhận đặt hàng ({formatPrice(finalTotal)})
            </button>
          </form>
        </div>

        {/* Cột tóm tắt đơn hàng bên phải */}
        <div className="col-12 col-lg-5">
          <div className="card border p-4 rounded-4 shadow-sm bg-light">
            <h2 className="h5 fw-bold mb-3">Đơn hàng của bạn</h2>

            <div className="d-flex flex-column gap-3 mb-3">
              {items.map((item) => (
                <div key={item.id} className="d-flex align-items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded bg-white border"
                    style={{ width: 56, height: 56, objectFit: "contain" }}
                  />
                  <div className="flex-grow-1">
                    <div className="small fw-semibold">{item.name}</div>
                    <small className="text-muted">SL: {item.quantity}</small>
                  </div>
                  <div className="small fw-bold">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Phí vận chuyển:</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
            </div>

            {appliedCoupon && (
              <div className="d-flex justify-content-between mb-2 small text-success">
                <span>Mã giảm giá ({appliedCoupon.code}):</span>
                <span>
                  {appliedCoupon.code === "FREESHIP" ? "Freeship" : `-${formatPrice(discountAmount)}`}
                </span>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between fs-5 fw-bold text-dark">
              <span>Tổng thanh toán:</span>
              <span className="text-danger">{formatPrice(finalTotal)}</span>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mt-3"
              onClick={() => navigate("/cart")}
            >
              ← Quay lại chỉnh sửa giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

