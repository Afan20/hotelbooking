import bcrypt from "bcryptjs";
import { prisma } from "../src/db/prisma.js";

const rooms = [
  { name: "Deluxe King", type: "Deluxe", capacity: 2, pricePerNight: 120, features: ["King bed","City view","Wi-Fi","Smart TV"] },
  { name: "Deluxe Twin", type: "Deluxe", capacity: 2, pricePerNight: 110, features: ["Twin beds","Work desk","Wi-Fi","Smart TV"] },
  { name: "Executive King", type: "Executive", capacity: 2, pricePerNight: 150, features: ["King bed","Lounge access","Wi-Fi","Coffee machine"] },
  { name: "Standard Queen", type: "Standard", capacity: 2, pricePerNight: 90, features: ["Queen bed","Wi-Fi"] },
  { name: "Family Suite", type: "Suite", capacity: 4, pricePerNight: 220, features: ["2 rooms","Sofa bed","Wi-Fi","Kitchenette"] },
  { name: "Junior Suite", type: "Suite", capacity: 3, pricePerNight: 190, features: ["Sofa","Wi-Fi","Workspace"] },
  { name: "Garden View", type: "Standard", capacity: 2, pricePerNight: 95, features: ["Garden view","Wi-Fi"] },
  { name: "City Studio", type: "Studio", capacity: 2, pricePerNight: 130, features: ["Kitchenette","Wi-Fi","Desk"] },
  { name: "Penthouse", type: "Luxury", capacity: 2, pricePerNight: 350, features: ["Terrace","Premium view","Wi-Fi"] },
  { name: "Presidential Suite", type: "Luxury", capacity: 4, pricePerNight: 450, features: ["Dining area","Butler call","Wi-Fi"] },
];

async function main() {
  // 1) Seed users (admin + receptionist)
  const adminEmail = "admin@aurorahotel.com";
  const receptionistEmail = "receptionist@aurorahotel.com";

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
