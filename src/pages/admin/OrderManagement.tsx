import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "../../utils/format";
import {
  loadOrders,
  updateOrderStatus,
} from "../../utils/orderStorage";
import type { Order, OrderStatus } from "../../types/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "text-bg-warning",
  shipping: "text-bg-info",
  completed: "text-bg-success",
  cancelled: "text-bg-danger",
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | OrderStatus
  >("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadOrderList = () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setOrders(loadOrders());
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách đơn hàng"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrderList();
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        const matchesSearch =
          !normalizedSearch ||
          order.id.toLowerCase().includes(normalizedSearch) ||
          order.fullName.toLowerCase().includes(normalizedSearch) ||
          order.phone.toLowerCase().includes(normalizedSearch);

        const matchesStatus =
          statusFilter === "all" ||
          order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime()
      );
  }, [orders, searchValue, statusFilter]);

  const handleStatusChange = (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      setErrorMessage("");
      const updatedOrder = updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );

      setSelectedOrder((currentOrder) =>
        currentOrder?.id === updatedOrder.id
          ? updatedOrder
          : currentOrder
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trạng thái đơn hàng"
      );
    }
  };

  const getTotalQuantity = (order: Order) =>
    order.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN");

  return (
    <section>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="h3 fw-bold mb-1">Quản lý đơn hàng</h2>
          <p className="text-muted mb-0">
            Theo dõi đơn hàng và cập nhật trạng thái xử lý.
          </p>
        </div>

        <span className="badge text-bg-dark fs-6 align-self-start">
          {orders.length} đơn hàng
        </span>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <label
                htmlFor="order-search"
                className="form-label"
              >
                Tìm kiếm đơn hàng
              </label>

              <input
                id="order-search"
                type="search"
                className="form-control"
                placeholder="Mã đơn, tên khách hàng hoặc số điện thoại..."
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
              />
            </div>

            <div className="col-12 col-md-4">
              <label
                htmlFor="order-status-filter"
                className="form-label"
              >
                Lọc trạng thái
              </label>

              <select
                id="order-status-filter"
                className="form-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "all" | OrderStatus
                  )
                }
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Mã đơn</th>
                <th scope="col">Khách hàng</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Thanh toán</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col" className="text-end">
                  Chi tiết
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-5">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5">
                    Không tìm thấy đơn hàng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="fw-bold">{order.id}</span>
                    </td>

                    <td>
                      <div className="fw-semibold">
                        {order.fullName}
                      </div>
                      <small className="text-muted">
                        {order.phone}
                      </small>
                    </td>

                    <td>
                      {getTotalQuantity(order)} sản phẩm
                    </td>

                    <td className="fw-semibold">
                      {formatPrice(order.finalTotal)}
                    </td>

                    <td>
                      {order.paymentMethod === "cod"
                        ? "COD"
                        : "Chuyển khoản"}
                    </td>

                    <td>
                      <select
                        className={`form-select form-select-sm ${STATUS_CLASSES[order.status]}`}
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value as OrderStatus
                          )
                        }
                        aria-label={`Trạng thái đơn ${order.id}`}
                      >
                        <option value="pending">
                          Chờ xác nhận
                        </option>
                        <option value="shipping">
                          Đang giao
                        </option>
                        <option value="completed">
                          Hoàn thành
                        </option>
                        <option value="cancelled">
                          Đã hủy
                        </option>
                      </select>
                    </td>

                    <td>
                      <small>{formatDate(order.createdAt)}</small>
                    </td>

                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span className="fw-bold">
              Chi tiết đơn hàng {selectedOrder.id}
            </span>

            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Đóng chi tiết"
              onClick={() => setSelectedOrder(null)}
            />
          </div>

          <div className="card-body">
            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6">
                <h3 className="h6 fw-bold">Thông tin người nhận</h3>
                <p className="mb-1">
                  <strong>Họ tên:</strong>{" "}
                  {selectedOrder.fullName}
                </p>
                <p className="mb-1">
                  <strong>Số điện thoại:</strong>{" "}
                  {selectedOrder.phone}
                </p>
                <p className="mb-1">
                  <strong>Địa chỉ:</strong>{" "}
                  {selectedOrder.address}
                </p>

                {selectedOrder.note && (
                  <p className="mb-0">
                    <strong>Ghi chú:</strong>{" "}
                    {selectedOrder.note}
                  </p>
                )}
              </div>

              <div className="col-12 col-md-6">
                <h3 className="h6 fw-bold">Thông tin đơn hàng</h3>
                <p className="mb-1">
                  <strong>Ngày tạo:</strong>{" "}
                  {formatDate(selectedOrder.createdAt)}
                </p>
                <p className="mb-1">
                  <strong>Thanh toán:</strong>{" "}
                  {selectedOrder.paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : "Chuyển khoản ngân hàng"}
                </p>
                <p className="mb-0">
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    className={`badge ${STATUS_CLASSES[selectedOrder.status]}`}
                  >
                    {STATUS_LABELS[selectedOrder.status]}
                  </span>
                </p>
              </div>
            </div>

            <h3 className="h6 fw-bold">Sản phẩm</h3>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-end">Đơn giá</th>
                    <th className="text-end">Thành tiền</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="rounded border"
                            style={{ objectFit: "contain" }}
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>

                      <td className="text-center">
                        {item.quantity}
                      </td>

                      <td className="text-end">
                        {formatPrice(item.price)}
                      </td>

                      <td className="text-end">
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="row justify-content-end">
              <div className="col-12 col-md-5">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tạm tính:</span>
                  <span>
                    {formatPrice(selectedOrder.subtotal)}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {formatPrice(selectedOrder.shippingFee)}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Giảm giá:</span>
                  <span className="text-success">
                    -{formatPrice(selectedOrder.discountAmount)}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(selectedOrder.finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}