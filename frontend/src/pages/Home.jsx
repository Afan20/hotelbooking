import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

// IMPORTANT: make sure this file exists at:
// frontend/src/assets/images/wah-continental-logo.jpg
import hotelImage from "../assets/images/logo.jpg";

export default function Home() {
  return (
    <div className="pb-12">
      <Container>
        {/* Hero */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Left */}
            <div className="p-8 md:p-10">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                Front Desk Operations
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Manage bookings and room inventory with confidence.
              </h1>

              <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
                A secure workflow for staff: create bookings, verify guest identity, issue receipts,
                update stays, and checkout guests with clear status tracking.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/rooms"
                  className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  View rooms
                </Link>

                <Link
                  to="/bookings"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  View bookings
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-[#FAFAF8] p-4">
                  <div className="text-sm font-semibold text-slate-900">Room inventory</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Pricing updates and room availability management.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#FAFAF8] p-4">
                  <div className="text-sm font-semibold text-slate-900">Bookings</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Confirm, extend, cancel, and checkout stays.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#FAFAF8] p-4">
                  <div className="text-sm font-semibold text-slate-900">Receipts</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Printable receipts with guest identity fields.
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative min-h-[420px] bg-[#FAFAF8]">
              <img
                src={hotelImage}
                alt="Wah Continental Hotel"
                className="absolute inset-0 h-full w-full object-cover object-cente"
                
              />
            </div>
          </div>
        </section>

        {/* Credibility */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Professional UI</div>
            <div className="mt-1 text-sm text-slate-600">
              Consistent typography, spacing, and components across pages.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Role-gated admin</div>
            <div className="mt-1 text-sm text-slate-600">
              Admin pages remain protected while receptionist flow stays fast.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Operational clarity</div>
            <div className="mt-1 text-sm text-slate-600">
              Clear statuses (confirmed, cancelled, checked_out) and audit-friendly receipts.
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
