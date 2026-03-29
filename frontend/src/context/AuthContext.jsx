import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiCall } from '../utils/api';

// API handled in utils/api.js

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, isAuthenticated: false, loading: true });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await apiCall({ method: 'get', url: '/auth/me' });
          dispatch({ type: 'LOGIN_SUCCESS', payload: res });
        } catch (error) {
          console.error('Auth Init Error:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };
    initAuth();
  }, []);

  // Auth token handling via utils/api interceptors
  const login = async (credentials) => {
    const res = await apiCall({ method: 'post', url: '/auth/login', data: credentials });
    localStorage.setItem('token', res.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: res });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
