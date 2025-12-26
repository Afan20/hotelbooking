import React from "react";

export default function ReceiptCard({ booking }) {
  const { guest, stay, room, pricing } = booking;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Receipt</h2>
          <p className="text-sm text-slate-600">Booking ID: {booking.id}</p>
          <p className="text-sm text-slate-600">Status: {booking.status}</p>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <div className="font-semibold">Aurora Hotel</div>
          <div className="text-slate-600">123 Business Ave</div>
          <div className="text-slate-600">support@aurorahotel.com</div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Guest</h3>
          <div className="text-sm text-slate-700">{guest.fullName}</div>
          <div className="text-sm text-slate-700">{guest.email}</div>
          <div className="text-sm text-slate-700">{guest.phone}</div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Stay</h3>
          <div className="text-sm text-slate-700">
            {stay.checkIn} → {stay.checkOut}
          </div>
          <div className="text-sm text-slate-700">Guests: {stay.guests}</div>
          {stay.specialRequests ? (
            <div className="text-sm text-slate-700">Requests: {stay.specialRequests}</div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-white">
        <div className="border-b px-4 py-3">
          <div className="text-sm font-semibold text-slate-900">Room</div>
          <div className="text-sm text-slate-700">
            {room.name} ({room.type})
          </div>
        </div>

        <div className="px-4 py-3 text-sm">
          <div className="flex justify-between py-1 text-slate-700">
            <span>
              ${pricing.pricePerNight} × {pricing.nights} nights
            </span>
            <span>${pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-700">
            <span>Tax (10%)</span>
            <span>${pricing.tax.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-3 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>${pricing.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
