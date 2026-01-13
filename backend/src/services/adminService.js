import { prisma } from "../db/prisma.js";
import { calcNights } from "../utils/pricing.js";

/**
 * Helpers
 */
const TAX_RATE = 0.10;

function money(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

function computeTotals(pricePerNight, nights, discountPercent) {
  const baseSubtotal = pricePerNight * nights;
  const discountAmount = baseSubtotal * (Number(discountPercent || 0) / 100);
  const subtotalAfterDiscount = baseSubtotal - discountAmount;
  const tax = subtotalAfterDiscount * TAX_RATE;
  const total = subtotalAfterDiscount + tax;

  return {
    subtotal: money(subtotalAfterDiscount),
    discountAmount: money(discountAmount),
    tax: money(tax),
    total: money(total),
  };
}

function safeParseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Overlap check must block ONLY confirmed bookings.
 * Excludes current booking id during edits.
 */
async function assertRoomAvailable(roomId, checkIn, checkOut, excludeBookingId) {
  const overlapping = await prisma.booking.findFirst({
    where: {
      roomId,
      status: "confirmed",
      id: { not: excludeBookingId },
      AND: [
        { checkIn: { lt: checkOut } },
        { checkOut: { gt: checkIn } },
      ],
    },
  });

  if (overlapping) {
    throw new Error("Room is not available for these dates.");
  }
}

function normalizeBooking(b) {
  return {
    id: b.id,
    status: b.status,
    createdAt: b.createdAt,
    checkedOutAt: b.checkedOutAt ?? null, // safe extra field for frontend
    guest: {
      fullName: b.guestFullName,
      email: b.guestEmail,
      phone: b.guestPhone,
    },
    stay: {
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      guests: b.guests,
    },
    room: { ...b.room, features: safeParseJsonArray(b.room.features) },
    pricing: {
      nights: b.nights,
      subtotal: b.subtotal,
      tax: b.tax,
      total: b.total,
      discountPercent: b.discountPercent ?? 0,
      discountAmount: b.discountAmount ?? 0,
    },
    specialRequests: b.specialRequests,
  };
}

/**
 * Admin: create room
 */
export async function adminCreateRoom(payload) {
  const { name, type, capacity, pricePerNight, features } = payload || {};

  if (!name || !type || capacity == null || pricePerNight == null) {
    throw new Error("Missing required room fields");
  }

  const room = await prisma.room.create({
    data: {
      name,
      type,
      capacity: Number(capacity),
      pricePerNight: Number(pricePerNight),
      features: JSON.stringify(features || []),
      isActive: true,
    },
  });

  return { ...room, features: safeParseJsonArray(room.features) };
}

/**
 * Admin: deactivate room (soft delete)
 */
export async function adminDeactivateRoom(roomId) {
  if (!roomId) throw new Error("Missing roomId");

  await prisma.room.update({
    where: { id: roomId },
    data: { isActive: false },
  });

  return true;
}

/**
 * Admin: update room price
 */
export async function adminUpdateRoomPrice(roomId, pricePerNight) {
  if (!roomId) throw new Error("Missing roomId");
  if (pricePerNight == null) throw new Error("Missing pricePerNight");

  const room = await prisma.room.update({
    where: { id: roomId },
    data: { pricePerNight: Number(pricePerNight) },
  });

  return { ...room, features: safeParseJsonArray(room.features) };
}

/**
 * Optional admin ops (keep only if you truly need them)
 */
export async function adminListBookings() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { room: true },
  });

  return bookings.map((b) => ({
    id: b.id,
    status: b.status,
    createdAt: b.createdAt,
    checkedOutAt: b.checkedOutAt ?? null,
    guest: { fullName: b.guestFullName, email: b.guestEmail, phone: b.guestPhone },
    stay: { checkIn: b.checkIn, checkOut: b.checkOut, guests: b.guests },
    room: { ...b.room, features: safeParseJsonArray(b.room.features) },
    pricing: {
      nights: b.nights,
      subtotal: b.subtotal,
      tax: b.tax,
      total: b.total,
      discountPercent: b.discountPercent ?? 0,
      discountAmount: b.discountAmount ?? 0,
    },
    specialRequests: b.specialRequests,
  }));
}

export async function adminHardDeleteBooking(bookingId) {
  if (!bookingId) throw new Error("Missing bookingId");
  await prisma.booking.delete({ where: { id: bookingId } });
  return true;
}

/**
 * Admin: edit booking
 * PATCH /api/admin/bookings/:id
 */
export async function adminEditBooking(bookingId, patch = {}) {
  if (!bookingId) throw new Error("Missing bookingId");

  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true },
  });
  if (!existing) throw new Error("Booking not found");

  // Must be confirmed
  if (existing.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be edited.");
  }

  // Allow partial by falling back to existing values
  const nextCheckIn = patch.checkIn ?? existing.checkIn;
  const nextCheckOut = patch.checkOut ?? existing.checkOut;

  // Validate date format & range
  const inDate = new Date(nextCheckIn);
  const outDate = new Date(nextCheckOut);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
    throw new Error("Invalid date format.");
  }
  if (outDate.getTime() <= inDate.getTime()) {
    throw new Error("Check-out must be after check-in.");
  }

  // Optional edits
  const nextGuests = patch.guests == null ? existing.guests : Number(patch.guests);
  if (!Number.isFinite(nextGuests) || nextGuests < 1) {
    throw new Error("Guests must be at least 1.");
  }
  if (existing.room?.capacity != null && nextGuests > existing.room.capacity) {
    throw new Error(`Guests cannot exceed room capacity (${existing.room.capacity}).`);
  }

  const nextDiscountPercent =
    patch.discountPercent == null
      ? Number(existing.discountPercent || 0)
      : Number(patch.discountPercent);

  if (!Number.isFinite(nextDiscountPercent) || nextDiscountPercent < 0) {
    throw new Error("Invalid discount percent.");
  }
  if (nextDiscountPercent > 80) {
    throw new Error("Discount too high.");
  }

  const nextSpecialRequests =
    patch.specialRequests === undefined ? existing.specialRequests : (patch.specialRequests || "");

  // Overlap check excluding this booking
  await assertRoomAvailable(existing.roomId, nextCheckIn, nextCheckOut, existing.id);

  // Recompute totals exactly like booking service style
  const nights = calcNights(nextCheckIn, nextCheckOut);
  const pricing = computeTotals(existing.room.pricePerNight, nights, nextDiscountPercent);

  const updated = await prisma.booking.update({
    where: { id: existing.id },
    data: {
      checkIn: nextCheckIn,
      checkOut: nextCheckOut,
      guests: nextGuests,
      specialRequests: nextSpecialRequests,
      nights,
      subtotal: pricing.subtotal,
      tax: pricing.tax,
      total: pricing.total,
      discountPercent: nextDiscountPercent,
      discountAmount: pricing.discountAmount,
    },
    include: { room: true },
  });

  return normalizeBooking(updated);
}

/**
 * Admin: checkout booking
 * PATCH /api/admin/bookings/:id/checkout
 */
export async function adminCheckoutBooking(bookingId) {
  if (!bookingId) throw new Error("Missing bookingId");

  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true },
  });
  if (!existing) throw new Error("Booking not found");

  if (existing.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be checked out.");
  }

  const updated = await prisma.booking.update({
    where: { id: existing.id },
    data: {
      status: "checked_out",
      checkedOutAt: new Date(),
    },
    include: { room: true },
  });

  return normalizeBooking(updated);
}
