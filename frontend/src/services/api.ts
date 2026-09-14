import axios from 'axios';

export const API_BASE_URL = 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hospital_pro_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
