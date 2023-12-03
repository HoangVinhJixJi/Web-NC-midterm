// useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [emailRegistration, setEmailRegistration] = useState('');

  useEffect(() => {
    // Lấy thông tin đăng nhập từ localStorage 
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (email) => {
    setEmailRegistration(email);
  }

  const login = (token, userData) => {
    setIsLoggedIn(true);
    setUser(userData);

    // Lưu thông tin đăng nhập vào localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);

    // Xoá thông tin đăng nhập khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn,user,emailRegistration, register,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    return useContext(AuthContext);
};