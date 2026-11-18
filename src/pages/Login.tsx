import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath =
    (location.state as { from?: string } | null)?.from ?? "/account";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      
      // Đăng nhập thành công thì chuyển về trang chủ
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Đăng nhập không thành công"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h1 className="h3 fw-bold text-center mb-4">Đăng nhập</h1>

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="login-email" className="form-label">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="login-password" className="form-label">
                  Mật khẩu
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <p className="text-center text-muted mt-4 mb-0">
              Chưa có tài khoản?{" "}
              <Link to="/register">Đăng ký ngay</Link>
            </p>

            <small className="text-muted text-center mt-3">
              Tài khoản admin demo: admin@blackglasses.vn / admin123
            </small>
          </div>
        </div>
      </div>
    </main>
  );
}