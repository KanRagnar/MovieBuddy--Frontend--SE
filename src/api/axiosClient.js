import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Attach stored token & user ID automatically to every outgoing request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('moviebuddy_token');
  const storedUser = localStorage.getItem('moviebuddy_user');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed?.id) {
        config.headers['x-user-id'] = String(parsed.id);
      }
    } catch {
      // Ignore malformed storage
    }
  }
  return config;
});

// Normalize backend responses & errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const serverMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Network error communicating with backend';
    return Promise.reject(new Error(serverMessage));
  }
);

export default axiosClient;
