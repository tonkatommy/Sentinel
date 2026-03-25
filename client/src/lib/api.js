import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach stored token on init
const token = localStorage.getItem('sentinel_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
