import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { totalQuantity } = useCart();
    const { user } = useAuth();
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    return (
        <header className="bg-white border-bottom">
            <div className="container py-3">
                <div className="row align-items-center g-3">
                    <div className="col-12 col-lg-3 text-center text-lg-start">
                        <Link
                            to="/"
                            className="fs-4 fw-bold text-dark text-decoration-none"
                        >
                            BLACKGLASSES
                        </Link>
                    </div>

                    <div className="col-12 col-md-7 col-lg-5">
                        <form
                            className="input-group"
                            onSubmit={(event) => {
                                event.preventDefault();
                                const q = keyword.trim();
                                if (q) {
                                    navigate(
                                        `/products?q=${encodeURIComponent(q)}`,
                                    );
                                } else {
                                    navigate("/products");
                                }
                            }}
                        >
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Tìm kiếm "
                                value={keyword}
                                onChange={(event) =>
                                    setKeyword(event.target.value)
                                }
                            />
                            <button type="submit" className="btn btn-dark">
                                Tìm kiếm
                            </button>
                        </form>
                    </div>

                    <div className="col-12 col-md-5 col-lg-4">
                        <div className="d-flex justify-content-center justify-content-md-end gap-2 align-items-center">
                            {user?.role === "Admin" && (
                                <Link
                                    id="header-admin"
                                    to="/admin"
                                    className="btn btn-outline-secondary text-nowrap d-flex align-items-center gap-1"
                                    title="Truy cập trang quản trị"
                                >
                                    <span>⚙️</span>
                                    <span>Quản trị</span>
                                </Link>
                            )}

                            <Link
                                to={user ? "/account" : "/login"}
                                className="btn btn-outline-dark text-nowrap"
                            >
                                {user ? user.fullName : "Tài khoản"}
                            </Link>

                            <Link
                                id="header-cart"
                                to="/cart"
                                className="btn btn-dark text-nowrap"
                            >
                                Giỏ hàng
                                <span className="badge bg-light text-dark ms-2">
                                    {totalQuantity}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
