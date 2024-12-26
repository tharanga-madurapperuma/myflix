import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authToken) {
      // Optionally fetch user data from backend if token exists
    //   fetchUserData();
    }
  }, [authToken]);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    // Optionally fetch user data from backend and set user
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
  };

//   const fetchUserData = async () => {
//     try {
//       const response = await fetch('/api/user', {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });
//       const data = await response.json();
//       setUser(data);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
