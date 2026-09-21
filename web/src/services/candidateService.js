import apiClient from './apiClient';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export const candidateService = {
  getProfile: () => apiClient.get('/candidate/profile/').then(({ data }) => data),
  updateProfile: (payload) => apiClient.put('/candidate/profile/', payload, payload instanceof FormData ? multipart : undefined).then(({ data }) => data),
  getApplications: (params) => apiClient.get('/candidate/applications/', { params }).then(({ data }) => data),
};
