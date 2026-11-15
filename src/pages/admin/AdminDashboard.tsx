import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
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
          <div className="kpi-card__value">18.450.000 ₫</div>
          <div className="kpi-card__trend">
            <span className="kpi-trend-pill kpi-trend-pill--up">↑ +14.8%</span>
            <span>so với tháng trước</span>
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
          <div className="kpi-card__value">42 đơn</div>
          <div className="kpi-card__trend">
            <span className="kpi-trend-pill kpi-trend-pill--up">↑ +8.2%</span>
            <span>so với tháng trước</span>
          </div>
        </div>

        {/* Sản phẩm đang bán */}
        <div className="kpi-card">
          <div className="kpi-card__top">
            <span className="kpi-card__title">Sản phẩm trong kho</span>
            <div className="kpi-card__icon-wrap kpi-card__icon-wrap--products">
              <span>🕶️</span>
            </div>
          </div>
          <div className="kpi-card__value">12 mẫu kính</div>
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
          <div className="kpi-card__value">5 đơn mới</div>
          <div className="kpi-card__trend">
            <span className="kpi-trend-pill kpi-trend-pill--down">Cần duyệt</span>
            <span>chưa chuyển giao</span>
          </div>
        </div>
      </section>
    </div>
  );
}
