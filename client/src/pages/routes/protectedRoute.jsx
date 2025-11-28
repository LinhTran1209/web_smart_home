import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../utils/jwt.js";

// trang cần đăng nhập mới vào được
export const RequireAuth = ({ redirectTo = "/signin" }) => {
  const location = useLocation();
  const ok = isAuthenticated();

  if (!ok) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return <Outlet />;
};

// trang auth (signin/register/forgot...) 
// nếu đã login thì đá sang trang home
export const RequireGuest = ({ redirectTo = "/home" }) => {
  const ok = isAuthenticated();

  if (ok) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};