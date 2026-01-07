import { Router } from "express";
import { listRooms } from "../services/roomService.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Staff-only: receptionist + admin
router.get("/", requireAuth, requireRole("receptionist", "admin"), async (req, res) => {
  try {
    const rooms = await listRooms();
    res.json({ rooms });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

export default router;
