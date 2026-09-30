import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let refreshing = false;
let waiters: Array<(success: boolean) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const requestUrl = original?.url ?? "";
    const isAuthRequest = requestUrl.includes("/auth/");

    // Authentication endpoints can legitimately return 401 before a user is
    // logged in. Never try to refresh a session for those requests.
    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }
    if (refreshing) {
      return new Promise((resolve, reject) => {
        waiters.push((success) => success ? resolve(api(original)) : reject(error));
      });
    }
    original._retry = true;
    refreshing = true;
    try {
      await api.post("/auth/refresh-token");
      waiters.forEach((resolve) => resolve(true));
      waiters = [];
      return api(original);
    } catch (refreshError) {
      waiters.forEach((resolve) => resolve(false));
      waiters = [];
      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }
  },
);
