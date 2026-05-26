import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("mamuri_auth");
    return raw ? JSON.parse(raw) : { token: null, user: null };
  });

  useEffect(() => {
    localStorage.setItem("mamuri_auth", JSON.stringify(auth));
  }, [auth]);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    setAuth(data);
    return data;
  };

  const logout = () => setAuth({ token: null, user: null });

  const updateSession = useCallback((data) => {
    setAuth({ token: data.token, user: data.user });
  }, []);

  const value = useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth.token),
      login,
      logout,
      updateSession,
    }),
    [auth, updateSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

