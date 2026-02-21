export function requireAgentKey(req, res, next) {
  const expected = process.env.AGENT_API_KEY;
  if (!expected) {
    return res.status(503).json({
      ok: false,
      message: "Agent API key is not configured.",
    });
  }

  const provided = req.headers["x-agent-key"];
  if (!provided || provided !== expected) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  next();
}
