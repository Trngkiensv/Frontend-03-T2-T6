import type { CartItem as CartItemType } from "../../types/cart";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleRemove = () => {
    if (window.confirm(`Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
      removeFromCart(item.id);
    }
  };

  return (
    <article className="cart-item">
      <div className="cart-item__thumb">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="cart-item__info">
        <h2 className="cart-item__name">{item.name}</h2>
        <p className="cart-item__price">{formatPrice(item.price)}</p>
      </div>

      <div className="cart-item__qty" role="group" aria-label="Số lượng">
        <button
          id={`qty-decrease-${item.id}`}
          type="button"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Giảm số lượng"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          max={99}
          className="cart-item__qty-input"
          value={item.quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 1) {
              updateQuantity(item.id, Math.min(99, val));
            }
          }}
          aria-label={`Số lượng của ${item.name}`}
        />
        <button
          id={`qty-increase-${item.id}`}
          type="button"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= 99}
          aria-label="Tăng số lượng"
        >
          +
        </button>
      </div>

      <p className="cart-item__total">
        {formatPrice(item.price * item.quantity)}
      </p>

      <button
        id={`remove-${item.id}`}
        type="button"
        className="cart-item__remove"
        onClick={handleRemove}
        aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
        title="Xóa sản phẩm"
      >
        ✕
      </button>
    </article>
  );
}
