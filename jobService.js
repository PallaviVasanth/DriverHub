import apiClient from './apiClient';

export const jobService = {
  list: (params) => apiClient.get('/jobs/', { params }).then(({ data }) => data),
  get: (jobId) => apiClient.get(`/jobs/${jobId}/`).then(({ data }) => data),
  apply: (jobId, payload) => apiClient.post(`/jobs/${jobId}/apply/`, payload).then(({ data }) => data),
};
