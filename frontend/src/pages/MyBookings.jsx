import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { fetchBookings } from "../api/bookingsApi.js";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchBookings();
        if (mounted) setBookings(data.bookings || []);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load bookings");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  return (
    <Container>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">
            All confirmed bookings created in this session.
          </p>
        </div>
        <Link
          to="/rooms"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          New booking
        </Link>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 text-sm text-slate-600">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="mt-6 rounded-2xl border bg-white p-6 text-sm text-slate-700">
          No bookings yet. Create one from the Rooms page.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-5 py-3 font-semibold">Booking ID</th>
                <th className="px-5 py-3 font-semibold">Guest</th>
                <th className="px-5 py-3 font-semibold">Room</th>
                <th className="px-5 py-3 font-semibold">Dates</th>
                <th className="px-5 py-3 font-semibold text-right">Total</th>
                <th className="px-5 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-5 py-4 font-medium text-slate-900">{b.id}</td>
                  <td className="px-5 py-4 text-slate-700">{b.guest.fullName}</td>
                  <td className="px-5 py-4 text-slate-700">{b.room.name}</td>
                  <td className="px-5 py-4 text-slate-700">
                    {b.stay.checkIn} → {b.stay.checkOut}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-900">
                    ${b.pricing.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/receipt/${b.id}`}
                      className="rounded-lg border px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Receipt
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
