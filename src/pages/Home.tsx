import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Home() {
  return (
    <main className="container py-4 text-start">
      <h1 className="h3 mb-4">Danh sách kính mát</h1>

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </main>
  );
}
