import express from "express";
import cors from "cors";

import roomsRoutes from "./routes/rooms.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(express.json());

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "https://hotelbooking-3dcuofv53-afan20s-projects.vercel.app",
  "https://hotelbooking-self-omega.vercel.app",
  "https://wahcontinentalhotel.com",
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser requests (Postman, Render health checks)
    if (!origin) return cb(null, true);

    if (allowedOrigins.includes(origin)) return cb(null, true);

    // IMPORTANT: do NOT throw (causes 500). Just reject with "false".
    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);

export default app;
