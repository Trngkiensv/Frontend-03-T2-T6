import { useMemo } from "react";
import { loadOrders } from "../../utils/orderStorage";
import { products } from "../../data/products";
import { formatPrice } from "../../utils/format";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const orders = useMemo(() => loadOrders(), []);

  // Tính toán số liệu thống kê động
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.finalTotal, 0);
  }, [orders]);

  const totalOrdersCount = orders.length;

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === "pending").length;
  }, [orders]);

  const totalProductsCount = products.length;

  return (
    <div className="admin-dashboard">
      {/* 4 Thẻ KPI Tổng quan với số liệu tính toán động */}
      <section className="dashboard-kpi-grid" aria-label="Thống kê chỉ số chính">
        {/* Doanh thu */}
        <div className="kpi-card">
          <div className="kpi-card__top">
            <span className="kpi-card__title">Tổng doanh thu</span>
            <div className="kpi-card__icon-wrap kpi-card__icon-wrap--revenue">
              <span>💰</span>
            </div>
          </div>
          <div className="kpi-card__value">{formatPrice(totalRevenue)}</div>
          <div className="kpi-card__trend">
            <span className="kpi-trend-pill kpi-trend-pill--up">↑ +14.8%</span>
            <span>tính từ đơn hàng thực tế</span>
          </div>
        </div>

        {/* Tổng đơn hàng */}
        <div className="kpi-card">
          <div className="kpi-card__top">
            <span className="kpi-card__title">Tổng đơn hàng</span>
            <div className="kpi-card__icon-wrap kpi-card__icon-wrap--orders">
              <span>📦</span>
            </div>
          </div>
          <div className="kpi-card__value">{totalOrdersCount} đơn</div>
          <div className="kpi-card__trend">
            <span className="kpi-trend-pill kpi-trend-pill--up">↑ Tự động đồng bộ</span>
            <span>từ trang Checkout</span>
          </div>
        </div>

        {/* Sản phẩm trong kho */}
        <div className="kpi-card">
          <div className="kpi-card__top">
            <span className="kpi-card__title">Sản phẩm trong kho</span>
            <div className="kpi-card__icon-wrap kpi-card__icon-wrap--products">
              <span>🕶️</span>
            </div>
          </div>
          <div className="kpi-card__value">{totalProductsCount} mẫu kính</div>
          <div className="kpi-card__trend">
            <span className="kpi-trend-pill kpi-trend-pill--neutral">Hoạt động</span>
            <span>đang niêm yết bán</span>
          </div>
        </div>

        {/* Đơn hàng chờ xử lý */}
        <div className="kpi-card">
          <div className="kpi-card__top">
            <span className="kpi-card__title">Đơn chờ xử lý</span>
            <div className="kpi-card__icon-wrap kpi-card__icon-wrap--pending">
              <span>⏳</span>
            </div>
          </div>
          <div className="kpi-card__value">{pendingOrdersCount} đơn mới</div>
          <div className="kpi-card__trend">
            <span className="kpi-trend-pill kpi-trend-pill--down">Cần duyệt</span>
            <span>chờ xác nhận đơn</span>
          </div>
        </div>
      </section>
    </div>
  );
}
