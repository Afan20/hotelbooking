import express from "express";
import { prisma } from "../db/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Everything in /api/admin requires admin token
router.use(requireAuth, requireRole("admin"));

/**
 * Admin: create room
 */
router.post("/rooms", async (req, res) => {
  try {
    const { name, type, capacity, pricePerNight, features } = req.body || {};
    if (!name || !type || capacity == null || pricePerNight == null) {
      return res.status(400).json({ ok: false, message: "Missing required room fields" });
    }

    const room = await prisma.room.create({
      data: {
        name,
        type,
        capacity: Number(capacity),
        pricePerNight: Number(pricePerNight),
        features: JSON.stringify(features || []),
        isActive: true,
      },
    });

    res.json({ ok: true, room: { ...room, features: JSON.parse(room.features || "[]") } });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

/**
 * Admin: deactivate room (soft remove)
 */
router.delete("/rooms/:id", async (req, res) => {
  try {
    await prisma.room.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

/**
 * Admin: update room price
 */
router.patch("/rooms/:id/price", async (req, res) => {
  try {
    const { pricePerNight } = req.body || {};
    if (pricePerNight == null) {
      return res.status(400).json({ ok: false, message: "Missing pricePerNight" });
    }

    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: { pricePerNight: Number(pricePerNight) },
    });

    res.json({ ok: true, room: { ...room, features: JSON.parse(room.features || "[]") } });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

/**
 * Admin: list bookings
 */
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { room: true },
    });

    res.json({
      ok: true,
      bookings: bookings.map((b) => ({
        id: b.id,
        status: b.status,
        createdAt: b.createdAt,
        guest: { fullName: b.guestFullName, email: b.guestEmail, phone: b.guestPhone },
        stay: { checkIn: b.checkIn, checkOut: b.checkOut, guests: b.guests },
        room: { ...b.room, features: JSON.parse(b.room.features || "[]") },
        pricing: {
          nights: b.nights,
          subtotal: b.subtotal,
          tax: b.tax,
          total: b.total,
          discountPercent: b.discountPercent ?? 0,
          discountAmount: b.discountAmount ?? 0,
        },
      })),
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/**
 * Admin: hard delete booking (optional)
 */
router.delete("/bookings/:id", async (req, res) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

export default router;
