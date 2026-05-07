import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const storedUser = getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuth(true);
            
            // Optionally fetch fresh user data
            const result = await authService.getCurrentUserProfile();
            if (result.success) {
              setUser(result.user);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.user);
        setIsAuth(true);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Errore durante la registrazione' };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        setUser(result.user);
        setIsAuth(true);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Errore durante il login' };
    }
  };

  // Auth0 callback handler
  const handleAuth0Callback = async (code) => {
    try {
      const result = await authService.handleAuth0Callback(code);
      if (result.success) {
        setUser(result.user);
        setIsAuth(true);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Errore durante l\'autenticazione Auth0' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuth(false);
    }
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const result = await authService.getCurrentUserProfile();
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Errore durante l\'aggiornamento del profilo' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: isAuth,
    isAdmin,
    register,
    login,
    logout,
    handleAuth0Callback,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

// Made with Bob
