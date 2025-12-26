import React from "react";

export default function RoomCard({ room, onBook }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{room.name}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {room.type} • Sleeps {room.capacity}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-slate-900">${room.pricePerNight}</div>
            <div className="text-xs text-slate-500">per night</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {room.features.slice(0, 4).map((f) => (
            <span
              key={f}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
            >
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={() => onBook(room)}
          className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Book this room
        </button>
      </div>
    </div>
  );
}
