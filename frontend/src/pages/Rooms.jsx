import React, { useEffect, useState } from "react";
import Container from "../components/Container.jsx";
import RoomCard from "../components/RoomCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import { fetchRooms } from "../api/roomsApi.js";
import { createBooking } from "../api/bookingsApi.js";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchRooms();
        if (mounted) setRooms(data.rooms || []);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load rooms");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  function openBooking(room) {
    setSelectedRoom(room);
    setModalOpen(true);
  }

  async function confirmBooking(payload) {
    try {
      setCreating(true);
      const res = await createBooking(payload);
      const id = res.booking.id;
      setModalOpen(false);
      navigate(`/confirmation/${id}`);
    } catch (e) {
      setError(e.message || "Booking failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Container>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Rooms</h1>
          <p className="mt-1 text-sm text-slate-600">Select a room and book in under a minute.</p>
        </div>
        {creating ? (
          <div className="text-sm font-semibold text-slate-700">Creating booking…</div>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 text-sm text-slate-600">Loading rooms…</div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => (
            <RoomCard key={r.id} room={r} onBook={openBooking} />
          ))}
        </div>
      )}

      <BookingModal
        open={modalOpen}
        room={selectedRoom}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmBooking}
      />
    </Container>
  );
}
