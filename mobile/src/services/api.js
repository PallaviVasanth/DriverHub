import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const accessKey = 'driverhub.access';
const refreshKey = 'driverhub.refresh';
export const tokens = { get: async () => ({ access: await SecureStore.getItemAsync(accessKey), refresh: await SecureStore.getItemAsync(refreshKey) }), set: async ({ access, refresh }) => { if (access) await SecureStore.setItemAsync(accessKey, access); if (refresh) await SecureStore.setItemAsync(refreshKey, refresh); }, clear: async () => { await SecureStore.deleteItemAsync(accessKey); await SecureStore.deleteItemAsync(refreshKey); } };
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use(async (config) => { const { access } = await tokens.get(); if (access) config.headers.Authorization = `Bearer ${access}`; return config; });
let refreshing;
api.interceptors.response.use((r) => r, async (error) => { const original = error.config; if (error.response?.status !== 401 || original?._retry || original?.url?.includes('/auth/token/refresh/')) return Promise.reject(error); const { refresh } = await tokens.get(); if (!refresh) return Promise.reject(error); original._retry = true; refreshing ||= api.post('/auth/token/refresh/', { refresh }); try { const { data } = await refreshing; await tokens.set({ access: data.access }); original.headers.Authorization = `Bearer ${data.access}`; return api(original); } catch (e) { await tokens.clear(); return Promise.reject(e); } finally { refreshing = null; } });
export function apiError(error) { return error?.response?.data?.error?.message || error?.response?.data?.detail || (error?.response?.status === 409 ? 'You have already applied to this job.' : 'Something went wrong. Please try again.'); }
export default api;
