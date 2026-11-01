import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { banners } from "../data/banners";

export default function Home() {
  return (
    <main className="container py-4 text-start">
      <section
        id="homeBanner"
        className="carousel slide mb-4"
        data-bs-interval="false"
        aria-label="Banner quảng cáo"
      >
        <div className="carousel-inner rounded">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="d-block w-100 img-fluid"
                width={1200}
                height={360}
              />
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeBanner"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon bg-dark rounded-circle"
            aria-hidden="true"
          />
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeBanner"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon bg-dark rounded-circle"
            aria-hidden="true"
          />
        </button>
      </section>

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
