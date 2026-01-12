import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import Rooms from "./pages/Rooms.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Receipt from "./pages/Receipt.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Login from "./pages/Login.jsx";

import RequireAuth from "./auth/RequireAuth.jsx";
import RequireRole from "./auth/RequireRole.jsx"; // ✅ add
import AdminRooms from "./pages/AdminRooms.jsx"; // ✅ add

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected (staff only) */}
        <Route
          path="/rooms"
          element={
            <RequireAuth>
              <Rooms />
            </RequireAuth>
          }
        />

        {/* ✅ Protected (admin only) */}
        <Route
          path="/admin/rooms"
          element={
            <RequireAuth>
              <RequireRole roles={["admin"]}>
                <AdminRooms />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/confirmation/:bookingId"
          element={
            <RequireAuth>
              <Confirmation />
            </RequireAuth>
          }
        />
        <Route
          path="/receipt/:bookingId"
          element={
            <RequireAuth>
              <Receipt />
            </RequireAuth>
          }
        />
        <Route
          path="/bookings"
          element={
            <RequireAuth>
              <MyBookings />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
