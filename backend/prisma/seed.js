import bcrypt from "bcryptjs";
import { prisma } from "../src/db/prisma.js";

const rooms = [
  {
    name: "Deluxe King",
    type: "Deluxe",
    capacity: 2,
    pricePerNight: 120,
    features: ["King bed", "City view", "Wi-Fi", "Smart TV"],
  },
];

const amenities = [
  {
    key: "wifi",
    title: "Complimentary Wi-Fi",
    description: "High-speed internet is available in all rooms and common areas.",
    location: "Entire property",
    hours: "24/7",
    rank: 10,
  },
  {
    key: "breakfast",
    title: "Breakfast Buffet",
    description: "Continental and local breakfast buffet with tea and coffee.",
    location: "Ground floor restaurant",
    hours: "07:00-10:30",
    rank: 20,
  },
  {
    key: "parking",
    title: "Guest Parking",
    description: "Secure on-site parking available for hotel guests.",
    location: "Main parking lot",
    hours: "24/7",
    rank: 30,
  },
  {
    key: "front_desk",
    title: "Front Desk Assistance",
    description: "Front desk can help with check-in, late checkout, and local guidance.",
    location: "Main lobby",
    hours: "24/7",
    rank: 40,
  },
];

const policies = [
  {
    key: "checkin_time",
    title: "Check-in Time",
    content: "Standard check-in starts at 2:00 PM. Early check-in depends on availability.",
    category: "checkin",
    rank: 10,
  },
  {
    key: "checkout_time",
    title: "Check-out Time",
    content: "Standard check-out is 12:00 PM. Late check-out can be requested with front desk.",
    category: "checkout",
    rank: 20,
  },
  {
    key: "id_policy",
    title: "Guest Identification",
    content: "All guests must present valid identification at check-in.",
    category: "security",
    rank: 30,
  },
  {
    key: "smoking_policy",
    title: "Smoking Policy",
    content: "Smoking is only allowed in designated areas outside the rooms.",
    category: "house_rules",
    rank: 40,
  },
];

const botTemplates = [
  {
    key: "welcome_guest",
    channel: "both",
    language: "en",
    purpose: "welcome",
    body: "Welcome to Wah Continental Hotel, {{guest_name}}. I can help with amenities, timings, and basic requests during your stay.",
  },
  {
    key: "amenities_brief",
    channel: "both",
    language: "en",
    purpose: "amenities",
    body: "Top amenities: {{amenities_summary}}. Reply with 'help' any time if you need support.",
  },
  {
    key: "checkout_review",
    channel: "both",
    language: "en",
    purpose: "checkout_review",
    body: "Thank you for staying with us. We would appreciate your feedback: {{review_url}}",
  },
  {
    key: "fallback_handoff",
    channel: "both",
    language: "en",
    purpose: "fallback",
    body: "I am connecting you to our front desk team for this request.",
  },
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

  // 3) Seed amenities
  for (const item of amenities) {
    await prisma.amenity.upsert({
      where: { key: item.key },
      update: {
        title: item.title,
        description: item.description,
        location: item.location,
        hours: item.hours,
        rank: item.rank,
        isActive: true,
      },
      create: {
        key: item.key,
        title: item.title,
        description: item.description,
        location: item.location,
        hours: item.hours,
        rank: item.rank,
        isActive: true,
      },
    });
  }

  // 4) Seed policy items
  for (const item of policies) {
    await prisma.policyItem.upsert({
      where: { key: item.key },
      update: {
        title: item.title,
        content: item.content,
        category: item.category,
        rank: item.rank,
        isActive: true,
      },
      create: {
        key: item.key,
        title: item.title,
        content: item.content,
        category: item.category,
        rank: item.rank,
        isActive: true,
      },
    });
  }

  // 5) Seed bot templates
  for (const tpl of botTemplates) {
    await prisma.botTemplate.upsert({
      where: {
        key_channel_language: {
          key: tpl.key,
          channel: tpl.channel,
          language: tpl.language,
        },
      },
      update: {
        purpose: tpl.purpose,
        body: tpl.body,
        isActive: true,
      },
      create: {
        key: tpl.key,
        channel: tpl.channel,
        language: tpl.language,
        purpose: tpl.purpose,
        body: tpl.body,
        isActive: true,
      },
    });
  }

  console.log("Seeded users:");
  console.log("Admin:", adminEmail, "Admin123!");
  console.log("Receptionist:", receptionistEmail, "Reception123!");
  console.log("Seeded amenities, policies, and bot templates.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
