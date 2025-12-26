import express from "express";
import cors from "cors";

import roomsRoutes from "./routes/rooms.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Hotel API is healthy" });
});

app.use("/api/rooms", roomsRoutes);
app.use("/api/bookings", bookingsRoutes);

export default app;
