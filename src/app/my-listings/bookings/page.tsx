import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ROLE_USER_EMAIL } from "@/lib/roles";
import { BOOKING_STATUS_LABELS } from "@/lib/format";
import { OwnerBookingActions } from "@/components/OwnerBookingActions";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  APPROVED: "bg-primary-100 text-primary-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default async function OwnerBookingsPage() {
  const owner = await prisma.user.findUnique({
    where: { email: ROLE_USER_EMAIL.landowner },
  });

  const bookings = owner
    ? await prisma.booking.findMany({
        where: {
          OR: [
            { listing: { ownerId: owner.id } },
            { plot: { project: { listing: { ownerId: owner.id } } } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          listing: { select: { id: true, title: true } },
          plot: {
            select: {
              label: true,
              project: { select: { listing: { select: { id: true, title: true } } } },
            },
          },
        },
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/my-listings"
          className="text-sm font-medium text-primary-700 hover:underline"
        >
          ← กลับไปประกาศของฉัน
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">การจองที่ดิน</h1>
        <p className="mt-1 text-foreground/60">รายการจองทั้งหมดจากผู้ซื้อ</p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-12 text-center text-foreground/60">
          ยังไม่มีการจอง
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-primary-100 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-primary-100 text-xs text-foreground/50">
              <tr>
                <th className="px-4 py-3">ประกาศ / แปลง</th>
                <th className="px-4 py-3">ผู้จอง</th>
                <th className="px-4 py-3">ติดต่อ</th>
                <th className="px-4 py-3">ข้อความ</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const listingId =
                  booking.listing?.id ?? booking.plot?.project.listing.id ?? "";
                const listingTitle =
                  booking.listing?.title ?? booking.plot?.project.listing.title ?? "";
                const plotLabel = booking.plot?.label ?? null;

                return (
                  <tr key={booking.id} className="border-b border-primary-50 last:border-0">
                    <td className="px-4 py-3 text-foreground/70">
                      <Link
                        href={plotLabel ? `/listings/${listingId}/subdivision` : `/listings/${listingId}`}
                        className="hover:underline"
                      >
                        {listingTitle}
                      </Link>
                      <span className="ml-1 font-medium text-foreground">
                        ({plotLabel ?? "ทั้งแปลง"})
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{booking.name}</td>
                    <td className="px-4 py-3 text-foreground/70">
                      <p>{booking.phone}</p>
                      <p>{booking.email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground/70">{booking.message ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[booking.status] ?? STATUS_STYLES.PENDING}`}
                      >
                        {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <OwnerBookingActions bookingId={booking.id} status={booking.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
