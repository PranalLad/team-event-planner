// frontend/src/services/api.ts
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE ?? "https://localhost:59497";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let tenantId: string | null = null;

export function setTenantId(id: string) {
  tenantId = id;
}

axiosInstance.interceptors.request.use(config => {
  if (tenantId) {
    config.headers = config.headers ?? {};
    config.headers["X-Tenant-ID"] = tenantId;
  }
  return config;
});

export default axiosInstance;
