import { prisma } from "../db/prisma.js";
import { calcNights, calcPricing } from "../utils/pricing.js";

export async function createBooking(payload) {
  const room = await prisma.room.findFirst({
    where: { id: payload.roomId, isActive: true }
  });
  if (!room) throw new Error("Room not found");

  const nights = calcNights(payload.checkIn, payload.checkOut);
  const pricing = calcPricing(room.pricePerNight, nights);

  const booking = await prisma.booking.create({
  data: {
    status: "confirmed",
    guestFullName: payload.fullName,   // ✅ FIXED
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
  // for client: “cancel” = set status cancelled
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: "cancelled" },
    include: { room: true },
  });
  return normalizeBooking(booking);
}

export async function deleteBookingAdmin(id) {
  // admin: hard delete (optional). Safer is also “cancel”
  await prisma.booking.delete({ where: { id } });
  return true;
}

function normalizeBooking(b) {
  return {
    id: b.id,
    status: b.status,
    createdAt: b.createdAt,
    guest: { fullName: b.guestFullName, email: b.guestEmail, phone: b.guestPhone },
    stay: { checkIn: b.checkIn, checkOut: b.checkOut, guests: b.guests },
    room: { ...b.room, features: JSON.parse(b.room.features || "[]") },
    pricing: { nights: b.nights, subtotal: b.subtotal, tax: b.tax, total: b.total },
    specialRequests: b.specialRequests,
  };
}

