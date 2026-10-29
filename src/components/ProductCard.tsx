import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card h-100 shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        className="card-img-top bg-light p-3"
        style={{ height: 180, objectFit: "contain" }}
      />

      <div className="card-body">
        <h2 className="card-title h5">{product.name}</h2>

        <p className="card-text fw-bold text-danger">
          {product.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      </div>
    </article>
  );
}