import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type UserSession, authManager } from "../utils/auth";

interface AuthContextValue {
  userSession: UserSession | null;
  setUserSession: (session: UserSession | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const session = authManager.getCurrentSession();
    setUserSession(session);
  }, []);

  // Listen for balance updates
  useEffect(() => {
    const handler = () => setUserSession(authManager.getCurrentSession());
    window.addEventListener("balanceUpdate", handler as any);
    return () => window.removeEventListener("balanceUpdate", handler as any);
  }, []);

  return (
    <AuthContext.Provider value={{ userSession, setUserSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export interface SocketContextType {
  socket: import("socket.io-client").Socket | null;
}

export const SocketContext = React.createContext<SocketContextType>({
  socket: null,
});
