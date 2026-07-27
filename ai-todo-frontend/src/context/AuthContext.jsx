import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../services/api";
import * as authService from "../services/authServices";

const AuthContext = createContext(null);

function getStoredRefreshToken() {
  // Prefer session (non-persistent), fall back to local (remember me)
  return (
    sessionStorage.getItem("refreshToken") ||
    localStorage.getItem("refreshToken") ||
    null
  );
}

function storeRefreshToken(token, remember) {
  // Clear existing to avoid duplicates
  sessionStorage.removeItem("refreshToken");
  localStorage.removeItem("refreshToken");
  if (remember) {
    localStorage.setItem("refreshToken", token);
  } else {
    sessionStorage.setItem("refreshToken", token);
  }
}

function clearStoredTokens() {
  sessionStorage.removeItem("refreshToken");
  localStorage.removeItem("refreshToken");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const refreshToken = getStoredRefreshToken();
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
      clearStoredTokens();
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }

  function persistSession(data, remember = false) {
    setAccessToken(data.access_token);
    storeRefreshToken(data.refresh_token, remember);
    setUser(data.user);
  }

  async function login(credentials, { remember = false } = {}) {
    const { data } = await authService.login(credentials);
    persistSession(data, remember);
    return data;
  }

  async function signup(payload, { remember = false } = {}) {
    const { data } = await authService.signup(payload);
    persistSession(data, remember);
    return data;
  }

  function logout() {
    setAccessToken(null);
    clearStoredTokens();
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
