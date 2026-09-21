import apiClient from './apiClient';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export const employerService = {
  getProfile: () => apiClient.get('/employer/profile/').then(({ data }) => data),
  updateProfile: (payload) => apiClient.put('/employer/profile/', payload, payload instanceof FormData ? multipart : undefined).then(({ data }) => data),
  listJobs: () => apiClient.get('/employer/jobs/').then(({ data }) => data),
  createJob: (payload) => apiClient.post('/employer/jobs/', payload).then(({ data }) => data),
  updateJob: (jobId, payload) => apiClient.put(`/employer/jobs/${jobId}/`, payload).then(({ data }) => data),
  closeJob: (jobId) => apiClient.delete(`/employer/jobs/${jobId}/`),
  listApplications: () => apiClient.get('/employer/applications/').then(({ data }) => data),
  getApplication: (applicationId) => apiClient.get(`/employer/applications/${applicationId}/`).then(({ data }) => data),
  updateApplicationStatus: (applicationId, status) => apiClient.patch(`/employer/applications/${applicationId}/status/`, { status }).then(({ data }) => data),
  searchCandidates: (params) => apiClient.get('/employer/candidates/', { params }).then(({ data }) => data),
  getCandidate: (candidateId) => apiClient.get(`/employer/candidates/${candidateId}/`).then(({ data }) => data),
  contactCandidate: (applicationId) => apiClient.get(`/employer/applications/${applicationId}/contact/`).then(({ data }) => data),
};
