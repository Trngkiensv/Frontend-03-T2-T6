import { useState } from "react";
import { products as initialProducts } from "../../data/products";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/format";

export default function ProductManagement() {
  const [productList] = useState<Product[]>(initialProducts);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Quản lý Sản phẩm</h4>
          <small className="text-muted">Tổng: {productList.length} sản phẩm</small>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th style={{ width: 80 }}>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Nổi bật</th>
                  <th>Bán chạy</th>
                  <th>Mới</th>
                  <th style={{ width: 140 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product, index) => (
                  <tr key={product.id}>
                    <td className="text-muted">{index + 1}</td>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }}
                      />
                    </td>
                    <td className="fw-semibold">{product.name}</td>
                    <td className="text-primary fw-bold">{formatPrice(product.price)}</td>
                    <td>
                      {product.isFeatured ? (
                        <span className="badge text-bg-primary">Nổi bật</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {product.isBestSeller ? (
                        <span className="badge text-bg-warning text-dark">Bán chạy</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {product.isNew ? (
                        <span className="badge text-bg-success">Mới</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="bi bi-pencil" /> Sửa
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
