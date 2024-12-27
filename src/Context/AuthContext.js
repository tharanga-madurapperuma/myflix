import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    // try {
    //   const response = await fetch('/api/user', {
    //     headers: {
    //       Authorization: `Bearer ${authToken}`,
    //     },
    //   });
    //   if (response.ok) {
    //     const data = await response.json();
    //     setUser(data);
    //   } else {
    //     console.error('Failed to fetch user data');
    //     logout(); // Logout if token is invalid or expired
    //   }
    // } catch (error) {
    //   console.error('Error fetching user data:', error);
    //   logout();
    // }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
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
