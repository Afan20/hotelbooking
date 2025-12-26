import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import { fetchBooking } from "../api/bookingsApi.js";

export default function Confirmation() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchBooking(bookingId);
        if (mounted) setBooking(data.booking);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load booking");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [bookingId]);

  return (
    <Container>
      {loading ? <div className="text-sm text-slate-600">Loading confirmation…</div> : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {booking ? (
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">Booking confirmed</h1>
            <p className="text-sm text-slate-600">
              Your booking ID is <span className="font-semibold text-slate-900">{booking.id}</span>.
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">{booking.room.name}</div>
            <div className="mt-1 text-sm text-slate-700">
              {booking.stay.checkIn} → {booking.stay.checkOut} • Guests: {booking.stay.guests}
            </div>
            <div className="mt-1 text-sm text-slate-700">
              Total: <span className="font-semibold">${booking.pricing.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/receipt/${booking.id}`}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View receipt
            </Link>
            <Link
              to="/rooms"
              className="rounded-xl border bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Book another room
            </Link>
          </div>
        </div>
      ) : null}
    </Container>
  );
}
