export function calcNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const ms = end.getTime() - start.getTime();
  const nights = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (!Number.isFinite(nights) || nights <= 0) throw new Error("Invalid dates");
  return nights;
}

export function calcPricing(pricePerNight, nights) {
  const subtotal = pricePerNight * nights;
  const tax = subtotal * 0.10;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}
