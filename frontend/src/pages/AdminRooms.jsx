import React, { useEffect, useState } from "react";
import Container from "../components/Container.jsx";

// Adjust this import to match your actual rooms API file:
import { fetchRooms } from "../api/roomsApi.js";

import { adminCreateRoom, adminDeactivateRoom, adminUpdateRoomPrice } from "../api/adminApi.js";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create form state
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [pricePerNight, setPricePerNight] = useState(0);
  const [features, setFeatures] = useState(""); // comma-separated
  const [creating, setCreating] = useState(false);

  // Per-room price edit state
  const [priceDraft, setPriceDraft] = useState({}); // { [roomId]: value }
  const [savingId, setSavingId] = useState(null);
  const [deactivatingId, setDeactivatingId] = useState(null);

  async function loadRooms() {
    try {
      setError("");
      setLoading(true);
      const data = await fetchRooms();
      setRooms(Array.isArray(data.rooms) ? data.rooms : Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !type.trim()) {
      setError("Name and type are required.");
      return;
    }

    const cap = Number(capacity);
    const price = Number(pricePerNight);

    if (!Number.isFinite(cap) || cap < 1) {
      setError("Capacity must be at least 1.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be 0 or greater.");
      return;
    }

    const featuresArr = features
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      setCreating(true);
      await adminCreateRoom({
        name: name.trim(),
        type: type.trim(),
        capacity: cap,
        pricePerNight: price,
        features: featuresArr,
      });

      // reset
      setName("");
      setType("");
      setCapacity(1);
      setPricePerNight(0);
      setFeatures("");

      await loadRooms(); // MVP refresh
    } catch (e) {
      setError(e.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  }

  async function onSavePrice(roomId) {
    const draft = priceDraft[roomId];
    const price = Number(draft);

    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a number ≥ 0.");
      return;
    }

    try {
      setError("");
      setSavingId(roomId);
      await adminUpdateRoomPrice(roomId, price);
      await loadRooms(); // MVP refresh
    } catch (e) {
      setError(e.message || "Failed to update price");
    } finally {
      setSavingId(null);
    }
  }

  async function onDeactivate(roomId) {
    const ok = window.confirm("Deactivate this room? It will no longer be available.");
    if (!ok) return;

    try {
      setError("");
      setDeactivatingId(roomId);
      await adminDeactivateRoom(roomId);
      await loadRooms(); // MVP refresh
    } catch (e) {
      setError(e.message || "Failed to deactivate room");
    } finally {
      setDeactivatingId(null);
    }
  }

  return (
    <Container>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin: Rooms</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create rooms, update prices, and deactivate rooms.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* Create Room */}
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Create Room</h2>

        <form onSubmit={onCreate} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              placeholder="e.g. Deluxe 101"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Type</label>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              placeholder="e.g. deluxe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Price / Night</label>
            <input
              type="number"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              min={0}
              step="0.01"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Features (comma-separated)
            </label>
            <input
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              placeholder="e.g. wifi, balcony, minibar"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {creating ? "Creating..." : "Create Room"}
            </button>
          </div>
        </form>
      </div>

      {/* Rooms List */}
      <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700">
          Rooms
        </div>

        {loading ? (
          <div className="px-5 py-4 text-sm text-slate-600">Loading rooms…</div>
        ) : rooms.length === 0 ? (
          <div className="px-5 py-4 text-sm text-slate-700">No rooms found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-slate-600">
              <tr className="border-t">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Capacity</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Features</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => {
                const draft = priceDraft[r.id] ?? r.pricePerNight;
                const isSaving = savingId === r.id;
                const isDeactivating = deactivatingId === r.id;

                return (
                  <tr key={r.id} className="border-t">
                    <td className="px-5 py-4 font-medium text-slate-900">{r.name}</td>
                    <td className="px-5 py-4 text-slate-700">{r.type}</td>
                    <td className="px-5 py-4 text-slate-700">{r.capacity}</td>
                    <td className="px-5 py-4 text-slate-700">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={draft}
                          onChange={(e) =>
                            setPriceDraft((prev) => ({ ...prev, [r.id]: e.target.value }))
                          }
                          className="w-28 rounded-lg border border-slate-300 bg-white px-2 py-1 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                          min={0}
                          step="0.01"
                        />
                        <button
                          onClick={() => onSavePrice(r.id)}
                          disabled={isSaving}
                          className="rounded-lg border px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {isSaving ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {Array.isArray(r.features) ? r.features.join(", ") : ""}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onDeactivate(r.id)}
                        disabled={isDeactivating}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        {isDeactivating ? "Deactivating…" : "Deactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  );
}
