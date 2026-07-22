import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../services/api";
import * as authService from "../services/authServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await authService.refreshAccessToken(refreshToken);
      setAccessToken(data.access_token);
      const me = await authService.getCurrentUser();
      setUser(me.data);
    } catch {
      localStorage.removeItem("refreshToken");
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }

  function persistSession(data) {
    setAccessToken(data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    setUser(data.user);
  }

  async function login(credentials) {
    const { data } = await authService.login(credentials);
    persistSession(data);
    return data;
  }

  async function signup(payload) {
    const { data } = await authService.signup(payload);
    persistSession(data);
    return data;
  }

  function logout() {
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}