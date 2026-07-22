import api from "./api";

export const getTasks = (params = {}) => api.get("/tasks", { params });

export const createTask = (data) => api.post("/tasks", data);

export const updateTask = (taskId, data) => api.patch(`/tasks/${taskId}`, data);

export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);