import { prisma } from "../db/prisma.js";
import { normalizePhoneE164, phoneLastDigits } from "../utils/phone.js";

function normalizeChannel(channel) {
  return String(channel || "").trim().toLowerCase() === "whatsapp" ? "whatsapp" : "sms";
}

function normalizeLanguage(language) {
  const value = String(language || "").trim().toLowerCase();
  return value || "en";
}

async function findBookingByPhone(phone) {
  const raw = String(phone || "").trim();
  const phoneE164 = normalizePhoneE164(raw);
  const last7 = phoneLastDigits(raw, 7);

  const or = [];
  if (phoneE164) or.push({ guestPhoneE164: phoneE164 });
  if (raw) or.push({ guestPhone: raw });
  if (last7) or.push({ guestPhone: { contains: last7 } });

  if (!or.length) return null;

  const include = { room: true };

  const active = await prisma.booking.findFirst({
    where: { status: "confirmed", OR: or },
    include,
    orderBy: { createdAt: "desc" },
  });
  if (active) return active;

  return prisma.booking.findFirst({
    where: { OR: or },
    include,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAgentContext({ phone, channel, language }) {
  const phoneE164 = normalizePhoneE164(phone);
  if (!phoneE164) throw new Error("A valid phone number is required.");

  const normalizedChannel = normalizeChannel(channel);
  const normalizedLanguage = normalizeLanguage(language);
  const booking = await findBookingByPhone(phone);

  let conversation = await prisma.conversation.findFirst({
    where: {
      phoneE164,
      channel: normalizedChannel,
      status: "open",
    },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        bookingId: booking?.id ?? null,
        phoneE164,
        channel: normalizedChannel,
        guestName: booking?.guestFullName ?? null,
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  } else if (!conversation.bookingId && booking?.id) {
    conversation = await prisma.conversation.update({
      where: { id: conversation.id },
      data: { bookingId: booking.id, guestName: booking.guestFullName },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  }

  const [amenities, policies, templates] = await Promise.all([
    prisma.amenity.findMany({
      where: { isActive: true },
      orderBy: [{ rank: "asc" }, { createdAt: "asc" }],
    }),
    prisma.policyItem.findMany({
      where: { isActive: true },
      orderBy: [{ rank: "asc" }, { createdAt: "asc" }],
    }),
    prisma.botTemplate.findMany({
      where: {
        isActive: true,
        language: normalizedLanguage,
        OR: [{ channel: normalizedChannel }, { channel: "both" }],
      },
      orderBy: [{ purpose: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return {
    conversation,
    booking,
    amenities,
    policies,
    templates,
  };
}

export async function logAgentMessage(payload) {
  const conversationId = String(payload?.conversationId || "").trim();
  const direction = String(payload?.direction || "").trim().toLowerCase();
  const sender = String(payload?.sender || "").trim().toLowerCase();
  const text = String(payload?.text || "").trim();
  const providerMessageId = payload?.providerMessageId
    ? String(payload.providerMessageId).trim()
    : null;
  const intent = payload?.intent ? String(payload.intent).trim() : null;
  const meta = payload?.meta && typeof payload.meta === "object" ? payload.meta : null;

  if (!conversationId) throw new Error("conversationId is required.");
  if (!text) throw new Error("text is required.");

  const allowedDirections = new Set(["inbound", "outbound", "system"]);
  const allowedSenders = new Set(["guest", "agent", "staff", "system"]);

  if (!allowedDirections.has(direction)) {
    throw new Error("direction must be one of inbound, outbound, system.");
  }
  if (!allowedSenders.has(sender)) {
    throw new Error("sender must be one of guest, agent, staff, system.");
  }

  const message = await prisma.botMessage.create({
    data: {
      conversationId,
      direction,
      sender,
      text,
      providerMessageId,
      intent,
      meta,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: message.createdAt },
  });

  return message;
}

export async function updateConversationState(id, patch = {}) {
  const conversationId = String(id || "").trim();
  if (!conversationId) throw new Error("conversation id is required.");

  const data = {};

  if (patch.status != null) {
    const status = String(patch.status).trim().toLowerCase();
    const allowed = new Set(["open", "closed", "handoff"]);
    if (!allowed.has(status)) throw new Error("Invalid status.");
    data.status = status;
  }

  if (patch.consentStatus != null) {
    const consentStatus = String(patch.consentStatus).trim().toLowerCase();
    const allowed = new Set(["unknown", "opted_in", "opted_out"]);
    if (!allowed.has(consentStatus)) throw new Error("Invalid consentStatus.");
    data.consentStatus = consentStatus;
  }

  if (patch.bookingId !== undefined) {
    data.bookingId = patch.bookingId ? String(patch.bookingId).trim() : null;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("No valid fields to update.");
  }

  return prisma.conversation.update({
    where: { id: conversationId },
    data,
  });
}

export async function upsertReviewRequest(payload) {
  const bookingId = String(payload?.bookingId || "").trim();
  const channel = normalizeChannel(payload?.channel);
  const phoneE164 = normalizePhoneE164(payload?.phone);
  const reviewUrl = String(payload?.reviewUrl || "").trim();
  const status = String(payload?.status || "queued").trim().toLowerCase();

  const allowed = new Set(["queued", "sent", "clicked", "failed"]);
  if (!bookingId) throw new Error("bookingId is required.");
  if (!phoneE164) throw new Error("A valid phone number is required.");
  if (!reviewUrl) throw new Error("reviewUrl is required.");
  if (!allowed.has(status)) throw new Error("Invalid status.");

  const now = new Date();
  const sentAt = status === "sent" ? now : null;
  const clickedAt = status === "clicked" ? now : null;

  return prisma.reviewRequest.upsert({
    where: {
      bookingId_channel: {
        bookingId,
        channel,
      },
    },
    update: {
      phoneE164,
      reviewUrl,
      status,
      sentAt,
      clickedAt,
    },
    create: {
      bookingId,
      channel,
      phoneE164,
      reviewUrl,
      status,
      sentAt,
      clickedAt,
    },
  });
}
