import axios from "axios";
import { toast } from "sonner";
import { API_BASE, TOKEN_KEY, USER_KEY } from "./auth";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

/* Every request to a protected endpoint carries the stored JWT. */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* When the server rejects our JWT the stale session is dropped right away. */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("sebak:auth-expired"));
      if (!window.location.pathname.startsWith("/login")) {
        toast.error("Your session has expired. Please log in again.");
      }
    }
    return Promise.reject(error);
  }
);
