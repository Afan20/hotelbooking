import { apiGet, apiPost } from "./client";

export function createBooking(payload) {
  return apiPost("/api/bookings", payload);
}

export function fetchBooking(bookingId) {
  return apiGet(`/api/bookings/${bookingId}`);
}
export function fetchBookings() {
  return apiGet("/api/bookings");
}
export function cancelBooking(id) {
  return apiPatch(`/api/bookings/${id}/cancel`, {});
}


