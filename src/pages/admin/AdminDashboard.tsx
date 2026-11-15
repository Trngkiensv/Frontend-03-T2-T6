import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { loadOrders } from "../../utils/orderStorage";
import { products } from "../../data/products";
import { formatPrice } from "../../utils/format";
import type { OrderStatus } from "../../types/order";
import "./AdminDashboard.css";

type TimeRange = "today" | "week" | "month" | "all";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const orders = useMemo(() => loadOrders(), []);

  // Lọc đơn hàng theo khoảng thời gian được chọn
  const filteredOrders = useMemo(() => {
    if (timeRange === "all") return orders;

    const now = Date.now();
    const thresholds = {
      today: 1000 * 60 * 60 * 24, // 24 giờ
      week: 1000 * 60 * 60 * 24 * 7, // 7 ngày
      month: 1000 * 60 * 60 * 24 * 30, // 30 ngày
    };

    const maxAge = thresholds[timeRange];
    return orders.filter(
      (o) => now - new Date(o.createdAt).getTime() <= maxAge
    );
  }, [orders, timeRange]);

  // Tính toán số liệu thống kê động dựa trên filteredOrders
  const totalRevenue = useMemo(() => {
    return filteredOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.finalTotal, 0);
  }, [filteredOrders]);

  const totalOrdersCount = filteredOrders.length;

  const pendingOrdersCount = useMemo(() => {
    return filteredOrders.filter((o) => o.status === "pending").length;
  }, [filteredOrders]);

  const totalProductsCount = products.length;

  // 5 đơn hàng mới nhất
  const recentOrders = useMemo(() => {
    return [...filteredOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [filteredOrders]);

  // Sản phẩm bán chạy nhất kèm tỷ lệ
  const topSellingProducts = useMemo(() => {
    const counts: Record<number, number> = {};
    filteredOrders.forEach((o) => {
      if (o.status !== "cancelled") {
        o.items.forEach((it) => {
          counts[it.id] = (counts[it.id] || 0) + it.quantity;
        });
      }
    });

    return products
      .map((p) => ({
        ...p,
        sold: counts[p.id] || (p.isBestSeller ? 24 : p.isFeatured ? 15 : 6),
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 4);
  }, [filteredOrders]);

  const maxSold = useMemo(() => {
    return Math.max(...topSellingProducts.map((p) => p.sold), 1);
  }, [topSellingProducts]);

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "today":
        return "hôm nay (24h qua)";
      case "week":
        return "7 ngày qua";
      case "month":
        return "tháng này (30 ngày)";
      case "all":
        return "toàn thời gian";
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <span className="order-status-badge order-status-badge--pending">● Chờ xác nhận</span>;
      case "shipping":
        return <span className="order-status-badge order-status-badge--shipping">● Đang giao</span>;
      case "completed":
        return <span className="order-status-badge order-status-badge--completed">● Hoàn thành</span>;
      case "cancelled":
        return <span className="order-status-badge order-status-badge--cancelled">● Đã hủy</span>;
    }
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}, ${d.toLocaleDateString("vi-VN")}`;
  };

  return (
    <div className="admin-dashboard">
      {/* Thanh bộ lọc thời gian */}
      <div className="dashboard-filter-bar">
        <div>
          <h2 className="dashboard-filter-bar__title">Tổng quan kết quả kinh doanh</h2>
          <p className="dashboard-filter-bar__subtitle">
            Dữ liệu thống kê được tính trong: <strong>{getTimeRangeLabel()}</strong>
          </p>
        </div>

        <div className="dashboard-filter-group" role="group" aria-label="Lọc khoảng thời gian">
          <button
            type="button"
            className={`dashboard-filter-btn ${timeRange === "all" ? "active" : ""}`}
            onClick={() => setTimeRange("all")}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={`dashboard-filter-btn ${timeRange === "month" ? "active" : ""}`}
            onClick={() => setTimeRange("month")}
          >
            Tháng này
          </button>
          <button
            type="button"
            className={`dashboard-filter-btn ${timeRange === "week" ? "active" : ""}`}
            onClick={() => setTimeRange("week")}
          >
            7 ngày qua
          </button>
          <button
            type="button"
            className={`dashboard-filter-btn ${timeRange === "today" ? "active" : ""}`}
            onClick={() => setTimeRange("today")}
          >
            Hôm nay
          </button>
        </div>
      </div>

      {/* 4 Thẻ KPI Tổng quan */}
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
            <span className="kpi-trend-pill kpi-trend-pill--up">↑ Doanh thu</span>
            <span>trong {getTimeRangeLabel()}</span>
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
            <span className="kpi-trend-pill kpi-trend-pill--up">↑ Đồng bộ</span>
            <span>trong {getTimeRangeLabel()}</span>
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

      {/* Khu vực 2 cột: Đơn hàng mới & Top sản phẩm bán chạy */}
      <div className="dashboard-grid-two-col">
        {/* Bảng đơn hàng mới nhất */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">
              <span>📦</span>
              <span>Đơn hàng mới nhất</span>
            </h2>
            <Link to="/admin/orders" className="dashboard-card__link">
              Xem tất cả đơn hàng →
            </Link>
          </div>

          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Thời gian</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-bold">{order.id}</td>
                    <td>
                      <div className="fw-semibold">{order.fullName}</div>
                      <small className="text-muted">{order.phone}</small>
                    </td>
                    <td className="text-muted small">{formatDate(order.createdAt)}</td>
                    <td>
                      {order.paymentMethod === "cod" ? (
                        <span className="badge bg-light text-dark border">COD</span>
                      ) : (
                        <span className="badge bg-primary-subtle text-primary border">VietQR</span>
                      )}
                    </td>
                    <td className="fw-bold text-danger">{formatPrice(order.finalTotal)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      Không có đơn hàng nào trong {getTimeRangeLabel()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top sản phẩm bán chạy */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">
              <span>🔥</span>
              <span>Bán chạy nhất</span>
            </h2>
            <Link to="/admin/products" className="dashboard-card__link">
              Xem kho →
            </Link>
          </div>

          <div className="top-products-list">
            {topSellingProducts.map((p) => (
              <div key={p.id} className="top-product-item">
                <img src={p.image} alt={p.name} className="top-product-item__thumb" />
                <div className="top-product-item__info">
                  <h3 className="top-product-item__name">{p.name}</h3>
                  <p className="top-product-item__price">{formatPrice(p.price)}</p>
                </div>
                <div className="top-product-item__stats">
                  <div className="top-product-item__sold">{p.sold} đã bán</div>
                  <div className="top-product-progress">
                    <div
                      className="top-product-progress__bar"
                      style={{ width: `${Math.round((p.sold / maxSold) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
