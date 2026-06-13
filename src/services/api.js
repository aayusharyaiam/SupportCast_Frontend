import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    const apiError = error.response?.data?.error;
    const normalized = new Error(apiError?.message || error.message || 'An error occurred');
    normalized.code = apiError?.code;
    normalized.details = apiError?.details;
    return Promise.reject(normalized);
  }
);

export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  logout: () =>
    api.post('/auth/logout'),
};

export const sessionAPI = {
  create: () =>
    api.post('/sessions'),
  list: (params) =>
    api.get('/sessions', { params }),
  get: (id) =>
    api.get(`/sessions/${id}`),
  delete: (id) =>
    api.delete(`/sessions/${id}`),
  join: (token, displayName) =>
    api.post('/sessions/join', { token, displayName }),
  getChat: (id) =>
    api.get(`/sessions/${id}/chat`),
  getRecording: (id) =>
    api.get(`/sessions/${id}/recording`),
};

export const adminAPI = {
  getLiveSessions: () =>
    api.get('/admin/sessions/live'),
  getSessionHistory: (params) =>
    api.get('/admin/sessions/history', { params }),
  getSession: (id) =>
    api.get(`/sessions/${id}`),
  forceEndSession: (id) =>
    api.delete(`/admin/sessions/${id}`),
};

export const systemAPI = {
  health: () =>
    axios.get(import.meta.env.VITE_API_URL + '/health'),
  metrics: () =>
    axios.get(import.meta.env.VITE_API_URL + '/metrics'),
};

export default api;
