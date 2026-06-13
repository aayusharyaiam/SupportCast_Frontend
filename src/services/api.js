import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('socketToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (payload && typeof payload === 'object' && 'pagination' in payload) {
      return { data: payload.data, pagination: payload.pagination };
    }
    return payload.data ?? payload;
  },
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
  getFileSignedUrl: (id, { fileName, fileType, fileSize }) =>
    api.post(`/sessions/${id}/files/signed-url`, { fileName, fileType, fileSize }),
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
  createAgent: ({ email, password, displayName, role }) =>
    api.post('/admin/agents', { email, password, displayName, role }),
  getAgents: () =>
    api.get('/admin/agents'),
  deleteAgent: (id) =>
    api.delete(`/admin/agents/${id}`),
};

export const systemAPI = {
  health: () =>
    axios.get(import.meta.env.VITE_API_URL + '/health'),
  metrics: () =>
    axios.get(import.meta.env.VITE_API_URL + '/metrics'),
};

export default api;
