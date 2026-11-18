import { useEffect, useMemo, useState } from "react";
import type { User, UserRole } from "../../types/user";
import {
  deleteUser,
  getUsers,
  updateUserRole,
} from "../../services/mockApi";
import { useAuth } from "../../context/AuthContext";

export default function CustomerManagement() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadUserList = () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setUsers(getUsers());
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách người dùng"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserList();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.fullName.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.phone.toLowerCase().includes(normalizedSearch);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchValue, roleFilter]);

  const handleRoleChange = async (
    targetUser: User,
    role: UserRole
  ) => {
    if (targetUser.id === currentUser?.id) {
      setErrorMessage(
        "Không thể thay đổi quyền của tài khoản đang đăng nhập"
      );
      return;
    }

    try {
      setErrorMessage("");
      await updateUserRole(targetUser.id, role);
      loadUserList();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật quyền người dùng"
      );
    }
  };

  const handleDelete = async (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      setErrorMessage(
        "Không thể xóa tài khoản đang đăng nhập"
      );
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa tài khoản "${targetUser.email}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      await deleteUser(targetUser.id);
      loadUserList();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể xóa người dùng"
      );
    }
  };

  return (
    <section>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="h3 fw-bold mb-1">
            Quản lý tài khoản người dùng
          </h2>
          <p className="text-muted mb-0">
            Xem, phân quyền và xóa tài khoản người dùng.
          </p>
        </div>

        <span className="badge text-bg-dark fs-6 align-self-start">
          {users.length} tài khoản
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
                htmlFor="customer-search"
                className="form-label"
              >
                Tìm kiếm
              </label>

              <input
                id="customer-search"
                type="search"
                className="form-control"
                placeholder="Tìm theo tên, email hoặc số điện thoại..."
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
              />
            </div>

            <div className="col-12 col-md-4">
              <label
                htmlFor="customer-role-filter"
                className="form-label"
              >
                Lọc theo vai trò
              </label>

              <select
                id="customer-role-filter"
                className="form-select"
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value as "All" | UserRole
                  )
                }
              >
                <option value="All">Tất cả vai trò</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
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
                <th scope="col">Người dùng</th>
                <th scope="col">Liên hệ</th>
                <th scope="col">Vai trò</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col" className="text-end">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((targetUser) => {
                  const isCurrentUser =
                    targetUser.id === currentUser?.id;

                  return (
                    <tr key={targetUser.id}>
                      <td>
                        <div className="fw-semibold">
                          {targetUser.fullName}
                        </div>

                        {isCurrentUser && (
                          <small className="text-muted">
                            Tài khoản hiện tại
                          </small>
                        )}
                      </td>

                      <td>
                        <div>{targetUser.email}</div>
                        <small className="text-muted">
                          {targetUser.phone || "Chưa cập nhật SĐT"}
                        </small>
                      </td>

                      <td>
                        <select
                          className={`form-select form-select-sm ${
                            targetUser.role === "Admin"
                              ? "border-danger"
                              : ""
                          }`}
                          value={targetUser.role}
                          disabled={isCurrentUser}
                          onChange={(event) =>
                            handleRoleChange(
                              targetUser,
                              event.target.value as UserRole
                            )
                          }
                          aria-label={`Vai trò của ${targetUser.email}`}
                        >
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>

                      <td>
                        {new Date(
                          targetUser.createdAt
                        ).toLocaleDateString("vi-VN")}
                      </td>

                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          disabled={isCurrentUser}
                          onClick={() =>
                            handleDelete(targetUser)
                          }
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}