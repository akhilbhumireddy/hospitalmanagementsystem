import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('hospitalUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('hospitalUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('hospitalUser', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hospitalUser');
    toast.info('You have been logged out successfully.');
  };

  const register = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('hospitalUser', JSON.stringify(userData));
    toast.success(`Welcome to our platform, ${userData.name}!`);
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...currentUser, ...updatedData };
    setCurrentUser(newUserData);
    localStorage.setItem('hospitalUser', JSON.stringify(newUserData));
    toast.success('Profile updated successfully!');
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 