import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../Api/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Access navigation for redirection

  // Persist token to localStorage and sync state
  const saveAuthToken = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  // Remove token from localStorage and reset state
  const clearAuthToken = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
  };

  // Login function
  const login = (token) => {
    saveAuthToken(token);
    navigate('/'); // Redirect to home after successful login
  };

  // Signup function
  const signup = (token) => {
    saveAuthToken(token);
    navigate('/auth/login'); // Redirect to login after successful signup
  };

  // Logout function
  const logout = () => {
    clearAuthToken();
    navigate('/auth/login'); // Redirect to login after logout
  };

  // Optional: Fetch user data when a token is present
  useEffect(() => {
    if (authToken) {
      fetchUserData();
    }
  }, [authToken]);

  const fetchUserData = async () => {
    try {
      const data = await getUserDetails(); 
     
      setUser(data.user); // Set the user data in state
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        setUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
