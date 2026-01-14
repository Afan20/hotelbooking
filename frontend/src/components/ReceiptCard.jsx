import React from "react";

export default function ReceiptCard({ booking }) {
  const { guest = {}, stay = {}, room = {}, pricing = {} } = booking || {};

  // --- Identity fields: support multiple possible shapes (prevents "it doesn't show")
  // Preferred (recommended backend): booking.guest.guestType / guestIdCardNumber / guestNationality / guestPassportNumber
  // Fallback: booking.guestType / booking.guestIdCardNumber / booking.guestNationality / booking.guestPassportNumber
  const guestTypeRaw =
    guest.guestType ??
    booking.guestType ??
    guest.type ??
    booking.type ??
    "";

  const guestType = String(guestTypeRaw || "").trim().toLowerCase(); // "pakistani" | "foreign" | ""

  const cnic =
    guest.guestIdCardNumber ??
    booking.guestIdCardNumber ??
    guest.idCardNumber ?? // fallback for older naming
    guest.cnic ?? // fallback
    booking.cnic ??
    "";

  const nationality =
    guest.guestNationality ??
    booking.guestNationality ??
    guest.nationality ??
    booking.nationality ??
    "";

  const passport =
    guest.guestPassportNumber ??
    booking.guestPassportNumber ??
    guest.passportNumber ??
    booking.passportNumber ??
    "";

  const hasCnic = String(cnic || "").trim().length > 0;
  const hasNationality = String(nationality || "").trim().length > 0;
  const hasPassport = String(passport || "").trim().length > 0;

  // Show identity block only if backend returned something or guestType indicates it
  const showPakistaniIdentity = guestType === "pakistani" && hasCnic;
  const showForeignIdentity = guestType === "foreign" && (hasNationality || hasPassport);

  // Pricing safety (avoid crash if backend didn't send numbers)
  const pricePerNight = Number(pricing.pricePerNight || 0);
  const nights = Number(pricing.nights || 0);
  const subtotal = Number(pricing.subtotal || 0);
  const tax = Number(pricing.tax || 0);
  const total = Number(pricing.total || 0);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Receipt</h2>
          <p className="text-sm text-slate-600">Booking ID: {booking.id}</p>
          <p className="text-sm text-slate-600">Status: {booking.status}</p>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <div className="font-semibold">Wah Continental Hotel</div>
          <div className="text-slate-600">GT road, Wah Cantt</div>
          <div className="text-slate-600">wahcontinentalhotel@gmail.com</div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Guest</h3>
          <div className="text-sm text-slate-700">{guest.fullName}</div>
          <div className="text-sm text-slate-700">{guest.email}</div>
          <div className="text-sm text-slate-700">{guest.phone}</div>

          {/* NEW: Identity fields (conditional + safe) */}
          {showPakistaniIdentity ? (
            <div className="pt-2 text-sm text-slate-700">
              <div className="text-xs font-semibold text-slate-500">CNIC</div>
              <div>{cnic}</div>
            </div>
          ) : null}

          {showForeignIdentity ? (
            <div className="pt-2 text-sm text-slate-700">
              <div className="text-xs font-semibold text-slate-500">Foreign National</div>
              {hasNationality ? <div>Nationality: {nationality}</div> : null}
              {hasPassport ? <div>Passport: {passport}</div> : null}
            </div>
          ) : null}
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
              ${pricePerNight} × {nights} nights
            </span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-700">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-3 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
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
