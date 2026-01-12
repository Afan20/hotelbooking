import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireRole({ roles = [], children }) {
  const role = localStorage.getItem("hotel_staff_role");

  if (!role || !roles.includes(role)) {
    return <Navigate to="/rooms" replace />;
  }

  return children;
}
