import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";

const FREE_SHIPPING_THRESHOLD = 1000000;

export default function CartSummary() {
  const navigate = useNavigate();
  const {
    subtotal,
    totalQuantity,
    shippingFee,
    discountAmount,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMessage({ type: "success", text: res.message });
      setCouponInput("");
    } else {
      setCouponMessage({ type: "error", text: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage(null);
  };

  return (
    <aside className="cart-summary">
      <h2 className="cart-summary__title">Tóm tắt đơn hàng</h2>

      <div className="cart-summary__shipping">
        {remaining > 0 ? (
          <p>
            Mua thêm <strong>{formatPrice(remaining)}</strong> để được miễn phí
            vận chuyển
          </p>
        ) : (
          <p>🎉 Bạn được miễn phí vận chuyển!</p>
        )}
        <div className="cart-summary__progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <dl className="cart-summary__rows">
        <div>
          <dt>Tạm tính ({totalQuantity} sản phẩm)</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Phí vận chuyển</dt>
          <dd>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</dd>
        </div>

        {appliedCoupon && (
          <div className="cart-summary__discount-row">
            <dt>
              Giảm giá ({appliedCoupon.code})
              <button
                type="button"
                className="cart-summary__coupon-remove"
                onClick={handleRemoveCoupon}
                title="Hủy mã giảm giá"
              >
                ✕
              </button>
            </dt>
            <dd>
              {appliedCoupon.code === "FREESHIP"
                ? "Freeship"
                : `-${formatPrice(discountAmount)}`}
            </dd>
          </div>
        )}

        <div className="cart-summary__total">
          <dt>Tổng cộng</dt>
          <dd>{formatPrice(finalTotal)}</dd>
        </div>
      </dl>

      <form className="cart-summary__coupon" onSubmit={handleApplyCoupon}>
        <input
          id="coupon-input"
          type="text"
          placeholder="Mã giảm giá (VD: DISCOUNT10)"
          aria-label="Mã giảm giá"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
        />
        <button id="coupon-apply" type="submit">
          Áp dụng
        </button>
      </form>

      {couponMessage && (
        <p
          className={`cart-summary__msg ${
            couponMessage.type === "success"
              ? "cart-summary__msg--success"
              : "cart-summary__msg--error"
          }`}
        >
          {couponMessage.text}
        </p>
      )}

      <p className="cart-summary__hint">
        Gợi ý: <code>DISCOUNT10</code> (-10%), <code>FREESHIP</code>, <code>BLACKGLASSES</code> (-50k)
      </p>

      <button
        id="checkout-button"
        type="button"
        className="cart-summary__checkout"
        onClick={() => navigate("/checkout")}
      >
        Tiến hành thanh toán
      </button>
    </aside>
  );
}
