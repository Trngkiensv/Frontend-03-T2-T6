import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        fullName,
        email,
        password,
        phone,
        address,
      });

      navigate("/account", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Đăng ký không thành công"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h1 className="h3 fw-bold text-center mb-4">
              Tạo tài khoản
            </h1>

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="register-name" className="form-label">
                  Họ và tên
                </label>
                <input
                  id="register-name"
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="register-email" className="form-label">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="register-phone" className="form-label">
                  Số điện thoại
                </label>
                <input
                  id="register-phone"
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="register-address" className="form-label">
                  Địa chỉ
                </label>
                <textarea
                  id="register-address"
                  className="form-control"
                  rows={2}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="register-password" className="form-label">
                  Mật khẩu
                </label>
                <input
                  id="register-password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="register-confirm-password"
                  className="form-label"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
              </button>
            </form>

            <p className="text-center text-muted mt-4 mb-0">
              Đã có tài khoản?{" "}
              <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}