import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await updateProfile({ fullName, phone, address });
      setMessage("Cập nhật thông tin thành công");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật thông tin"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 fw-bold mb-1">Tài khoản của tôi</h1>
              <p className="text-muted mb-1">{user.email}</p>
              <span
                className={`badge ${
                  user.role === "Admin"
                    ? "text-bg-danger"
                    : "text-bg-secondary"
                }`}
              >
                {user.role}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h2 className="h5 fw-bold mb-4">
              Thông tin cá nhân
            </h2>

            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="account-name" className="form-label">
                  Họ và tên
                </label>
                <input
                  id="account-name"
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="account-email" className="form-label">
                  Email
                </label>
                <input
                  id="account-email"
                  type="email"
                  className="form-control"
                  value={user.email}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="account-role" className="form-label">
                  Vai trò
                </label>
                <input
                  id="account-role"
                  type="text"
                  className="form-control"
                  value={user.role}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="account-phone" className="form-label">
                  Số điện thoại
                </label>
                <input
                  id="account-phone"
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="account-address" className="form-label">
                  Địa chỉ
                </label>
                <textarea
                  id="account-address"
                  className="form-control"
                  rows={3}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}