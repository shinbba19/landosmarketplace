"use client";

import { setBookingStatus } from "@/lib/actions/bookings";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from "@/lib/format";

const STATUSES = ["PENDING", "INTERESTED", "VIEWING", "RESERVED", "CANCELLED"] as const;

export function OwnerBookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const action = setBookingStatus.bind(null, bookingId);

  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.target.form?.requestSubmit()}
        className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${BOOKING_STATUS_COLORS[status] ?? "bg-zinc-100 text-zinc-700"}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {BOOKING_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
