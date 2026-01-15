import bcrypt from "bcryptjs";
import { prisma } from "../src/db/prisma.js";

const rooms = [
  { name: "Deluxe King", type: "Deluxe", capacity: 2, pricePerNight: 120, features: ["King bed","City view","Wi-Fi","Smart TV"] },
   
];

async function main() {
  // 1) Seed users (admin + receptionist)
  const adminEmail = "admin";
  const receptionistEmail = "receptionist";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      role: "admin",
      passwordHash: await bcrypt.hash("Admin123!", 10),
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: receptionistEmail },
    update: {},
    create: {
      email: receptionistEmail,
      role: "receptionist",
      passwordHash: await bcrypt.hash("Reception123!", 10),
      isActive: true,
    },
  });

  // 2) Seed rooms (only if none exist)
  const existingRooms = await prisma.room.count();
  if (existingRooms === 0) {
    await prisma.room.createMany({
      data: rooms.map((r) => ({
        name: r.name,
        type: r.type,
        capacity: r.capacity,
        pricePerNight: r.pricePerNight,
        features: JSON.stringify(r.features),
        isActive: true,
      })),
    });
    console.log("Seeded rooms.");
  } else {
    console.log("Rooms already exist, skipping rooms seed.");
  }

  console.log("Seeded users:");
  console.log("Admin:", adminEmail, "Admin123!");
  console.log("Receptionist:", receptionistEmail, "Reception123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
