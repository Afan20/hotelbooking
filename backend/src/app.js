import express from "express";
import cors from "cors";

import roomsRoutes from "./routes/rooms.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/admin", adminRoutes);

export default app;
