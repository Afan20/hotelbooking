import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";
import { getToken } from "../auth/authStorage.js";

/* Admin rooms */
export function adminCreateRoom(payload) {
  return apiPost("/api/admin/rooms", payload, getToken());
}

export function adminDeactivateRoom(id) {
  return apiDelete(`/api/admin/rooms/${id}`, getToken());
}

export function adminUpdateRoomPrice(id, pricePerNight) {
  return apiPatch(`/api/admin/rooms/${id}/price`, { pricePerNight }, getToken());
}

/* Admin bookings */
export function adminFetchBookings() {
  return apiGet("/api/admin/bookings", getToken());
}

export function adminEditBooking(id, payload) {
  return apiPatch(`/api/admin/bookings/${id}`, payload, getToken());
}

export function adminCheckoutBooking(id) {
  return apiPatch(`/api/admin/bookings/${id}/checkout`, {}, getToken());
}
