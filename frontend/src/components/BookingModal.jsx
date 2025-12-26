import React, { useMemo, useState } from "react";

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

export default function BookingModal({ open, room, onClose, onConfirm }) {
  const today = useMemo(() => toISODate(new Date()), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: today,
    checkOut: tomorrow,
    guests: 1,
    specialRequests: "",
  });

  const [error, setError] = useState("");

  if (!open || !room) return null;

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function validate() {
    if (!form.fullName || !form.email || !form.phone) return "Please fill guest details.";
    if (!form.checkIn || !form.checkOut) return "Please select dates.";
    if (form.checkOut <= form.checkIn) return "Check-out must be after check-in.";
    if (Number(form.guests) < 1) return "Guests must be at least 1.";
    if (Number(form.guests) > room.capacity) return `Max guests for this room is ${room.capacity}.`;
    return "";
  }

  async function submit() {
    const msg = validate();
    if (msg) return setError(msg);
    setError("");
    await onConfirm({
      roomId: room.id,
      ...form,
      guests: Number(form.guests),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Book: {room.name}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {room.type} • Sleeps {room.capacity} • ${room.pricePerNight}/night
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Guest details</h3>

            <label className="block">
              <span className="text-xs text-slate-600">Full Name</span>
              <input
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="e.g., Muhammad Afan"
              />
            </label>

            <label className="block">
              <span className="text-xs text-slate-600">Email</span>
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="name@email.com"
              />
            </label>

            <label className="block">
              <span className="text-xs text-slate-600">Phone</span>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="+92..."
              />
            </label>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Stay details</h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-slate-600">Check-in</span>
                <input
                  type="date"
                  value={form.checkIn}
                  min={today}
                  onChange={(e) => update("checkIn", e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <label className="block">
                <span className="text-xs text-slate-600">Check-out</span>
                <input
                  type="date"
                  value={form.checkOut}
                  min={form.checkIn}
                  onChange={(e) => update("checkOut", e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs text-slate-600">Guests</span>
              <input
                type="number"
                value={form.guests}
                min={1}
                max={room.capacity}
                onChange={(e) => update("guests", e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="block">
              <span className="text-xs text-slate-600">Special Requests (optional)</span>
              <textarea
                value={form.specialRequests}
                onChange={(e) => update("specialRequests", e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                rows={3}
                placeholder="Late check-in, extra towels, etc."
              />
            </label>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              onClick={submit}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Confirm booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
