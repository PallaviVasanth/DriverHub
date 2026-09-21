import apiClient, { tokenStore } from './apiClient';

export const authService = {
  async login(payload) {
    const { data } = await apiClient.post('/auth/login/', payload);
    tokenStore.set(data);
    return data;
  },
  async register(payload) {
    const { data } = await apiClient.post('/auth/register/', payload);
    tokenStore.set(data.tokens);
    return data;
  },
  async me() {
    const { data } = await apiClient.get('/auth/me/');
    return data;
  },
  logout() {
    tokenStore.clear();
  },
};
