import type { Product } from "../types/product";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="card h-100 shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        className="card-img-top bg-light p-3"
        style={{ height: 180, objectFit: "contain" }}
      />

      <div className="card-body d-flex flex-column">
        <h2 className="card-title h5">{product.name}</h2>

        <p className="card-text fw-bold text-danger">
          {formatPrice(product.price)}
        </p>

        <button
          id={`add-to-cart-${product.id}`}
          type="button"
          className="btn btn-dark mt-auto"
          onClick={() => addToCart(product)}
        >
          Thêm vào giỏ
        </button>
      </div>
    </article>
  );
}