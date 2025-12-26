import { apiGet, apiPost, apiDelete } from "./client.js";

export function adminLogin(email, password) {
  return apiPost("/api/admin/login", { email, password });
}

export function adminFetchBookings(token) {
  return apiGet("/api/admin/bookings", token);
}

export function adminCreateRoom(token, payload) {
  return apiPost("/api/admin/rooms", payload, token);
}

export function adminDeleteRoom(token, roomId) {
  return apiDelete(`/api/admin/rooms/${roomId}`, token);
}

export function adminDeleteBooking(token, bookingId) {
  return apiDelete(`/api/admin/bookings/${bookingId}`, token);
}
