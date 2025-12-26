import { apiGet } from "./client";

export function fetchRooms() {
  return apiGet("/api/rooms");
}
