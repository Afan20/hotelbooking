import { Router } from "express";
import {
  createBooking,
  getBooking,
  listBookings,
  cancelBooking,
  checkoutBooking,
} from "../services/bookingService.js";

import { requireFields, isValidDateRange } from "../utils/validation.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

/**
 * Create booking (staff)
 * receptionist/admin can book
 * receptionist can apply only preset discounts (enforced in service)
 */
router.post("/", requireAuth, requireRole("receptionist", "admin"), async (req, res) => {
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
      return res.status(400).json({ ok: false, message: "Check-out must be after check-in." });
    }

    const booking = await createBooking(
      {
        roomId: body.roomId,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        guests: Number(body.guests),
        guestType: body.guestType || "pakistani",
        guestIdCardNumber: body.guestIdCardNumber,
        guestNationality: body.guestNationality,
        guestPassportNumber: body.guestPassportNumber,

        specialRequests: body.specialRequests || "",
        discountPercent: Number(body.discountPercent || 0),
      },
      req.user.role
    );

    return res.status(201).json({ ok: true, booking });
  } catch (e) {
    return res.status(400).json({ ok: false, message: e.message });
  }
});

/**
 * List bookings (staff)
 */
router.get("/", requireAuth, requireRole("receptionist", "admin"), async (req, res) => {
  try {
    const bookings = await listBookings();
    res.json({ ok: true, bookings });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/**
 * Get single booking (staff)
 */
router.get("/:id", requireAuth, requireRole("receptionist", "admin"), async (req, res) => {
  try {
    const booking = await getBooking(req.params.id);
    res.json({ ok: true, booking });
  } catch (e) {
    res.status(404).json({ ok: false, message: e.message });
  }
});

/**
 * Cancel booking (staff)
 */
router.patch("/:id/cancel", requireAuth, requireRole("receptionist", "admin"), async (req, res) => {
  try {
    const booking = await cancelBooking(req.params.id);
    res.json({ ok: true, booking });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

router.patch("/:id/checkout", requireAuth, requireRole("receptionist", "admin"), async (req, res) => {
  try {
    const booking = await checkoutBooking(req.params.id);
    res.json({ ok: true, booking });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});


export default router;
