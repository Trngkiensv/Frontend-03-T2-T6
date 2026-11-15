import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <main className="container py-5">
        <h1 className="h4 text-body">Không tìm thấy sản phẩm</h1>
        <Link to="/" className="btn btn-dark mt-3">
          Về trang chủ
        </Link>
      </main>
    );
  }
  return (
    <main className="container py-4">
      <nav className="mb-4">
        <Link to="/" className="text-decoration-none">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid w-100 rounded bg-light p-3"
          />
        </div>
        <div className="col-12 col-md-6">
          <h1 className="h3 text-body mt-0 mb-3">
            {product.name}
          </h1>
          <p className="text-body-secondary mb-3">
            Mã sản phẩm: {product.id}
          </p>
          <p className="fs-4 fw-bold text-danger mb-4">
            {formatPrice(product.price)}
          </p>
          <p className="fw-semibold mb-2">Số lượng</p>

          <div
            className="d-flex align-items-center gap-3"
            role="group"
          >
            <button
              type="button"
              className="btn btn-outline-dark"
              disabled={quantity <= 1}
              onClick={() => setQuantity(quantity - 1)}
            >
              −
            </button>
            <span className="fw-semibold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <div className="d-flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              className="btn btn-outline-dark px-4"
              onClick={() => addToCart(product, quantity)}
            >
              Thêm vào giỏ
            </button>
            <button
              type="button"
              className="btn btn-dark px-4"
              onClick={() => {
                addToCart(product, quantity);
                navigate("/checkout");
              }}
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}