export function requireFields(obj, fields) {
  const missing = fields.filter((f) => !obj?.[f]);
  if (missing.length) {
    return { ok: false, error: `Missing fields: ${missing.join(", ")}` };
  }
  return { ok: true };
}

export function isValidDateRange(checkIn, checkOut) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) return false;
  return outDate.getTime() > inDate.getTime();
}
