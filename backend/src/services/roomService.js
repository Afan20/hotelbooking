import { prisma } from "../db/prisma.js";

export async function listRooms() {
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  return rooms.map(r => ({
    ...r,
    features: JSON.parse(r.features || "[]"),
  }));
}

export async function createRoom(payload) {
  const room = await prisma.room.create({
    data: {
      name: payload.name,
      type: payload.type,
      capacity: payload.capacity,
      pricePerNight: payload.pricePerNight,
      features: JSON.stringify(payload.features || []),
      isActive: true,
    }
  });

  return { ...room, features: JSON.parse(room.features || "[]") };
}

export async function deleteRoom(roomId) {
  // soft-delete so existing bookings remain consistent
  await prisma.room.update({
    where: { id: roomId },
    data: { isActive: false }
  });
  return true;
}
