import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAPI from "../hooks/useAPI";
import type { ProductDetailData } from "../types/product";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedColorId, setSelectedColorId] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [imageIndex, setImageIndex] = useState(0);
    useEffect(() => {
        setSelectedColorId("");
        setSelectedSize("");
        setImageIndex(0);
        setQuantity(1);
    }, [id]);
    const { data, error, loading } = useAPI<ProductDetailData>(
        `https://api.mockfly.dev/mocks/bb5dda88-6781-4978-a985-b68f6a0c945f/products/${id}`,
    );

    const product = data;
    if (loading) {
        return (
            <main className="container py-5">
                <p>Đang tải sản phẩm...</p>
            </main>
        );
    }
    if (error) {
        return (
            <main className="container py-5">
                <p className="text-danger">{error}</p>
            </main>
        );
    }
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

    // Có sản phẩm rồi mới đọc dữ liệu.
    const selectedColor =
        product.colors.find((color) => color.id === selectedColorId) ||
        product.colors[0];

    const size = selectedSize || product.sizes[0];

    const selectedVariant = product.variants.find(
        (variant) =>
            variant.colorId === selectedColor?.id && variant.size === size,
    );

    const stock = selectedVariant ? selectedVariant.stock : 0;

    let images = [product.image];

    if (selectedColor && selectedColor.images.length > 0) {
        images = selectedColor.images;
    }

    const mainImage = images[imageIndex] || product.image;
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
                        src={mainImage}
                        alt={product.name}
                        className="img-fluid w-100 rounded bg-light"
                    />
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        {images.map((image, index) => (
                            <button
                                key={image}
                                type="button"
                                className={
                                    imageIndex === index
                                        ? "btn p-1 border border-dark"
                                        : "btn p-1 border"
                                }
                                onClick={() => setImageIndex(index)}
                            >
                                <img
                                    src={image}
                                    alt={`${product.name} - ảnh ${index + 1}`}
                                    width={80}
                                    className="img-fluid"
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <h1 className="h3 text-body mt-0 mb-3">{product.name}</h1>
                    <p className="text-body-secondary mb-3">
                        Mã sản phẩm: {product.id}
                    </p>
                    <p className="fs-4 fw-bold text-danger mb-4">
                        {formatPrice(product.price)}
                    </p>
                    <div className="mb-4">
                        <p className="fw-semibold mb-2">
                            Màu sắc: {selectedColor?.name}
                        </p>

                        <div className="d-flex flex-wrap gap-2">
                            {product.colors.map((color) => (
                                <button
                                    key={color.id}
                                    type="button"
                                    className={
                                        selectedColor?.id === color.id
                                            ? "btn btn-dark"
                                            : "btn btn-outline-dark"
                                    }
                                    onClick={() => {
                                        setSelectedColorId(color.id);
                                        setImageIndex(0);
                                        setQuantity(1);
                                    }}
                                >
                                    {color.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <p className="fw-semibold mb-2">Kích thước: {size}</p>
                        <div className="d-flex flex-wrap gap-2">
                            {product.sizes.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={
                                        size === item
                                            ? "btn btn-dark"
                                            : "btn btn-outline-dark"
                                    }
                                    onClick={() => {
                                        setSelectedSize(item);
                                        setQuantity(1);
                                    }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className={stock > 0 ? "text-success" : "text-danger"}>
                        {stock > 0 ? `Còn ${stock} sản phẩm` : "Hết hàng"}
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
