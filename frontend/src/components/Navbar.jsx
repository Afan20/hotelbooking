import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Container from "./Container.jsx";
import { getToken, clearToken } from "../auth/authStorage.js";

function navClass({ isActive }) {
  return (
    "rounded-lg px-3 py-2 text-sm font-medium transition " +
    (isActive
      ? "bg-emerald-50 text-emerald-800"
      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900")
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();
  const role = (localStorage.getItem("hotel_staff_role") || "").toLowerCase();

  function logout() {
    clearToken();
    localStorage.removeItem("hotel_staff_role");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight text-slate-900">
                Wah Continental Hotel
              </div>
              <div className="text-xs text-slate-500">Staff Console</div>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            {token ? (
              <>
                <NavLink to="/rooms" className={navClass}>
                  Rooms
                </NavLink>

                <NavLink to="/bookings" className={navClass}>
                  My Bookings
                </NavLink>

                {role === "admin" ? (
                  <>
                    <NavLink to="/admin/bookings" className={navClass}>
                      Admin Bookings
                    </NavLink>
                    <NavLink to="/admin/rooms" className={navClass}>
                      Admin Rooms
                    </NavLink>
                  </>
                ) : null}

                <button
                  onClick={logout}
                  className="ml-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Staff Login
              </Link>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
