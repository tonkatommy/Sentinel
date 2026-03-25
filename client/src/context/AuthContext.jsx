import { createContext, useContext, useState } from 'react';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sentinel_user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(service_number, password) {
    const { data } = await api.post('/auth/login', { service_number, password });
    localStorage.setItem('sentinel_token', data.token);
    localStorage.setItem('sentinel_user', JSON.stringify(data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('sentinel_token');
    localStorage.removeItem('sentinel_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
