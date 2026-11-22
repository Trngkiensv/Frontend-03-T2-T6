import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";
export default function ProductList() {
    const [searchParams] = useSearchParams();
    const q = (searchParams.get("q") || "").trim();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        let isActive = true;
        setLoading(true);
        setError("");
        getProducts("Black")
            .then((data) => {
                if (isActive) {
                    setProducts(data);
                }
            })
            .catch(() => {
                if (isActive) {
                    setError("Err");
                }
            })
            .finally(() => {
                if (isActive) {
                    setLoading(false);
                }
            });
        return () => {
            isActive = false;
        };
    }, [q]);
    if (loading) {
        return (
            <main className="container py-4" role="status">
                Đang tìm ...
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
            <h1 className="h3 text-body mb-4"></h1>
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
