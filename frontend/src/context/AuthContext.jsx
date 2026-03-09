import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check valid token & fetch user profile on app load
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/profile');
          setUser(res.data.user);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { id: email, password });
    localStorage.setItem('token', res.data.token);
    // After login, fetch and set the user profile
    const profileRes = await api.get('/profile');
    setUser(profileRes.data.user);
  };

  const register = async (email, password) => {
    // The backend expects id and password
    const res = await api.post('/auth/register', { id: email, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
