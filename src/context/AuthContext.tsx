import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Types from '../Types'

interface AuthContextType {
  user: Types.IUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Types.IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    // This could be checking localStorage, cookies, or a token validation API
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // Example: Check if there's a token in localStorage
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Validate token with your API or decode JWT
          // For now, we'll just simulate a logged-in user
          setUser({
            id: '1',
            email: 'user@example.com'
          });
        }
      } catch (err) {
        setError('Failed to authenticate');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(email, password)
      // Implement your login logic here
      // Example: API call to authenticate user
      // const response = await api.login(email, password);
      
      // For now, we'll simulate a successful login
      const mockUser = {
        id: '1',
        email
      };
      
      // Store authentication token
      localStorage.setItem('authToken', 'mock-token');
      
      setUser(mockUser);
    } catch (err) {
      setError('Failed to login');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(email, password)
      // Implement your registration logic here
      // Example: API call to register user
      // const response = await api.register(email, password);
      
      // For now, we'll simulate a successful registration
      const mockUser = {
        id: '2',
        email
      };
      
      // Store authentication token
      localStorage.setItem('authToken', 'mock-token');
      
      setUser(mockUser);
    } catch (err) {
      setError('Failed to register');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Implement your logout logic here
      // Example: API call to invalidate token
      // await api.logout();
      
      // Remove authentication token
      localStorage.removeItem('authToken');
      
      setUser(null);
    } catch (err) {
      setError('Failed to logout');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement your password reset logic here
      // Example: API call to send password reset email
      // await api.resetPassword(email);
      
      // For now, we'll just simulate a successful request
      console.log(`Password reset email sent to ${email}`);
    } catch (err) {
      setError('Failed to reset password');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
