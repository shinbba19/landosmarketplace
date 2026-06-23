import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Gallery } from "@/components/Gallery";
import { PropertyTabs } from "@/components/PropertyTabs";
import { PropertyMap } from "@/components/PropertyMap";
import { formatCurrency, formatNumber, SALE_MODE_LABELS } from "@/lib/format";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      owner: true,
      subdivision: { include: { plots: true } },
      bookings: { where: { plotId: null, status: { not: "CANCELLED" } }, take: 1 },
    },
  });

  if (!listing) notFound();

  const plots = (listing.subdivision?.plots ?? []).map((p) => ({
    id: p.id,
    label: p.label,
    points: p.points,
    status: p.status,
    price: p.price,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-4">
        <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
          {SALE_MODE_LABELS[listing.saleMode]}
        </span>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{listing.title}</h1>
        <p className="mt-1 text-foreground/60">
          {listing.subdistrict}, {listing.district}, {listing.province}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Gallery images={listing.images.map((img) => img.url)} alt={listing.title} />

          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-foreground">รายละเอียด</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
              {listing.description}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-foreground/50">ขนาดที่ดิน</dt>
                <dd className="font-semibold">{formatNumber(listing.landArea)} ไร่</dd>
              </div>
              <div>
                <dt className="text-foreground/50">ราคาขายยกแปลง</dt>
                <dd className="font-semibold">{formatCurrency(listing.wholeLandPrice)}</dd>
              </div>
              <div>
                <dt className="text-foreground/50">รูปแบบการขาย</dt>
                <dd className="font-semibold">{SALE_MODE_LABELS[listing.saleMode]}</dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-primary-100 shadow-sm">
            <div className="h-72 w-full">
              <PropertyMap lat={listing.lat} lng={listing.lng} label={listing.title} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <PropertyTabs
            listingId={listing.id}
            saleMode={listing.saleMode}
            landArea={listing.landArea}
            wholeLandPrice={listing.wholeLandPrice}
            ownerName={listing.owner.name}
            plots={plots}
            boundary={listing.subdivision?.boundaryPoints}
            hasActiveBooking={listing.bookings.length > 0}
          />
        </div>
      </div>
    </div>
  );
}
