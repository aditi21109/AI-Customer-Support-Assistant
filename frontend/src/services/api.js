import axios from 'axios';

// Dynamically read backend server base endpoint from .env variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor:
// Dynamically runs before every request to attach the JWT token if present.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor:
// Handles common failures globally (e.g. JWT token expiration).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns a 401 Unauthorized, automatically log out
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page if we are in browser environment
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- SERVICE API WRAPPERS ---

export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const chatService = {
  sendMessage: async (message) => {
    const response = await api.post('/chat', { message });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/chat/history');
    return response.data;
  },
};

export const ticketService = {
  createTicket: async (title, description, priority) => {
    const response = await api.post('/tickets', { title, description, priority });
    return response.data;
  },
  getTickets: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },
  updateTicket: async (ticketId, status, priority) => {
    const response = await api.put(`/tickets/${ticketId}`, { status, priority });
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
};

export default api;
