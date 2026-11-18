import type {
  LoginCredentials,
  RegisterData,
  User,
  UserRecord,
  UserRole,
} from "../types/user";

const USERS_STORAGE_KEY = "blackglasses-users";
const CURRENT_USER_STORAGE_KEY = "blackglasses-current-user";

function createDemoUsers(): UserRecord[] {
  return [
    {
      id: "admin-001",
      fullName: "Quản trị viên",
      email: "admin@blackglasses.vn",
      password: "admin123",
      phone: "0900000000",
      address: "",
      role: "Admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-001",
      fullName: "Nguyễn Văn User",
      email: "user@blackglasses.vn",
      password: "user123",
      phone: "0912345678",
      address: "Hà Nội",
      role: "User",
      createdAt: new Date().toISOString(),
    },
  ];
}

function normalizeRole(role: unknown): UserRole {
  return role === "Admin" || role === "admin" ? "Admin" : "User";
}

function normalizeUser(user: UserRecord): UserRecord {
  return {
    ...user,
    role: normalizeRole(user.role),
  };
}

function loadUsers(): UserRecord[] {
  const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
  const demoUsers = createDemoUsers();

  if (!rawUsers) {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(demoUsers)
    );

    return demoUsers;
  }

  try {
    const users = JSON.parse(rawUsers) as UserRecord[];

    if (!Array.isArray(users)) {
      throw new Error("Dữ liệu người dùng không hợp lệ");
    }

    const normalizedUsers = users.map(normalizeUser);

    for (const demoUser of demoUsers) {
      const exists = normalizedUsers.some(
        (user) =>
          user.email.toLowerCase() === demoUser.email.toLowerCase()
      );

      if (!exists) {
        normalizedUsers.push(demoUser);
      }
    }

    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(normalizedUsers)
    );

    return normalizedUsers;
  } catch {
    throw new Error("Dữ liệu người dùng không hợp lệ");
  }
}

function saveUsers(users: UserRecord[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function removePassword(user: UserRecord): User {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export async function login(
  credentials: LoginCredentials
): Promise<User> {
  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  if (!email || !password) {
    throw new Error("Vui lòng nhập email và mật khẩu");
  }

  const user = loadUsers().find(
    (item) => item.email.toLowerCase() === email
  );

  if (!user || user.password !== password) {
    throw new Error("Email hoặc mật khẩu không chính xác");
  }

  const safeUser = removePassword(user);

  localStorage.setItem(
    CURRENT_USER_STORAGE_KEY,
    JSON.stringify(safeUser)
  );

  return safeUser;
}

export async function register(data: RegisterData): Promise<User> {
  const fullName = data.fullName.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password;

  if (!fullName || !email || !password) {
    throw new Error("Vui lòng nhập đầy đủ thông tin bắt buộc");
  }

  if (password.length < 6) {
    throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
  }

  const users = loadUsers();
  const emailExists = users.some(
    (item) => item.email.toLowerCase() === email
  );

  if (emailExists) {
    throw new Error("Email này đã được đăng ký");
  }

  const newUser: UserRecord = {
    id: `user-${Date.now()}`,
    fullName,
    email,
    password,
    phone: data.phone?.trim() ?? "",
    address: data.address?.trim() ?? "",
    role: "User",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const safeUser = removePassword(newUser);

  localStorage.setItem(
    CURRENT_USER_STORAGE_KEY,
    JSON.stringify(safeUser)
  );

  return safeUser;
}

export function getCurrentUser(): User | null {
  const rawUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser) as User;
    const normalizedUser: User = {
      ...user,
      role: normalizeRole(user.role),
    };

    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      JSON.stringify(normalizedUser)
    );

    return normalizedUser;
  } catch {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    return null;
  }
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export async function updateUser(
  userId: string,
  changes: Pick<User, "fullName" | "phone" | "address">
): Promise<User> {
  const users = loadUsers();
  const userIndex = users.findIndex((item) => item.id === userId);

  if (userIndex === -1) {
    throw new Error("Không tìm thấy người dùng");
  }

  const updatedUser: UserRecord = {
    ...users[userIndex],
    fullName: changes.fullName.trim(),
    phone: changes.phone.trim(),
    address: changes.address.trim(),
  };

  users[userIndex] = updatedUser;
  saveUsers(users);

  const safeUser = removePassword(updatedUser);

  localStorage.setItem(
    CURRENT_USER_STORAGE_KEY,
    JSON.stringify(safeUser)
  );

  return safeUser;
}

// ==============================
// Lấy danh sách người dùng
export function getUsers(): User[] {
  return loadUsers().map(removePassword);
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<User> {
  const users = loadUsers();
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new Error("Không tìm thấy người dùng");
  }

  const targetUser = users[userIndex];

  if (targetUser.role === "Admin" && role === "User") {
    const adminCount = users.filter(
      (user) => user.role === "Admin"
    ).length;

    if (adminCount <= 1) {
      throw new Error(
        "Không thể hạ quyền Admin cuối cùng trong hệ thống"
      );
    }
  }

  const updatedUser: UserRecord = {
    ...targetUser,
    role,
  };

  users[userIndex] = updatedUser;
  saveUsers(users);

  const currentUser = getCurrentUser();

  if (currentUser?.id === userId) {
    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      JSON.stringify(removePassword(updatedUser))
    );
  }

  return removePassword(updatedUser);
}

export async function deleteUser(userId: string): Promise<void> {
  const users = loadUsers();
  const targetUser = users.find((user) => user.id === userId);

  if (!targetUser) {
    throw new Error("Không tìm thấy người dùng");
  }

  const currentUser = getCurrentUser();

  if (currentUser?.id === userId) {
    throw new Error("Không thể xóa tài khoản đang đăng nhập");
  }

  if (targetUser.role === "Admin") {
    const adminCount = users.filter(
      (user) => user.role === "Admin"
    ).length;

    if (adminCount <= 1) {
      throw new Error(
        "Không thể xóa Admin cuối cùng trong hệ thống"
      );
    }
  }

  const remainingUsers = users.filter(
    (user) => user.id !== userId
  );

  saveUsers(remainingUsers);
}