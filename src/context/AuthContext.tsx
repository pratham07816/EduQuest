import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { setAuthToken } from "../services/api";

/* ================= TYPES ================= */
type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
  login: (data: any) => void;
  logout: () => void;
};

/* ================= CONTEXT ================= */
const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<any>(null);

  /* ================= LOAD USER ON APP START ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("activeUserId");

    if (!token || !userId) return;

    // 🔥 ensure axios uses correct token on refresh
    setAuthToken(token);

    const storedUser = localStorage.getItem(`user_${userId}`);
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  /* ================= PERSIST USER PER ID ================= */
  useEffect(() => {
    if (!user?._id) return;

    localStorage.setItem(`user_${user._id}`, JSON.stringify(user));
    localStorage.setItem("activeUserId", user._id);
  }, [user]);

  /* ================= LOGIN ================= */
  const login = ({ token, user }: any) => {
    const userWithDefaults = {
      ...user,
      progress: {
        xp: user.progress?.xp ?? 0,
        level: user.progress?.level ?? 1,
        quizzesCompleted: user.progress?.quizzesCompleted ?? 0,
        totalScore: user.progress?.totalScore ?? 0,
      },
      badges: user.badges ?? [],
    };

    // 🔐 store token
    localStorage.setItem("token", token);

    // 🔥 CRITICAL: update axios token for THIS user
    setAuthToken(token);

    // 👤 store user per ID
    localStorage.setItem("activeUserId", user._id);
    localStorage.setItem(
      `user_${user._id}`,
      JSON.stringify(userWithDefaults)
    );

    setUserState(userWithDefaults);
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    // ❌ remove auth data
    localStorage.removeItem("token");
    localStorage.removeItem("activeUserId");

    // 🔥 CRITICAL: remove token from axios
    setAuthToken(null);

    setUserState(null);
  };

  /* ================= UPDATE USER (FROM BACKEND) ================= */
  const setUser = (updatedUserorFn: any) => {
    setUserState(updatedUserorFn);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
