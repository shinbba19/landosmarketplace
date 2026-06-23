"use client";

import { setBookingStatus } from "@/lib/actions/bookings";

export function OwnerBookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  if (status !== "PENDING") {
    return <span className="text-foreground/40">-</span>;
  }

  return (
    <div className="flex justify-end gap-2">
      <form action={setBookingStatus.bind(null, bookingId, "APPROVED")}>
        <button type="submit" className="font-medium text-primary-700 hover:underline">
          อนุมัติ
        </button>
      </form>
      <form action={setBookingStatus.bind(null, bookingId, "REJECTED")}>
        <button type="submit" className="font-medium text-red-600 hover:underline">
          ปฏิเสธ
        </button>
      </form>
    </div>
  );
}
