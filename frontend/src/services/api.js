import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('afrilens_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('afrilens_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
