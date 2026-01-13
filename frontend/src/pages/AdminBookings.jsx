import React, { useEffect, useMemo, useState } from "react";
import Container from "../components/Container.jsx";
import {
  adminFetchBookings,
  adminEditBooking,
  adminCheckoutBooking,
} from "../api/adminApi.js";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [checkoutId, setCheckoutId] = useState(null);

  async function loadBookings() {
    try {
      setError("");
      setLoading(true);
      const data = await adminFetchBookings();
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (e) {
      setError(e.message || "Failed to load admin bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function statusBadgeClass(status) {
    if (status === "confirmed") return "bg-emerald-50 text-emerald-700";
    if (status === "checked_out") return "bg-blue-50 text-blue-700";
    return "bg-slate-100 text-slate-700";
  }

  const editingBooking = useMemo(() => {
    if (!editId) return null;
    return bookings.find((b) => b.id === editId) || null;
  }, [bookings, editId]);

  function openEdit(b) {
    setError("");
    setEditId(b.id);
    setEditCheckIn(b?.stay?.checkIn || "");
    setEditCheckOut(b?.stay?.checkOut || "");
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setEditId(null);
    setEditCheckIn("");
    setEditCheckOut("");
    setSavingEdit(false);
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editId) return;

    if (!editCheckIn || !editCheckOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    try {
      setError("");
      setSavingEdit(true);

      const res = await adminEditBooking(editId, {
        checkIn: editCheckIn,
        checkOut: editCheckOut,
      });

      if (res?.booking) {
        setBookings((prev) =>
          prev.map((x) => (x.id === editId ? res.booking : x))
        );
      } else {
        // backend returned ok:true only
        await loadBookings();
      }

      closeEdit();
    } catch (e2) {
      setError(e2.message || "Failed to edit booking");
      setSavingEdit(false);
    }
  }

  async function onCheckout(b) {
    const ok = window.confirm(`Checkout booking #${b.id}?`);
    if (!ok) return;

    try {
      setError("");
      setCheckoutId(b.id);

      const res = await adminCheckoutBooking(b.id);

      if (res?.booking) {
        setBookings((prev) => prev.map((x) => (x.id === b.id ? res.booking : x)));
      } else {
        // fallback if backend returns ok:true only
        setBookings((prev) =>
          prev.map((x) => (x.id === b.id ? { ...x, status: "checked_out" } : x))
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
          <h1 className="text-2xl font-semibold text-slate-900">Admin Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Admin-only booking management: edit dates and checkout.
          </p>
        </div>
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
          No bookings found.
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
                const isConfirmed = b.status === "confirmed";
                const isCheckingOut = checkoutId === b.id;

                return (
                  <tr key={b.id} className="border-t">
                    <td className="px-5 py-4 font-medium text-slate-900">{b.id}</td>
                    <td className="px-5 py-4 text-slate-700">{b.guest?.fullName}</td>
                    <td className="px-5 py-4 text-slate-700">{b.room?.name}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {b.stay?.checkIn} → {b.stay?.checkOut}
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
                      {isConfirmed ? (
                        <>
                          <button
                            onClick={() => openEdit(b)}
                            className="inline-block rounded-lg border px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => onCheckout(b)}
                            disabled={isCheckingOut}
                            className="inline-block rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                          >
                            {isCheckingOut ? "Checking out…" : "Checkout"}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Booking</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Booking #{editingBooking?.id} — update check-in/check-out dates.
                </p>
              </div>
              <button
                onClick={closeEdit}
                className="rounded-lg border px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={saveEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Check-in
                </label>
                <input
                  type="date"
                  value={editCheckIn}
                  onChange={(e) => setEditCheckIn(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Check-out
                </label>
                <input
                  type="date"
                  value={editCheckOut}
                  onChange={(e) => setEditCheckOut(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={savingEdit}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {savingEdit ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </Container>
  );
}
