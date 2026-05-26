import axios from "axios";

const runtimeDefaultApiUrl =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? `${window.location.origin}/api`
    : "http://localhost:5000/api";

const envApiUrl = import.meta.env.VITE_API_URL || "";

export const API_URL = envApiUrl || runtimeDefaultApiUrl;

/** Host asli API (thumbnail /uploads/, dll). Wajib jika VITE_API_URL relatif mis. `/api` (dev + proxy). */
export const API_ORIGIN = (() => {
  const explicit = import.meta.env.VITE_PUBLIC_ORIGIN?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (typeof API_URL === "string" && API_URL.startsWith("http")) {
    return API_URL.replace(/\/api\/?$/, "");
  }
  if (typeof window !== "undefined") return window.location.origin;
  return "";
})();

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("mamuri_auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
