import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import "./Cart.css";

export default function Cart() {
  const { items, totalQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="cart-page container">
        <section className="cart-empty">
          <div className="cart-empty__icon" aria-hidden="true">🕶️</div>
          <h1>Giỏ hàng của bạn đang trống</h1>
          <p>Hãy chọn cho mình một chiếc kính thật phong cách nhé!</p>
          <Link id="continue-shopping-empty" to="/" className="cart-btn-primary">
            Tiếp tục mua sắm
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page container">
      <nav className="cart-breadcrumb" aria-label="breadcrumb">
        <Link to="/">Trang chủ</Link> <span>/</span> Giỏ hàng
      </nav>

      <header className="cart-header">
        <h1>
          Giỏ hàng <span>({totalQuantity} sản phẩm)</span>
        </h1>
        <button id="clear-cart" type="button" onClick={clearCart}>
          Xóa tất cả
        </button>
      </header>

      <div className="cart-layout">
        <section className="cart-list" aria-label="Danh sách sản phẩm">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <Link id="continue-shopping" to="/" className="cart-back">
            ← Tiếp tục mua sắm
          </Link>
        </section>

        <CartSummary />
      </div>
    </main>
  );
}
