import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import ReceiptCard from "../components/ReceiptCard.jsx";
import { fetchBooking } from "../api/bookingsApi.js";

export default function Receipt() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchBooking(bookingId);
        if (mounted) setBooking(data.booking);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load receipt");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [bookingId]);

  return (
    <Container>
      <div className="mb-4">
        <Link to="/rooms" className="text-sm font-semibold text-slate-700 hover:underline">
          ← Back to rooms
        </Link>
      </div>

      {loading ? <div className="text-sm text-slate-600">Loading receipt…</div> : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {booking ? <ReceiptCard booking={booking} /> : null}
    </Container>
  );
}
