import axios from 'axios';
import { API_URL, STORAGE_KEYS, TOAST_MESSAGES } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          // Save new tokens
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || TOAST_MESSAGES.ERROR.GENERIC;
    
    // You can add toast notification here
    console.error('API Error:', errorMessage);

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const message = error.response.data?.message || TOAST_MESSAGES.ERROR.GENERIC;

    switch (status) {
      case 400:
        return { error: message, status };
      case 401:
        return { error: TOAST_MESSAGES.ERROR.UNAUTHORIZED, status };
      case 403:
        return { error: 'Accesso negato', status };
      case 404:
        return { error: 'Risorsa non trovata', status };
      case 500:
        return { error: 'Errore del server', status };
      default:
        return { error: message, status };
    }
  } else if (error.request) {
    // Request made but no response
    return { error: TOAST_MESSAGES.ERROR.NETWORK, status: 0 };
  } else {
    // Something else happened
    return { error: error.message || TOAST_MESSAGES.ERROR.GENERIC, status: 0 };
  }
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// Helper function to get current user from storage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

// Helper function to save user to storage
export const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

// Helper function to logout
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Admin API - Get tournament statistics
export const getTournamentStatistics = async () => {
  try {
    const response = await api.get('/admin/stats/tournament');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default api;

// Made with Bob
