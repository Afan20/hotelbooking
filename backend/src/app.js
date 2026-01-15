import express from "express";
import cors from "cors";

import roomsRoutes from "./routes/rooms.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "https://qvxpija-afan20s-projects.vercel.app",
  "https://hotelbooking-self-omega.vercel.app",
  "https://wahcontinentalhotel.com",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/admin", adminRoutes);

export default app;
