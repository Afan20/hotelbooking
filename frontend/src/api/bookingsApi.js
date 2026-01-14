import { apiGet, apiPost, apiPatch } from "./client.js";
import { getToken } from "../auth/authStorage.js";

export function createBooking(payload) {
  return apiPost("/api/bookings", payload, getToken());
}

export function fetchBooking(bookingId) {
  return apiGet(`/api/bookings/${bookingId}`, getToken());
}

export function fetchBookings() {
  return apiGet("/api/bookings", getToken());
}

export function cancelBooking(id) {
  return apiPatch(`/api/bookings/${id}/cancel`, {}, getToken());
}

// NEW: staff checkout (admin + receptionist)
export function checkoutBooking(id) {
  return apiPatch(`/api/bookings/${id}/checkout`, {}, getToken());
}


