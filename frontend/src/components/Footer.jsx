import React from "react";
import Container from "./Container.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <Container>
        <div className="flex flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Wah Continental Hotel
            </div>
            <div className="text-sm text-slate-600">
              wahcontinentalhotel@gmail.com
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Staff Console • Bookings • Rooms
          </div>
        </div>
      </Container>
    </footer>
  );
}
