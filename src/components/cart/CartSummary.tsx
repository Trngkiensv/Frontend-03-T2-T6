import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";

const FREE_SHIPPING_THRESHOLD = 1000000;
const SHIPPING_FEE = 30000;

export default function CartSummary() {
  const { subtotal, totalQuantity } = useCart();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

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
          <dd>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</dd>
        </div>
        <div className="cart-summary__total">
          <dt>Tổng cộng</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      <div className="cart-summary__coupon">
        <input
          id="coupon-input"
          type="text"
          placeholder="Mã giảm giá"
          aria-label="Mã giảm giá"
        />
        <button id="coupon-apply" type="button">
          Áp dụng
        </button>
      </div>

      <button id="checkout-button" type="button" className="cart-summary__checkout">
        Tiến hành thanh toán
      </button>
    </aside>
  );
}
