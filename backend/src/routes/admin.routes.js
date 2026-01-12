import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  adminCreateRoom,
  adminDeactivateRoom,
  adminUpdateRoomPrice,
  // Optional:
  adminListBookings,
  adminHardDeleteBooking,
  adminEditBooking,
  adminCheckoutBooking,
} from "../services/adminService.js";


const router = express.Router();

// Everything in /api/admin requires admin token
router.use(requireAuth, requireRole("admin"));

/**
 * Admin: create room
 */
router.post("/rooms", async (req, res) => {
  try {
    const room = await adminCreateRoom(req.body);
    res.json({ ok: true, room });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

/**
 * Admin: deactivate room (soft remove)
 */
router.delete("/rooms/:id", async (req, res) => {
  try {
    await adminDeactivateRoom(req.params.id);
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
    const room = await adminUpdateRoomPrice(req.params.id, pricePerNight);
    res.json({ ok: true, room });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

/**
 * Admin: edit booking (dates shorter/longer, recompute totals, overlap-safe)
 * PATCH /api/admin/bookings/:id
 */
router.patch("/bookings/:id", async (req, res) => {
  try {
    const booking = await adminEditBooking(req.params.id, req.body || {});
    res.json({ ok: true, booking });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

/**
 * Admin: checkout booking
 * PATCH /api/admin/bookings/:id/checkout
 */
router.patch("/bookings/:id/checkout", async (req, res) => {
  try {
    const booking = await adminCheckoutBooking(req.params.id);
    res.json({ ok: true, booking });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});


/**
 * Optional admin booking ops — keep only if required
 */
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await adminListBookings();
    res.json({ ok: true, bookings });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    await adminHardDeleteBooking(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

export default router;
