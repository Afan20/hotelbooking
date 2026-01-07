import { apiGet } from "./client.js";
import { getToken } from "../auth/authStorage.js";

export function fetchRooms() {
  return apiGet("/api/rooms", getToken());
}
