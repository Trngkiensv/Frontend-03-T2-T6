import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { useCart } from "./context/CartContext";

export default function App() {
  const { toastMessage, hideToast } = useCart();

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      {/* Toast thông báo thêm giỏ hàng */}
      {toastMessage && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 9999, marginTop: "1rem" }}
        >
          <div className="toast show align-items-center text-bg-dark border-0 shadow-lg px-2 py-1 rounded-3">
            <div className="d-flex align-items-center">
              <div className="toast-body d-flex align-items-center gap-2">
                <span className="text-warning">✓</span>
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={hideToast}
                aria-label="Đóng"
              />
            </div>
          </div>
        </div>
      )}

      <div className="sticky-top bg-white shadow-sm">
        <Header />
        <CategoryNav />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <Footer />
    </div>
  );
}
