import useAPI from "../hooks/useAPI";
import ProductCard from "../components/ProductCard";
import type { ProductResponse } from "../types/product";

export default function ProductList() {
    const { data, error, loading } = useAPI<ProductResponse>(
        "https://api.mockfly.dev/mocks/bb5dda88-6781-4978-a985-b68f6a0c945f/products?q=Black",
    );
    let products;
    if (Array.isArray(data)) {
        products = data;
    } else {
        products = data?.products || [];
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
        <main className="container py-4">
            <h1 className="h3 text-body mb-4">Kết quả tìm kiếm</h1>
            {products.length === 0 && <p>Không tìm thấy sản phẩm.</p>}
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
