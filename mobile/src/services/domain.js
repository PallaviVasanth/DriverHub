import api from './api';
export const jobs = { list: (params) => api.get('/jobs/', { params }).then((r) => r.data), get: (id) => api.get(`/jobs/${id}/`).then((r) => r.data), apply: (id, payload) => api.post(`/jobs/${id}/apply/`, payload).then((r) => r.data) };
export const candidate = { profile: () => api.get('/candidate/profile/').then((r) => r.data), update: (data) => api.put('/candidate/profile/', data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined).then((r) => r.data), applications: () => api.get('/candidate/applications/').then((r) => r.data) };
export const notifications = { list: () => api.get('/notifications/').then((r) => r.data), read: (id) => api.patch(`/notifications/${id}/read/`).then((r) => r.data) };
