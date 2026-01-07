import jwt from "jsonwebtoken";

function extractToken(req) {
  const auth = req.headers.authorization || "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
}

export function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ ok: false, message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { userId, role, email }
    next();
  } catch {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }
    next();
  };
}
