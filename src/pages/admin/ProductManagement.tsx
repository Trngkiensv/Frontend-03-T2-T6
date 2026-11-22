import { useState } from "react";
import { products as initialProducts } from "../../data/products";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/format";

type FilterType = "all" | "featured" | "bestSeller" | "new";

type ProductForm = {
  name: string;
  price: string;
  image: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  price: "",
  image: "",
  isFeatured: false,
  isBestSeller: false,
  isNew: false,
};

export default function ProductManagement() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const filtered = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchValue.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "featured" && p.isFeatured) ||
      (filter === "bestSeller" && p.isBestSeller) ||
      (filter === "new" && p.isNew);
    return matchSearch && matchFilter;
  });

  function openAddModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      image: product.image,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNew: product.isNew,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.price) return;
    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...form, price: Number(form.price) }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: form.name,
        price: Number(form.price),
        image: form.image || `https://placehold.co/600x400?text=${encodeURIComponent(form.name)}`,
        isFeatured: form.isFeatured,
        isBestSeller: form.isBestSeller,
        isNew: form.isNew,
      };
      setProductList((prev) => [newProduct, ...prev]);
    }
    setShowModal(false);
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Quản lý Sản phẩm</h4>
          <small className="text-muted">Tổng: {productList.length} sản phẩm</small>
        </div>
        <button className="btn btn-dark" onClick={openAddModal}>
          + Thêm sản phẩm
        </button>
      </div>

      {/* Thanh tìm kiếm + bộ lọc */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <div className="d-flex gap-2 flex-wrap">
            {[
              { value: "all", label: "Tất cả" },
              { value: "featured", label: "Nổi bật" },
              { value: "bestSeller", label: "Bán chạy" },
              { value: "new", label: "Mới" },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`btn btn-sm ${filter === opt.value ? "btn-dark" : "btn-outline-secondary"}`}
                onClick={() => setFilter(opt.value as FilterType)}
              >
                {opt.label}
              </button>
            ))}
          </div>
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                )}
                {filtered.map((product, index) => (
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
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => openEditModal(product)}
                      >
                        Sửa
                      </button>
                      <button className="btn btn-sm btn-outline-danger" disabled>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Thêm / Chỉnh sửa */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tên sản phẩm <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Giá (VND) <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="VD: 450000"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">URL Ảnh</label>
                  <input
                    className="form-control"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="d-flex gap-4 flex-wrap">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isFeatured"
                      checked={form.isFeatured}
                      onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="isFeatured">Nổi bật</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isBestSeller"
                      checked={form.isBestSeller}
                      onChange={(e) => setForm((f) => ({ ...f, isBestSeller: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="isBestSeller">Bán chạy</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isNew"
                      checked={form.isNew}
                      onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="isNew">Mới</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="btn btn-dark" onClick={handleSave}>
                  {editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
