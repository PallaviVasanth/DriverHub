export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const response = error?.response;
  if (!response) return 'Network error. Check your connection and try again.';
  if (response.data?.error?.message) return response.data.error.message;
  if (response.data?.detail) return response.data.detail;
  if (response.status === 401) return 'Your session has expired. Please log in again.';
  if (response.status === 403) return 'You do not have permission to perform this action.';
  if (response.status === 404) return 'The requested resource was not found.';
  if (response.status === 409) return 'This request conflicts with existing data.';
  return fallback;
}
