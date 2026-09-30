import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentUser, logoutUser } from "../api/auth.api";
import type { User } from "../types/auth";

type AuthContextValue = { user: User | null; loading: boolean; setUser: (user: User | null) => void; logout: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCurrentUser().then(r => setUser(r.data ?? r)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);
  const value = useMemo(() => ({
    user, loading, setUser,
    logout: async () => { try { await logoutUser(); } finally { setUser(null); } },
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
}
