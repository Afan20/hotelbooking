import { Router } from "express";
import { listRooms } from "../services/roomService.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await listRooms();
    res.json({ rooms });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
