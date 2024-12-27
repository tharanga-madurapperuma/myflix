// ProtectedLayout.js (renamed from ProtectedRoute.js)
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "./Context/AuthContext";

const ProtectedLayout = () => {
  const { authToken } = useContext(AuthContext);

  if (!authToken) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;