import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Container from "./Container.jsx";
import { getToken, clearToken } from "../auth/authStorage.js";

export default function Navbar() {
  const navigate = useNavigate();
  useLocation(); // ensures Navbar re-renders on navigation (login/logout)
  const token = getToken();
  const role = localStorage.getItem("hotel_staff_role");

  function logout() {
    clearToken();
    localStorage.removeItem("hotel_staff_role");
    navigate("/login");
  }

  return (
    <div className="border-b bg-white">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Aurora Hotel
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Home
            </Link>

            {token ? (
              <>
                <Link to="/rooms" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Rooms
                </Link>

                <Link to="/bookings" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  My Bookings
                </Link>

                {role === "admin" ? (
                 <>
                   <Link
                     to="/admin/bookings"
                     className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                   >
                     Admin Bookings
                   </Link>

                   <Link
                     to="/admin/rooms"
                     className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                     >
                     Admin Rooms
                   </Link>
                 </>
               ) : null}
                <button
                  onClick={logout}
                  className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Staff Login
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
