import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { fetchBookings, cancelBooking, checkoutBooking } from "../api/bookingsApi.js";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);

  async function loadBookings() {
    try {
      setError("");
      setLoading(true);
      const data = await fetchBookings();
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (e) {
      setError(e.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function statusBadgeClass(status) {
    const s = String(status || "").trim().toLowerCase();
    if (s === "confirmed") return "bg-emerald-50 text-emerald-700";
    if (s === "checked_out") return "bg-blue-50 text-blue-700";
    return "bg-slate-100 text-slate-700";
  }

  async function onCancel(id) {
    const ok = window.confirm("Cancel this booking?");
    if (!ok) return;

    try {
      setError("");
      setCancellingId(id);

      const res = await cancelBooking(id);
      const updated = res.booking;

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: updated.status } : b))
      );
    } catch (e) {
      setError(e.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  }

  async function onCheckout(id) {
    const ok = window.confirm("Checkout this booking?");
    if (!ok) return;

    try {
      setError("");
      setCheckoutId(id);

      const res = await checkoutBooking(id);

      if (res?.booking) {
        setBookings((prev) => prev.map((b) => (b.id === id ? res.booking : b)));
      } else {
        // fallback if backend returns ok:true only
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "checked_out" } : b))
        );
      }
    } catch (e) {
      setError(e.message || "Failed to checkout booking");
    } finally {
      setCheckoutId(null);
    }
  }

  return (
    <Container>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">
            All bookings stored in the system.
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
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Total</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const status = String(b.status || "").trim().toLowerCase();
                const isConfirmed = status === "confirmed";
                const isCancelling = cancellingId === b.id;
                const isCheckingOut = checkoutId === b.id;

                return (
                  <tr key={b.id} className="border-t">
                    <td className="px-5 py-4 font-medium text-slate-900">{b.id}</td>
                    <td className="px-5 py-4 text-slate-700">{b.guest.fullName}</td>
                    <td className="px-5 py-4 text-slate-700">{b.room.name}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {b.stay.checkIn} → {b.stay.checkOut}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold " +
                          statusBadgeClass(b.status)
                        }
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900">
                      ${Number(b.pricing?.total || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <Link
                        to={`/receipt/${b.id}`}
                        className="inline-block rounded-lg border px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        Receipt
                      </Link>

                      {isConfirmed ? (
                        <>
                          <button
                            onClick={() => onCheckout(b.id)}
                            disabled={isCheckingOut || isCancelling}
                            className="inline-block rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                          >
                            {isCheckingOut ? "Checking out…" : "Checkout"}
                          </button>

                          <button
                            onClick={() => onCancel(b.id)}
                            disabled={isCancelling || isCheckingOut}
                            className="inline-block rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                          >
                            {isCancelling ? "Cancelling…" : "Cancel"}
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
