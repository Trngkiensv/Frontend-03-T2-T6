import ProductCard from "../components/ProductCard";
import type { BannerResponse } from "../types/banner";
import ProductShowcase from "../components/ProductShowcase";
import useAPI from "../hooks/useAPI";
import type { ProductResponse } from "../types/product";

export default function Home() {
    const { data, error, loading } = useAPI<ProductResponse>(
        "https://api.mockfly.dev/mocks/bb5dda88-6781-4978-a985-b68f6a0c945f/products",
    );
    let products;
    if (Array.isArray(data)) {
        products = data;
    } else {
        products = data?.products || [];
    }
    const {
        data: bannerData,
        error: bannerError,
        loading: bannerLoading,
    } = useAPI<BannerResponse>(
        "https://api.mockfly.dev/mocks/bb5dda88-6781-4978-a985-b68f6a0c945f/banner",
    );
    let banners;
    if (Array.isArray(bannerData)) {
        banners = bannerData;
    } else {
        banners = bannerData?.banners || [];
    }
    if (loading) {
        return (
            <main className="container py-4" role="status">
                Đang tải sản phẩm...
            </main>
        );
    }
    if (error) {
        return (
            <main className="container py-4 text-danger" role="alert">
                {error}
            </main>
        );
    }
    return (
        <main className="container py-4 text-start">
            <section
                id="homeBanner"
                className="carousel slide mb-4"
                data-bs-interval="false"
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
            <ProductShowcase products={products} />
            <h1 id="all-products" className="h3 mb-4">
                Danh sách kính mát
            </h1>
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
