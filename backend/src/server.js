import dotenv from "dotenv";
import adminRoutes from "./routes/admin.routes.js";
import roomsRoutes from "./routes/rooms.routes.js";

app.use("/api/rooms", roomsRoutes);
app.use("/api/admin", adminRoutes);

dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
