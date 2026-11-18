import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type {
  LoginCredentials,
  RegisterData,
  User,
} from "../types/user";
import {
  getCurrentUser,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  updateUser,
} from "../services/mockApi";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  updateProfile: (
    changes: Pick<User, "fullName" | "phone" | "address">
  ) => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const authenticatedUser = await loginApi(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = async (data: RegisterData) => {
    const registeredUser = await registerApi(data);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  const updateProfile = async (
    changes: Pick<User, "fullName" | "phone" | "address">
  ) => {
    if (!user) {
      throw new Error("Bạn chưa đăng nhập");
    }

    const updatedUser = await updateUser(user.id, changes);
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }

  return context;
}