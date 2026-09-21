import apiClient from './apiClient';

export const notificationService = {
  list: (params) => apiClient.get('/notifications/', { params }).then(({ data }) => data),
  markRead: (notificationId) => apiClient.patch(`/notifications/${notificationId}/read/`).then(({ data }) => data),
};

export const adminService = {
  dashboard: () => apiClient.get('/admin/dashboard/').then(({ data }) => data),
  candidates: () => apiClient.get('/admin/candidates/').then(({ data }) => data),
  updateCandidateActive: (id, is_active) => apiClient.patch(`/admin/candidates/${id}/`, { is_active }).then(({ data }) => data),
  employers: () => apiClient.get('/admin/employers/').then(({ data }) => data),
  updateEmployerActive: (id, is_active) => apiClient.patch(`/admin/employers/${id}/`, { is_active }).then(({ data }) => data),
  jobs: () => apiClient.get('/admin/jobs/').then(({ data }) => data),
  updateJob: (id, payload) => apiClient.patch(`/admin/jobs/${id}/`, payload).then(({ data }) => data),
  applications: () => apiClient.get('/admin/applications/').then(({ data }) => data),
  updateApplication: (id, payload) => apiClient.patch(`/admin/applications/${id}/`, payload).then(({ data }) => data),
};
