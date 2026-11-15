import { useState, useEffect } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const ADMIN_NAV_LINKS = [
  { section: "Tổng quan" },
  { path: "/admin", label: "Dashboard", icon: "📊", end: true },
  
  { section: "Bán hàng" },
  { path: "/admin/products", label: "Sản phẩm", icon: "🕶️" },
  { path: "/admin/orders", label: "Đơn hàng", icon: "📦" },
  { path: "/admin/coupons", label: "Mã giảm giá", icon: "🎟️" },
  
  { section: "Nội dung & Khách hàng" },
  { path: "/admin/banners", label: "Banner Slider", icon: "🖼️" },
  { path: "/admin/categories", label: "Danh mục kính", icon: "🏷️" },
  { path: "/admin/customers", label: "Khách hàng", icon: "👥" },
  
  { section: "Hệ thống" },
  { path: "/admin/settings", label: "Cài đặt shop", icon: "⚙️" },
];

export default function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/admin" || currentPath === "/admin/") return "Dashboard Tổng quan";
    if (currentPath.startsWith("/admin/products")) return "Quản lý Sản phẩm";
    if (currentPath.startsWith("/admin/orders")) return "Quản lý Đơn hàng";
    if (currentPath.startsWith("/admin/coupons")) return "Quản lý Mã giảm giá";
    if (currentPath.startsWith("/admin/banners")) return "Quản lý Banner quảng cáo";
    if (currentPath.startsWith("/admin/categories")) return "Quản lý Danh mục kính";
    if (currentPath.startsWith("/admin/customers")) return "Quản lý Khách hàng";
    if (currentPath.startsWith("/admin/settings")) return "Cài đặt cửa hàng";
    return "Quản trị hệ thống";
  };

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__brand">
          <Link to="/admin" className="admin-sidebar__brand-link">
            <span>🕶️ BLACKGLASSES</span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <span className="admin-sidebar__badge">ADMIN</span>
            <button
              type="button"
              className="admin-sidebar__close d-lg-none"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Đóng thanh điều hướng"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {ADMIN_NAV_LINKS.map((item, index) => {
            if ("section" in item && item.section) {
              return (
                <div key={index} className="admin-nav__heading">
                  {item.section}
                </div>
              );
            }

            if ("path" in item && item.path) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-nav__item ${isActive ? "active" : ""}`
                  }
                >
                  <span className="admin-nav__icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            }

            return null;
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__back-btn">
            <span>←</span>
            <span>Về trang bán hàng</span>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        {/* Admin Header */}
        <header className="admin-header">
          <div className="admin-header__left">
            <button
              type="button"
              className="admin-header__toggle d-lg-none"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Mở thanh điều hướng"
            >
              ☰
            </button>
            <h1 className="admin-header__title">{getPageTitle()}</h1>
          </div>

          <div className="admin-header__right">
            <Link
              to="/"
              className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
              title="Về trang bán hàng"
            >
              <span>🛍️</span>
              <span className="d-none d-sm-inline">Xem cửa hàng</span>
            </Link>

            <div className="admin-header__badge-live d-none d-md-flex">
              <span className="admin-header__badge-dot" />
              <span>Hệ thống trực tuyến</span>
            </div>

            <div className="admin-header__profile">
              <div className="admin-header__avatar">AD</div>
              <div className="admin-header__profile-info d-none d-sm-flex">
                <span className="admin-header__name">Quản trị viên</span>
                <span className="admin-header__role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
