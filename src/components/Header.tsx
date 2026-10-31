export default function Header() {
  return (
    <header className="bg-white border-bottom">
      <div className="container py-3">
        <div className="row align-items-center g-3">
          <div className="col-12 col-lg-3 text-center text-lg-start">
            <span className="fs-4 fw-bold text-dark">
              BLACKGLASSES
            </span>
          </div>

          <div className="col-12 col-md-7 col-lg-5">
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Tìm kiếm kính mát..."
                aria-label="Tìm kiếm sản phẩm"
              />

              <button type="button" className="btn btn-dark">
                Tìm kiếm
              </button>
            </div>
          </div>

          <div className="col-12 col-md-5 col-lg-4">
            <div className="d-flex justify-content-center justify-content-md-end gap-2">
              <button
                type="button"
                className="btn btn-outline-dark text-nowrap"
              >
                Tài khoản
              </button>

              <button
                type="button"
                className="btn btn-dark text-nowrap"
              >
                Giỏ hàng
                <span className="badge bg-light text-dark ms-2">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}