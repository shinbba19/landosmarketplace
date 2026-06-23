import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ROLE_USER_EMAIL } from "@/lib/roles";
import { deleteListing } from "@/lib/actions/listings";
import { DeleteListingButton } from "@/components/DeleteListingButton";
import {
  formatCurrency,
  formatNumber,
  LISTING_STATUS_LABELS,
  SALE_MODE_LABELS,
} from "@/lib/format";

export default async function MyListingsPage() {
  const owner = await prisma.user.findUnique({
    where: { email: ROLE_USER_EMAIL.landowner },
  });

  const listings = owner
    ? await prisma.listing.findMany({
        where: { ownerId: owner.id },
        orderBy: { createdAt: "desc" },
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">ประกาศของฉัน</h1>
          <p className="mt-1 text-foreground/60">จัดการประกาศที่ดินที่คุณสร้างไว้</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/my-listings/bookings"
            className="rounded-full border border-primary-300 bg-primary-50 px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100"
          >
            การจองทั้งหมด
          </Link>
          <Link
            href="/listings/new"
            className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            + ลงประกาศใหม่
          </Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-12 text-center text-foreground/60">
          ยังไม่มีประกาศ เริ่มต้นด้วยการลงประกาศใหม่
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-3 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-primary-50">
                  {listing.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{listing.title}</h3>
                  <p className="text-sm text-foreground/60">
                    {listing.district}, {listing.province} ·{" "}
                    {formatNumber(listing.landArea)} ไร่ · {formatCurrency(listing.wholeLandPrice)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${
                        listing.status === "PUBLISHED"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {LISTING_STATUS_LABELS[listing.status]}
                    </span>
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-700">
                      {SALE_MODE_LABELS[listing.saleMode]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <Link
                  href={`/listings/${listing.id}`}
                  className="rounded-full border border-primary-200 px-4 py-1.5 font-medium text-foreground/70 hover:bg-primary-50"
                >
                  ดูประกาศ
                </Link>
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className="rounded-full border border-primary-200 px-4 py-1.5 font-medium text-foreground/70 hover:bg-primary-50"
                >
                  แก้ไข
                </Link>
                <Link
                  href={`/listings/${listing.id}/feasibility`}
                  className="rounded-full border border-primary-300 bg-primary-50 px-4 py-1.5 font-medium text-primary-700 hover:bg-primary-100"
                >
                  วิเคราะห์ความเป็นไปได้
                </Link>
                {listing.saleMode !== "WHOLE" && (
                  <Link
                    href={`/listings/${listing.id}/subdivision`}
                    className="rounded-full border border-primary-300 bg-primary-50 px-4 py-1.5 font-medium text-primary-700 hover:bg-primary-100"
                  >
                    จัดการแปลง
                  </Link>
                )}
                <Link
                  href={`/listings/${listing.id}/service-request`}
                  className="rounded-full border border-primary-200 px-4 py-1.5 font-medium text-foreground/70 hover:bg-primary-50"
                >
                  ขอคำปรึกษาผู้เชี่ยวชาญ
                </Link>
                <DeleteListingButton action={deleteListing.bind(null, listing.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
