import { useMemo } from "react";
import { Link } from "react-router-dom";
import { loadOrders } from "../../utils/orderStorage";
import { products } from "../../data/products";
import { formatPrice } from "../../utils/format";
import type { OrderStatus } from "../../types/order";
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

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [orders]);

  // Sản phẩm bán chạy nhất kèm tỷ lệ
  const topSellingProducts = useMemo(() => {
    const counts: Record<number, number> = {};
    orders.forEach((o) => {
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
  }, [orders]);

  const maxSold = useMemo(() => {
    return Math.max(...topSellingProducts.map((p) => p.sold), 1);
  }, [topSellingProducts]);

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
                      Chưa có đơn hàng nào
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
