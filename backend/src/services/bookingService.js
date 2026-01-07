import { prisma } from "../db/prisma.js";
import { calcNights } from "../utils/pricing.js";

// simple tax settings for MVP
const TAX_RATE = 0.10;

// receptionist allowed preset discounts
const RECEPTIONIST_PRESETS = [10, 30, 50];

function money(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

function computeTotals(pricePerNight, nights, discountPercent) {
  const baseSubtotal = pricePerNight * nights;
  const discountAmount = baseSubtotal * (discountPercent / 100);
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

/**
 * overlap rule:
 * existing booking overlaps if NOT (existing.checkOut <= new.checkIn OR existing.checkIn >= new.checkOut)
 */
async function assertRoomAvailable(roomId, checkIn, checkOut) {
  const overlapping = await prisma.booking.findFirst({
    where: {
      roomId,
      status: "confirmed",
      AND: [
        { checkIn: { lt: checkOut } }, // existing starts before new ends
        { checkOut: { gt: checkIn } }, // existing ends after new starts
      ],
    },
  });

  if (overlapping) {
    throw new Error("Room is not available for these dates.");
  }
}

function validateDiscountByRole(discountPercent, role) {
  const d = Number(discountPercent || 0);

  if (Number.isNaN(d) || d < 0) throw new Error("Invalid discount percent.");

  // hard cap for safety (even for admin)
  if (d > 80) throw new Error("Discount too high.");

  if (role === "receptionist") {
    if (d === 0) return 0;
    if (!RECEPTIONIST_PRESETS.includes(d)) {
      throw new Error("Receptionist can apply only preset discounts: 10%, 30%, 50%.");
    }
  }

  return d;
}

export async function createBooking(payload, role = "receptionist") {
  const room = await prisma.room.findFirst({
    where: { id: payload.roomId, isActive: true },
  });
  if (!room) throw new Error("Room not found");

  const nights = calcNights(payload.checkIn, payload.checkOut);
  if (nights <= 0) throw new Error("Invalid date range");

  // availability check
  await assertRoomAvailable(room.id, payload.checkIn, payload.checkOut);

  const discountPercent = validateDiscountByRole(payload.discountPercent, role);
  const pricing = computeTotals(room.pricePerNight, nights, discountPercent);

  const booking = await prisma.booking.create({
    data: {
      status: "confirmed",
      guestFullName: payload.fullName,
      guestEmail: payload.email,
      guestPhone: payload.phone || "",
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      guests: payload.guests,
      specialRequests: payload.specialRequests || "",
      nights,
      subtotal: pricing.subtotal,
      tax: pricing.tax,
      total: pricing.total,
      discountPercent,
      discountAmount: pricing.discountAmount,
      roomId: room.id,
    },
    include: { room: true },
  });

  return normalizeBooking(booking);
}

export async function getBooking(id) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });
  if (!booking) throw new Error("Booking not found");
  return normalizeBooking(booking);
}

export async function listBookings() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { room: true },
  });
  return bookings.map(normalizeBooking);
}

export async function cancelBooking(id) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: "cancelled" },
    include: { room: true },
  });
  return normalizeBooking(booking);
}

function normalizeBooking(b) {
  return {
    id: b.id,
    status: b.status,
    createdAt: b.createdAt,
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
    room: { ...b.room, features: JSON.parse(b.room.features || "[]") },
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
