import api, { handleApiError, saveUser, logout as apiLogout } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

// Register with email/password
export const register = async (userData) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH_REGISTER, userData);
    const { user, tokens } = response.data.data;

    // Save tokens and user
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    saveUser(user);

    return { success: true, user };
  } catch (error) {
    return { success: false, ...handleApiError(error) };
  }
};

// Login with email/password
export const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
    const { user, tokens } = response.data.data;

    // Save tokens and user
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    saveUser(user);

    return { success: true, user };
  } catch (error) {
    return { success: false, ...handleApiError(error) };
  }
};

// Auth0 callback handler
export const handleAuth0Callback = async (code) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH_AUTH0_CALLBACK, { code });
    const { user, tokens } = response.data.data;

    // Save tokens and user
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    saveUser(user);

    return { success: true, user };
  } catch (error) {
    return { success: false, ...handleApiError(error) };
  }
};

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.AUTH_ME);
    const user = response.data.data.user;

    // Update user in storage
    saveUser(user);

    return { success: true, user };
  } catch (error) {
    return { success: false, ...handleApiError(error) };
  }
};

// Logout
export const logout = async () => {
  try {
    await api.post(API_ENDPOINTS.AUTH_LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API call result
    apiLogout();
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post(API_ENDPOINTS.AUTH_REFRESH, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Save new tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

    return { success: true };
  } catch (error) {
    // If refresh fails, logout user
    apiLogout();
    return { success: false, ...handleApiError(error) };
  }
};

// Check if user is admin
export const isAdmin = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return false;
  
  try {
    const user = JSON.parse(userStr);
    return user.role === 'admin';
  } catch {
    return false;
  }
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return {
    isValid: minLength && hasUppercase && hasLowercase && hasNumber,
    errors: {
      minLength: !minLength ? 'La password deve contenere almeno 8 caratteri' : null,
      hasUppercase: !hasUppercase ? 'La password deve contenere almeno una lettera maiuscola' : null,
      hasLowercase: !hasLowercase ? 'La password deve contenere almeno una lettera minuscola' : null,
      hasNumber: !hasNumber ? 'La password deve contenere almeno un numero' : null,
    },
  };
};

// Validate username
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return {
    isValid: usernameRegex.test(username),
    error: !usernameRegex.test(username)
      ? 'Username deve contenere 3-30 caratteri (lettere, numeri, underscore)'
      : null,
  };
};

export default {
  register,
  login,
  handleAuth0Callback,
  getCurrentUserProfile,
  logout,
  refreshToken,
  isAdmin,
  validateEmail,
  validatePassword,
  validateUsername,
};

// Made with Bob
