import api from "./api";

export const signup = (data) => api.post("/auth/signup", data);

export const login = (data) => api.post("/auth/login", data);

export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

export const resetPassword = (data) => api.post("/auth/reset-password", data);

export const refreshAccessToken = (refreshToken) =>
  api.post("/auth/refresh", null, { params: { refresh_token: refreshToken } });

export const getCurrentUser = () => api.get("/auth/me");