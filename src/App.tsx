import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminLayout from "./layouts/AdminLayout";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import { useCart } from "./context/CartContext";

export default function App() {
  const { toastMessage, hideToast } = useCart();

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <ScrollToTop />

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

      <Routes>
        {/* Phân hệ Khách hàng (Storefront) */}
        <Route
          element={
            <div className="d-flex flex-column min-vh-100">
              <div className="sticky-top bg-white shadow-sm">
                <Header />
                <CategoryNav />
              </div>
              <div className="flex-grow-1">
                <Outlet />
              </div>
              <Footer />
            </div>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Phân hệ Quản trị (Admin Portal) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={
              <AdminPlaceholder
                title="Dashboard Tổng quan"
                desc="Trung tâm điều khiển, biểu đồ và số liệu báo cáo kinh doanh tổng hợp."
              />
            }
          />
          <Route
            path="products"
            element={
              <AdminPlaceholder
                title="Quản lý Sản phẩm"
                desc="Danh sách kính mắt, lọc, tìm kiếm, thêm mới, sửa đổi và xóa sản phẩm."
              />
            }
          />
          <Route
            path="orders"
            element={
              <AdminPlaceholder
                title="Quản lý Đơn hàng"
                desc="Tiếp nhận đơn đặt hàng từ khách, chuyển trạng thái và xem chi tiết sản phẩm đã mua."
              />
            }
          />
          <Route
            path="coupons"
            element={
              <AdminPlaceholder
                title="Quản lý Mã giảm giá"
                desc="Tạo mã khuyến mãi, thiết lập tỷ lệ giảm giá, hạn dùng và bật/tắt voucher."
              />
            }
          />
          <Route
            path="banners"
            element={
              <AdminPlaceholder
                title="Quản lý Banner Slider"
                desc="Thêm, sửa ảnh banner quảng cáo hiển thị ở đầu trang chủ khách hàng."
              />
            }
          />
          <Route
            path="categories"
            element={
              <AdminPlaceholder
                title="Quản lý Danh mục kính"
                desc="Phân loại các dòng kính mắt: kính râm, kính cận, kính thể thao..."
              />
            }
          />
          <Route
            path="customers"
            element={
              <AdminPlaceholder
                title="Quản lý Khách hàng"
                desc="Danh sách thông tin người mua hàng, lịch sử đặt đơn và xếp hạng khách hàng."
              />
            }
          />
          <Route
            path="settings"
            element={
              <AdminPlaceholder
                title="Cài đặt Cửa hàng"
                desc="Cấu hình thông tin liên hệ, hotline và chính sách giao hàng miễn phí."
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
}
