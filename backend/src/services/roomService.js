import { prisma } from "../db/prisma.js";

export async function listRooms() {
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  return rooms.map((r) => ({
    ...r,
    features: safeParseJsonArray(r.features),
  }));
}

function safeParseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

