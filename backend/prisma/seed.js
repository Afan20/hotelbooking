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
  const existing = await prisma.room.count();
  if (existing > 0) {
    console.log("Rooms already exist, skipping seed.");
    return;
  }

  await prisma.room.createMany({
    data: rooms.map(r => ({
      ...r,
      features: JSON.stringify(r.features),
    }))
  });

  console.log("Seeded rooms.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
