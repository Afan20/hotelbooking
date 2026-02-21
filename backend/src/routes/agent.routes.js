import { Router } from "express";
import { requireAgentKey } from "../middleware/agentKey.js";
import {
  getAgentContext,
  logAgentMessage,
  updateConversationState,
  upsertReviewRequest,
} from "../services/agentService.js";

const router = Router();

router.use(requireAgentKey);

router.post("/context", async (req, res) => {
  try {
    const context = await getAgentContext(req.body || {});
    res.json({ ok: true, ...context });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const message = await logAgentMessage(req.body || {});
    res.status(201).json({ ok: true, message });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

router.patch("/conversations/:id", async (req, res) => {
  try {
    const conversation = await updateConversationState(req.params.id, req.body || {});
    res.json({ ok: true, conversation });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

router.post("/review-requests", async (req, res) => {
  try {
    const reviewRequest = await upsertReviewRequest(req.body || {});
    res.status(201).json({ ok: true, reviewRequest });
  } catch (e) {
    res.status(400).json({ ok: false, message: e.message });
  }
});

export default router;
