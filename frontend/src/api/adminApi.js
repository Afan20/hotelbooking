import { apiPost, apiPatch, apiDelete } from "./client.js";
import { getToken } from "../auth/authStorage.js";

export function adminCreateRoom(payload) {
  return apiPost("/api/admin/rooms", payload, getToken());
}

export function adminDeactivateRoom(id) {
  return apiDelete(`/api/admin/rooms/${id}`, getToken());
}

export function adminUpdateRoomPrice(id, pricePerNight) {
  return apiPatch(`/api/admin/rooms/${id}/price`, { pricePerNight }, getToken());
}
