"use client";

import { useRef } from "react";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from "@/lib/format";

const STATUSES = ["PENDING", "INTERESTED", "VIEWING", "RESERVED", "CANCELLED"] as const;

export function OwnerBookingActions({
  bookingId,
  status,
  action,
}: {
  bookingId: string;
  status: string;
  action: (formData: FormData) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="bookingId" value={bookingId} />
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className={`rounded-full border-0 px-3 py-1 text-xs font-semibold cursor-pointer ${BOOKING_STATUS_COLORS[status] ?? "bg-zinc-100 text-zinc-700"}`}
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
