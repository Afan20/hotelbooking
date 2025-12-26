import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Rooms from "./pages/Rooms.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Receipt from "./pages/Receipt.jsx";
import MyBookings from "./pages/MyBookings.jsx";


export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/confirmation/:bookingId" element={<Confirmation />} />
        <Route path="/receipt/:bookingId" element={<Receipt />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
