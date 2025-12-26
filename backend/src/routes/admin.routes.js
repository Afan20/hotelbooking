import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { requireAdmin } from "../middleware/auth.js";
import { prisma } from "../db/prisma.js";

const router = express.Router();

// Admin login (very simple)
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, message: "Missing email/password" });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // For MVP, compare plain; or hash it once. We'll keep it simple:
  const ok = email === adminEmail && password === adminPassword;
  if (!ok) return res.status(401).json({ ok: false, message: "Invalid credentials" });

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "8h" });
  return res.json({ ok: true, token });
});

// Admin: create room
router.post("/rooms", requireAdmin, async (req, res) => {
  const { name, type, capacity, pricePerNight, features } = req.body || {};
  const room = await prisma.room.create({
    data: {
      name,
      type,
      capacity: Number(capacity),
      pricePerNight: Number(pricePerNight),
      features: JSON.stringify(features || []),
      isActive: true,
    }
  });
  res.json({ ok: true, room: { ...room, features: JSON.parse(room.features || "[]") } });
});

// Admin: deactivate room
router.delete("/rooms/:id", requireAdmin, async (req, res) => {
  await prisma.room.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ ok: true });
});

// Admin: list bookings
router.get("/bookings", requireAdmin, async (req, res) => {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" }, include: { room: true } });
  res.json({
    ok: true,
    bookings: bookings.map(b => ({
      id: b.id,
      status: b.status,
      createdAt: b.createdAt,
      guest: { fullName: b.guestFullName, email: b.guestEmail, phone: b.guestPhone },
      stay: { checkIn: b.checkIn, checkOut: b.checkOut, guests: b.guests },
      room: { ...b.room, features: JSON.parse(b.room.features || "[]") },
      pricing: { nights: b.nights, subtotal: b.subtotal, tax: b.tax, total: b.total },
    }))
  });
});

// Admin: hard delete booking (optional)
router.delete("/bookings/:id", requireAdmin, async (req, res) => {
  await prisma.booking.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
