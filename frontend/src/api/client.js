import { getToken } from "../auth/authStorage.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function headers(token) {
  const h = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function resolveToken(explicitToken) {
  return explicitToken || getToken();
}

export async function apiGet(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: headers(resolveToken(token)),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export async function apiPost(path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: headers(resolveToken(token)),
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export async function apiPatch(path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: headers(resolveToken(token)),
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export async function apiDelete(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: headers(resolveToken(token)),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}
