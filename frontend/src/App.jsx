import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Rooms from "./pages/Rooms.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Receipt from "./pages/Receipt.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Login from "./pages/Login.jsx";

import AdminRooms from "./pages/AdminRooms.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";

import RequireAuth from "./auth/RequireAuth.jsx";
import RequireRole from "./auth/RequireRole.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F6F5F2] text-slate-900">
      <Navbar />

      <main className="min-h-[calc(100vh-140px)]">
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

          {/* Admin-only */}
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
            path="/admin/bookings"
            element={
              <RequireAuth>
                <RequireRole roles={["admin"]}>
                  <AdminBookings />
                </RequireRole>
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
