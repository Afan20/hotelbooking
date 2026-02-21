# Backend Agent Data Layer (MVP)

This backend now includes an agent-ready data layer for SMS/WhatsApp bots.

## What was added

- Structured hotel knowledge:
  - `Amenity`
  - `PolicyItem`
  - `BotTemplate`
- Conversation tracking:
  - `Conversation`
  - `BotMessage`
  - `ReviewRequest`
- Booking phone normalization:
  - `Booking.guestPhoneE164`
- Agent API key middleware:
  - `x-agent-key` required on `/api/agent/*`

## Setup

1. Copy env template:

```bash
cp .env.example .env
```

2. Apply migrations and seed:

```bash
npx prisma migrate deploy
npm run prisma:seed
```

3. Start backend:

```bash
npm run start
```

## Agent endpoints

All endpoints require header:

```text
x-agent-key: <AGENT_API_KEY>
```

### 1) Get context by phone

`POST /api/agent/context`

```json
{
  "phone": "+923001234567",
  "channel": "whatsapp",
  "language": "en"
}
```

Response includes:
- latest booking for this guest (if found)
- open conversation (auto-created if missing)
- active amenities, policies, templates

### 2) Log message

`POST /api/agent/messages`

```json
{
  "conversationId": "cm123...",
  "direction": "inbound",
  "sender": "guest",
  "text": "What time is breakfast?"
}
```

### 3) Update conversation state

`PATCH /api/agent/conversations/:id`

```json
{
  "status": "handoff",
  "consentStatus": "opted_in"
}
```

### 4) Upsert review request

`POST /api/agent/review-requests`

```json
{
  "bookingId": "cm_booking",
  "channel": "whatsapp",
  "phone": "+923001234567",
  "reviewUrl": "https://g.page/r/your-review-link",
  "status": "queued"
}
```
