import { useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { products } from "../data/products";
import "./ProductShowcase.css";

export default function ProductShowcase() {
    const [activeGroup, setActiveGroup] = useState("isFeatured");

    const filteredProducts = products.filter((product) => {
        if (activeGroup === "isFeatured") {
            return product.isFeatured;
        }

        if (activeGroup === "isBestSeller") {
            return product.isBestSeller;
        }

        if (activeGroup === "isNew") {
            return product.isNew;
        }

        return false;
    });

    return (
        <section className="border rounded-4 p-3 p-md-4 mb-4">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                <div>
                    <h2 className="h4 text-body mb-1">
                        Khám phá bộ sưu tập kính mát
                    </h2>
                    <p className="small text-body-secondary mb-0">
                        Những sản phẩm dành cho bạn
                    </p>
                </div>

                <a
                    href="#all-products"
                    className="small text-nowrap text-decoration-none"
                >
                    Xem tất cả →
                </a>
            </div>

            <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                <div className="d-flex flex-wrap gap-2" role="group">
                    <button
                        type="button"
                        className={
                            activeGroup === "isFeatured"
                                ? "btn btn-dark rounded-pill"
                                : "btn btn-outline-secondary rounded-pill"
                        }
                        onClick={() => setActiveGroup("isFeatured")}
                    >
                        Nổi bật
                    </button>

                    <button
                        type="button"
                        className={
                            activeGroup === "isBestSeller"
                                ? "btn btn-dark rounded-pill"
                                : "btn btn-outline-secondary rounded-pill"
                        }
                        onClick={() => setActiveGroup("isBestSeller")}
                    >
                        Bán chạy
                    </button>

                    <button
                        type="button"
                        className={
                            activeGroup === "isNew"
                                ? "btn btn-dark rounded-pill"
                                : "btn btn-outline-secondary rounded-pill"
                        }
                        onClick={() => setActiveGroup("isNew")}
                    >
                        Mới nhất
                    </button>
                </div>
            </div>
            <div
                className="product-track d-flex flex-nowrap gap-3 overflow-x-auto pb-3"
                role="region"
                tabIndex={0}
            >
                {filteredProducts.map((product) => (
                    <div className="product-slide" key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <p className="text-body-secondary">Chưa có sản phẩm</p>
            )}
        </section>
    );
}
