import { Router } from "express";
import {
  createBooking,
  getBooking,
  listBookings,
  cancelBooking,
} from "../services/bookingService.js";
import { requireFields, isValidDateRange } from "../utils/validation.js";

const router = Router();

/**
 * Create booking (client)
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    const required = requireFields(body, [
      "roomId",
      "fullName",
      "email",
      "phone",
      "checkIn",
      "checkOut",
      "guests",
    ]);
    if (!required.ok) {
      return res.status(400).json({ ok: false, message: required.error });
    }

    if (!isValidDateRange(body.checkIn, body.checkOut)) {
      return res
        .status(400)
        .json({ ok: false, message: "Check-out must be after check-in." });
    }

    const booking = await createBooking({
      roomId: body.roomId,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: Number(body.guests),
      specialRequests: body.specialRequests || "",
    });

    return res.status(201).json({ ok: true, booking });
  } catch (e) {
    return res.status(400).json({ ok: false, message: e.message });
  }
});

/**
 * List all bookings (client / admin)
 */
router.get("/", async (req, res) => {
  try {
    const bookings = await listBookings();
    res.json({ ok: true, bookings });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/**
 * Get single booking
 */
router.get("/:id", async (req, res) => {
  try {
    const booking = await getBooking(req.params.id);
    res.json({ ok: true, booking });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
});

/**
 * Cancel booking (client)
 */
router.patch("/:id/cancel", async (req, res) => {
  try {
    const booking = await cancelBooking(req.params.id);
    res.json({ ok: true, booking });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

export default router;
