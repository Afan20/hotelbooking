import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Aurora Hotel
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`
            }
          >
            Rooms
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`
            }
          >
            My Bookings
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
