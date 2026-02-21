function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function normalizePhoneE164(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  if (raw.startsWith("+")) {
    const normalized = `+${digitsOnly(raw)}`;
    return normalized.length > 1 ? normalized : null;
  }

  if (raw.startsWith("00")) {
    const normalized = `+${digitsOnly(raw.slice(2))}`;
    return normalized.length > 1 ? normalized : null;
  }

  const digits = digitsOnly(raw);
  if (!digits) return null;

  const defaultCountryCode = String(process.env.DEFAULT_COUNTRY_CODE || "+92").trim();
  const ccDigits = digitsOnly(defaultCountryCode);
  if (!ccDigits) return `+${digits}`;
  if (digits.startsWith(ccDigits)) return `+${digits}`;

  const nationalDigits = digits.startsWith("0") ? digits.slice(1) : digits;
  return `+${ccDigits}${nationalDigits}`;
}

export function phoneLastDigits(value, count = 7) {
  const digits = digitsOnly(value);
  if (!digits) return "";
  return digits.slice(-Math.max(1, Number(count) || 7));
}
