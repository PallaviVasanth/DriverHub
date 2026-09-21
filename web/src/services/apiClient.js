import axios from 'axios';
import { API_BASE_URL } from '../config/env';

const ACCESS_KEY = 'driverhub.access';
const REFRESH_KEY = 'driverhub.refresh';

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: ({ access, refresh }) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

const apiClient = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });

apiClient.interceptors.request.use((config) => {
  const access = tokenStore.getAccess();
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let refreshPromise = null;
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original?._retry || original?.url?.includes('/auth/token/refresh/')) {
      return Promise.reject(error);
    }
    const refresh = tokenStore.getRefresh();
    if (!refresh) {
      tokenStore.clear();
      return Promise.reject(error);
    }
    original._retry = true;
    refreshPromise ||= axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh });
    try {
      const { data } = await refreshPromise;
      tokenStore.set({ access: data.access });
      original.headers.Authorization = `Bearer ${data.access}`;
      return apiClient(original);
    } catch (refreshError) {
      tokenStore.clear();
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  },
);

export default apiClient;
