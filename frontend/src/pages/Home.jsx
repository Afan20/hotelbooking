import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

export default function Home() {
  return (
    <Container>
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="grid md:grid-cols-2">
          <div className="p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Simple, clean hotel bookings.
            </h1>
            <p className="mt-3 text-slate-600">
              Browse rooms, select dates, confirm a booking, and generate a receipt. Built as a clean
              full-stack template that can be made dynamic later (database + auth).
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/rooms"
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                View rooms
              </Link>
              <a
                href="http://localhost:8080/api/health"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                API health
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["10 rooms", "Hardcoded backend data"],
                ["Booking flow", "Dates + guest info"],
                ["Receipt", "Printable confirmation"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">{t}</div>
                  <div className="mt-1 text-xs text-slate-600">{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-72 md:h-auto">
            <img
              className="h-full w-full object-cover"
              alt="Hotel lobby"
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
